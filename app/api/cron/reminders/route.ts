import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { formatInTimeZone } from "date-fns-tz";
import { es } from "date-fns/locale";

export const dynamic = 'force-dynamic'
export const maxDuration = 60 // Permite hasta 60s en Vercel Pro por si hay muchas citas

export async function GET(request: Request) {
    const startTime = Date.now()

    try {
        // 1. SEGURIDAD: Verificar clave de Vercel (con el truco para entorno local)
        const authHeader = request.headers.get('authorization')
        if (process.env.NODE_ENV === 'production') {
            if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
                return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
            }
        }

        const supabaseAdmin = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        // 2. CALCULAR FECHA DE MAÑANA (En hora de Madrid, como bien dedujiste antes)
        const timeZone = 'Europe/Madrid'
        const dateStringMadrid = formatInTimeZone(new Date(), timeZone, 'yyyy-MM-dd')
        const todayInMadrid = new Date(`${dateStringMadrid}T12:00:00Z`)
        
        const tomorrow = new Date(todayInMadrid)
        tomorrow.setDate(tomorrow.getDate() + 1)
        const dateStringTomorrow = formatInTimeZone(tomorrow, timeZone, 'yyyy-MM-dd')

        console.log(`[CRON RECORDATORIOS] Buscando reservas para mañana: ${dateStringTomorrow}...`)

        // 3. OBTENER CITAS DE MAÑANA CON SUS DATOS
        const { data: bookings, error } = await supabaseAdmin
            .from('bookings')
            .select(`
                id,
                start_time,
                customer_email,
                customer_name,
                businesses (name, logo_url),
                booking_items (service_name, price), 
                profiles (full_name)
            `)
            .eq('date', dateStringTomorrow)
            .eq('status', 'confirmed')
        
        if (error) throw error

        if (!bookings || bookings.length === 0) {
            console.log('[CRON RECORDATORIOS] No hay reservas para mañana.')
            return NextResponse.json({ message: 'Sin reservas para mañana' })
        }

        console.log(`[CRON RECORDATORIOS] Procesando ${bookings.length} envíos...`)

        const DASHBOARD_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001'
        const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000'

        // 4. DISPARAR LOS AVISOS AL MOTOR DISPATCH EN PARALELO
        const promises = bookings.map(async (booking) => {
            // Si el cliente no dejó email, nos lo saltamos
            if (!booking.customer_email) return Promise.resolve({ skipped: true })

            const startTimeDate = new Date(booking.start_time)
            const timeString = formatInTimeZone(startTimeDate, timeZone, 'HH:mm')
            const dateFormatted = formatInTimeZone(startTimeDate, timeZone, "EEEE d 'de' MMMM", { locale: es })
            
            // Extracción segura de datos
            const businessData: any = Array.isArray(booking.businesses) ? booking.businesses[0] : booking.businesses
            const localName = businessData?.name || 'Nuestro Local'
            const localLogo = businessData?.logo_url || ''
            
            const staffData: any = booking.profiles
            const staffName = staffData?.full_name || 'El equipo'
            
            const items = booking.booking_items || []
            const servicesList = items.map((i: any) => i.service_name)
            const totalPrice = items.reduce((acc: number, i: any) => acc + i.price, 0)

            // Llamamos a nuestro propio motor
            return fetch(`${DASHBOARD_URL}/api/notifications/dispatch`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.API_SECRET_KEY}`
                },
                body: JSON.stringify({
                    type: 'booking_reminder',
                    email: booking.customer_email,
                    customerName: booking.customer_name,
                    date: dateFormatted,
                    time: timeString,
                    services: servicesList,
                    totalPrice: totalPrice,
                    staffName: staffName,
                    businessName: localName,
                    logoUrl: localLogo,
                    appUrl: FRONTEND_URL
                })
            })
        })

        // 5. ESPERAR A QUE TODOS LOS FETCH TERMINEN
        const results = await Promise.allSettled(promises)

        const successCount = results.filter(r => r.status === 'fulfilled').length
        const failCount = results.filter(r => r.status === 'rejected').length
        const duration = (Date.now() - startTime) / 1000

        console.log(`[CRON RECORDATORIOS] Fin. Éxito: ${successCount}, Fallos: ${failCount}, Tiempo: ${duration}s`)

        return NextResponse.json({
            success: true,
            dateTarget: dateStringTomorrow,
            processed: bookings.length,
            successful: successCount,
            failed: failCount,
            duration: `${duration}s`
        })

    } catch (error: any) {
        console.error('[CRON RECORDATORIOS FATAL ERROR]: ', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}