'use server'

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { Resend } from 'resend';
import CancelBookingEmail from '@/components/emails/CancelBookingEmail';
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { formatInTimeZone } from 'date-fns-tz';
import { render } from '@react-email/render'; // <--- NUEVA IMPORTACIÓN

const TIMEZONE = 'Europe/Madrid';
const resend = new Resend(process.env.RESEND_API_KEY);

export async function cancelBookingAction(bookingId: string) {
    try {
        const supabase = await createClient()
        
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return { error: 'No estás autenticado.' }

        const { data: profile } = await supabase
            .from('profiles')
            .select('business_id')
            .eq('id', user.id)
            .single()

        if (!profile?.business_id) return { error: 'No autorizado' }

        // 1. OBTENER LOS DATOS
        const { data: booking, error: fetchError } = await supabase
            .from('bookings')
            .select(`
                *,
                businesses ( 
                    name,
                    logo_url 
                )
            `)
            .eq('id', bookingId)
            .eq('business_id', profile.business_id)
            .single()

        if (fetchError || !booking) throw new Error('No se encontró la cita')

        // 2. CANCELAR EN BD
        const { error: updateError } = await supabase
            .from('bookings')
            .update({ status: 'cancelled' })
            .eq('id', bookingId)
            .eq('business_id', profile.business_id)

        if (updateError) throw updateError

        let emailSent = true

        // 3. ENVIAR CORREO
        try {
            const dateObj = new Date(`${booking.date}T00:00:00`);
            const formattedDate = format(dateObj, "EEEE, d 'de' MMMM", { locale: es })
            
            const formattedTime = booking.start_time 
                ? formatInTimeZone(booking.start_time, TIMEZONE, 'HH:mm') 
                : '--:--';

            const businessName = booking.businesses?.name || 'nuestro local'
            const businessLogo = booking.businesses?.logo_url || '/icon.png'

            // Renderizamos el componente de React a código HTML puro
            const htmlOutput = await render(CancelBookingEmail({ 
                customerName: booking.customer_name,
                businessName: businessName,
                date: formattedDate,
                time: formattedTime,
                logoUrl: businessLogo
            }));

            // Lo enviamos usando la propiedad 'html' en lugar de 'react'
            await resend.emails.send({
                from: 'Reservas Kupo <onboarding@resend.dev>', //* CAMBIAR AL VERIFICAR TU DOMINIO
                to: [booking.customer_email],
                subject: `Tu cita en ${businessName} ha sido cancelada`,
                html: htmlOutput // <--- USAMOS EL HTML GENERADO
            });
            
        } catch (emailError) {
            console.error('Error enviando el correo con Resend:', emailError)
            emailSent = false
        }

        // 4. REFRESCAR PANTALLA
        revalidatePath('/dashboard/agenda')

        return { 
            success: true,
            warning: !emailSent ? 'Cita cancelada pero hubo un error al enviar el correo al cliente.' : null 
        }

    } catch (error) {
        console.error(error)
        return { error: 'Hubo un error al cancelar la cita.' }
    }
}