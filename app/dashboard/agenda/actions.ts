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

        if (!profile) return { error: 'No autorizado' }

        const { data: updatedBooking, error: updateError } = await supabase
            .from('bookings')
            .update({ status: 'cancelled' })
            .eq('id', bookingId)
            .eq('business_id', profile.business_id)
            .select(`
                *,
                businesses (
                    name, 
                    logo_url
                )    
            `)
            .single()

        if (updateError || !updatedBooking) {
            console.error('Error actualizando el estado de la reserva en BD: ', updateError)
            return { error: 'Hubo un error al cancelar la cita en la base de datos.' }
        }

        let dispatchSuccess = true

        if (updatedBooking.customer_email) {
            try {
                const dateObj = new Date(`${updatedBooking.date}T00:00:00`)
                const formattedDate = format(dateObj, "EEEE, d 'de' MMMM", { locale: es })

                const formattedTime = updatedBooking.start_time
                    ? formatInTimeZone(updatedBooking.start_time, TIMEZONE, 'HH:mm')
                    : '--:--'

                const businessData = Array.isArray(updatedBooking.businesses) ? updatedBooking.businesses[0] : updatedBooking.businesses 
                const businessName = businessData?.name || 'Nuestro Local'
                const businessLogo = businessData?.logo_url || ''

                const DASHBOARD_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001'
                
                await fetch(`${DASHBOARD_URL}/api/notifications/dispatch`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${process.env.API_SECRET_KEY}`
                    },
                    body: JSON.stringify({
                        type: 'booking_cancellation',
                        email: updatedBooking.customer_email,
                        customerName: updatedBooking.customer_name,
                        date: formattedDate,
                        time: formattedTime,
                        businessName: businessName,
                        logoUrl: businessLogo
                    })
                })
            } catch (error) {
                console.error('Error: ', error)
                dispatchSuccess = false
            }
        } 

        revalidatePath('/dashboard/agenda')
        revalidatePath('/dashboard/clientes')

        return { 
            success: true,
            warning: !dispatchSuccess ? 'Cita cancelada, pero hubo un error al enviar las notificaciones al cliente' : null
        }

    } catch (error) {
        console.error(error)
        return { error: 'Hubo un error al cancelar la cita.' }
    }
}