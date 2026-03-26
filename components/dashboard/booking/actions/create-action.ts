'use server'

import { createClient } from "@/utils/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js"; // <-- Importamos el cliente normal para el Admin
import { revalidatePath } from "next/cache";
import { fromZonedTime } from "date-fns-tz";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";
import { headers } from "next/headers";

const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN
})

const rateLimit = new Ratelimit({
    redis: redis,
    limiter: Ratelimit.slidingWindow(10, '1m')
}) 

// Helper para convertir hora a minutos
const timeToMins = (time: string) => {
    const [h, m] = time.split(':').map(Number);
    return h * 60 + m;
}

// Interfaz estricta para los parámetros de entrada del modal
interface CreateManualBookingParams {
    bookingDate: string;
    bookingTime: string;
    staffId: string;
    services: any[];
    client: { name: string; email: string; phone: string };
}

export async function createManualBookingAction(params: CreateManualBookingParams) {

    const headersList = await headers()
        const ip = headersList.get("x-forwarded-for") ?? "127.0.0.1";
    
        const { success } = await rateLimit.limit(`createBooking_${ip}`)
    
        if (!success) {
            // Si no tiene éxito, cortamos la ejecución ANTES de tocar Supabase
            return { error: 'Demasiados intentos. Por favor, espera un minuto.' };
        }

    try {
        const { bookingDate, bookingTime, staffId, services, client } = params;

        // 1. INICIALIZACIÓN Y AUTENTICACIÓN
        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        
        if (authError || !user) return { error: 'No estás autenticado.' };

        // Obtenemos el business_id del admin logueado
        const { data: profile } = await supabase
            .from('profiles')
            .select(`
                role,
                business_id,
                businesses (
                    name,
                    address,
                    logo_url
                )
                `)
            .eq('id', user.id)
            .single();

        if (!profile?.business_id) return { error: 'Error obteniendo datos del negocio.' };
        const businessId = profile.business_id;
        
        const businessData = Array.isArray(profile.businesses)
            ? profile.businesses[0]
            : profile.businesses

        const localName = businessData?.name || 'Nuestro Local'
        const localAddress = businessData?.address || 'Dirección no disponible'
        const localLogo = businessData?.logo_url || ''

        // Validación básica
        if (!bookingDate || !bookingTime || !staffId || !services || services.length === 0 || !client.name) {
            return { error: 'Faltan datos obligatorios' };
        }

        // 2. VALIDAR SERVICIOS Y PRECIOS
        const servicesIds = services.map(s => s.id);

        const { data: dbServices, error: servicesError } = await supabase
            .from('services')
            .select('id, title, price, duration')
            .eq('business_id', businessId)
            .in('id', servicesIds);

        if (servicesError || !dbServices || dbServices.length === 0) {
            console.error('Error services:', servicesError);
            return { error: 'Error validando servicios en base de datos' };
        }

        // Calcular totales seguros
        const safeTotalPrice = dbServices.reduce((acc, s) => acc + s.price, 0);
        const safeTotalDuration = dbServices.reduce((acc, s) => acc + s.duration, 0);

        // 3. GESTIÓN DEL CLIENTE
        let customerId: string;
        
        // Buscar si el cliente ya existe por email o por teléfono
        let customerQuery = supabase.from('customers').select('id').eq('business_id', businessId);
        
        if (client.email && client.email.trim() !== '') {
            customerQuery = customerQuery.eq('email', client.email);
        } else if (client.phone && client.phone.trim() !== '') {
            customerQuery = customerQuery.eq('phone', client.phone);
        } else {
            // Si no tiene ni email ni teléfono, forzamos a que no lo encuentre para crearlo nuevo
            customerQuery = customerQuery.eq('id', '00000000-0000-0000-0000-000000000000');
        }

        const { data: existingCustomer } = await customerQuery.maybeSingle();

        if (existingCustomer) {
            customerId = existingCustomer.id;
            await supabase.from('customers').upsert({
                id: customerId,
                business_id: businessId,
                email: client.email || null,
                full_name: client.name,
                phone: client.phone || null
            });
        } else {
            const { data: newCustomer, error: createError } = await supabase
                .from('customers')
                .insert({
                    full_name: client.name,
                    email: client.email || null,
                    business_id: businessId,
                    phone: client.phone || null
                })
                .select()
                .single();

            if (createError) {
                console.error('Error creando cliente:', createError);
                return { error: `Error creando cliente.` };
            }
            customerId = newCustomer.id;
        }

        // 4. CÁLCULO DE FECHAS (Usando Zonas Horarias correctamente)
        const timeZone = 'Europe/Madrid';
        const dateTimeStringStart = `${bookingDate}T${bookingTime}:00`;
        const startTimeUtc = fromZonedTime(dateTimeStringStart, timeZone);
        const endTimeUtc = new Date(startTimeUtc.getTime() + safeTotalDuration * 60000);

        // 5. ASIGNACIÓN INTELIGENTE DE STAFF ('any')
        let assignedStaffId = staffId;
        const [ hours, minutes ] = bookingTime.split(':').map(Number);
        const startMins = hours * 60 + minutes;
        const endMins = startMins + safeTotalDuration;

        if (assignedStaffId === 'any') {
            const dayOfWeek = startTimeUtc.getUTCDay();

            const { data: candidates } = await supabase
                .from('staff_schedules')
                .select('*')
                .eq('business_id', businessId)
                .eq('day_of_week', dayOfWeek)
                .eq('is_working', true);

            if (!candidates || candidates.length === 0) {
                return { error: 'No hay personal disponible este día' };
            }

            const candidatesIds = candidates.map(c => c.staff_id);

            const { data: existingBookings } = await supabase
                .from('bookings')
                .select('staff_id, start_time, end_time')
                .eq('business_id', businessId)
                .eq('date', bookingDate)
                .in('staff_id', candidatesIds)
                .neq('status', 'cancelled')
                .neq('status', 'rejected');

            const { data: existingBlocks } = await supabase
                .from('blocked_periods')
                .select('start_date, end_date, staff_id')
                .eq('business_id', businessId)
                .in('staff_id', candidatesIds)
                .eq('status', 'active');

            const shuffledCandidates = candidates.sort(() => 0.5 - Math.random());

            const validCandidate = shuffledCandidates.find(candidate => {
                const shiftStart = timeToMins(candidate.start_time);
                const shiftEnd = timeToMins(candidate.end_time);

                if (startMins < shiftStart || endMins > shiftEnd) return false;

                if (candidate.break_start && candidate.break_end) {
                    const breakStart = timeToMins(candidate.break_start);
                    const breakEnd = timeToMins(candidate.break_end);
                    if (startMins < breakEnd && endMins > breakStart) return false;
                }

                const myBookings = existingBookings?.filter(b => b.staff_id === candidate.staff_id) || [];
                const hasBookingConflict = myBookings.some(booking => {
                    const bStart = new Date(booking.start_time);
                    const bEnd = new Date(booking.end_time);
                    return (startTimeUtc < bEnd && endTimeUtc > bStart);
                });

                if (hasBookingConflict) return false;

                const myBlocks = existingBlocks?.filter(b => b.staff_id === candidate.staff_id) || [];
                const hasBlockConflict = myBlocks.some(block => {
                    const bStart = new Date(block.start_date);
                    const bEnd = new Date(block.end_date);
                    return (startTimeUtc < bEnd && endTimeUtc > bStart);
                });

                return !hasBlockConflict;
            });

            if (validCandidate) {
                assignedStaffId = validCandidate.staff_id;
            } else {
                return { error: 'Ya no hay huecos disponibles a esta hora.' };
            }
        }

        // 6. VALIDACIÓN DE ÚLTIMA MILLA (ANTI RACE-CONDITION)
        const { data: lastSecondBookings } = await supabase
            .from('bookings')
            .select('start_time, end_time')
            .eq('business_id', businessId)
            .eq('staff_id', assignedStaffId)
            .eq('date', bookingDate)
            .neq('status', 'cancelled')
            .neq('status', 'rejected');

        const isBooked = (lastSecondBookings || []).some(booking => {
            const bStart = new Date(booking.start_time);
            const bEnd = new Date(booking.end_time);
            return (startTimeUtc < bEnd && endTimeUtc > bStart);
        });

        if (isBooked) return { error: 'Lo sentimos, este hueco acaba de ser reservado.' };

        const { data: lastSecondBlocks } = await supabase
            .from('blocked_periods')
            .select('start_date, end_date')
            .eq('business_id', businessId)
            .eq('staff_id', assignedStaffId)
            .eq('status', 'active');

        const isBlocked = (lastSecondBlocks || []).some(block => {
            const bStart = new Date(block.start_date);
            const bEnd = new Date(block.end_date);
            return (startTimeUtc < bEnd && endTimeUtc > bStart);
        });

        if (isBlocked) return { error: 'Este profesional acaba de marcar este periodo como no disponible.' };

        // 7. INSERTAR RESERVA
        const bookingData = {
            business_id: businessId,
            customer_id: customerId,
            staff_id: assignedStaffId,
            date: bookingDate,
            start_time: startTimeUtc.toISOString(),
            end_time: endTimeUtc.toISOString(),
            status: 'confirmed', // Directamente confirmada porque la hace el admin
            total_price: safeTotalPrice,
            payment_method: 'venue', // Método por defecto para reservas manuales
            customer_name: client.name,
            customer_email: client.email || null,
            customer_phone: client.phone || null
        };

        const itemsData = dbServices.map(s => ({
            business_id: businessId,
            service_id: s.id,
            price: s.price,
            duration: s.duration,
            service_name: s.title
        }));

        // --- SOLUCIÓN RLS: Usamos el cliente Admin para insertar ---
        const supabaseAdmin = createAdminClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        const { data: newBooking, error: transactionError } = await supabaseAdmin.rpc('create_booking_with_items', {
            p_booking_data: bookingData,
            p_booking_items: itemsData
        });
        // -------------------------------------------------------------

        if (transactionError || !newBooking) {
            console.error('Error insertando en transacción: ', transactionError);
            if (transactionError?.message?.includes('CONFLICT')) {
                return { error: 'Lo sentimos, este hueco acaba de ser reservado.' };
            }
            return { error: 'Error al procesar la reserva en la base de datos.' };
        }

        // ---> ACTUALIZA LA AGENDA AUTOMÁTICAMENTE <---
        revalidatePath('/dashboard/agenda');

        const { data: staffName } = await supabase
            .from('profiles')
            .select('full_name')
            .eq('id', assignedStaffId)
            .single()

        if (client.email && client.email.trim() !== '') {
            const DASHBOARD_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001'
            const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000'

            const serviceNames = dbServices.map(s => s.title)
            const formattedDate = format(startTimeUtc, "EEEE d 'de' MMMM", { locale: es })

            const baseUrl = DASHBOARD_URL.startsWith('http') ? DASHBOARD_URL : `https://${DASHBOARD_URL}`;
            const urlDestino = `${baseUrl}/api/notifications/dispatch/frontend`;
                
            console.log(`🚀 Intentando enviar petición de correo a: ${urlDestino}`);

            try {
                const response = await fetch(`${urlDestino}/api/notifications/dispatch/frontend`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${process.env.API_SECRET_KEY}`
                    },
                    body: JSON.stringify({
                        type: 'booking_confirmation',
                        email: client.email,
                        customerName: client.name,
                        date: formattedDate,
                        time: bookingTime,
                        services: serviceNames,
                        totalPrice: safeTotalPrice,
                        staffName: staffName?.full_name,
                        businessName: localName,
                        businessAddress: localAddress,
                        logoUrl: localLogo,
                        appUrl: FRONTEND_URL 
                    })
                })

                if (!response.ok) {
                    const errorText = await response.text();
                    console.error(`💥 ERROR DE LA API AL ENVIAR CORREO (${response.status}):`, errorText);
                } else {
                    console.log('✅ Petición de correo enviada y aceptada correctamente por la API');
                }
            } catch (error) {
                console.error('💥 ERROR FATAL DE RED al comunicar con el dispatcher: ', error);
            }
        }

        return { success: true, bookingId: newBooking.id };

    } catch (error) {
        console.error('SERVER ERROR (createManualBookingAction):', error);
        return { error: 'Error inesperado del servidor.' };
    }
}