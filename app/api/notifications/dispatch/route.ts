import BookingEmail from "@/components/emails/BookingEmail"
import CancelBookingEmail from "@/components/emails/CancelBookingEmail"
import { createClient } from "@supabase/supabase-js"
import { error } from "console"
import { NextResponse } from "next/server"
import React from "react"
import { Resend } from "resend"
import webpush from "web-push"

export async function POST (request: Request) {
    try {
        const authHeader = request.headers.get('authorization')
        if (process.env.API_SECRET_KEY && authHeader !== `Bearer ${process.env.API_SECRET_KEY}`) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
        }

        const body = await request.json()
        const {
            type,
            email, customerName, date, time, services, totalPrice, staffName, businessName, businessAddress, logoUrl, appUrl
        } = body

        if (!email) return NextResponse.json({ error: 'Email requerido' }, { status: 400 })

        console.log(`🚀 Despachando notificaciones [${type}] para: ${email}`)

        const resend = new Resend(process.env.RESEND_API_KEY)
        webpush.setVapidDetails(
            process.env.VAPID_SUBJECT || 'mailto:test@test.com',
            process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
            process.env.VAPID_PRIVATE_KEY!
        )

        const supabaseAdmin = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        )

        let emailComponent
        let emailSubject = ''
        let pushTitle = ''
        let pushBody = ''

        if (type === 'booking_confirmation') {
            emailSubject = `✅ ¡Tu cita en ${businessName} está confirmada!`
            emailComponent = React.createElement(BookingEmail, {
                customerName, date, time, services, totalPrice, staffName, businessName, businessAddress, logoUrl,
                cancelLink: `${appUrl}/reserva`,
                businessMap: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(businessAddress)}`
            })
            pushTitle = '✅ Reserva Confirmada'
            pushBody = `Hola ${customerName}, tu cita el ${date} a las ${time} ha sido registrada.`
        } else if (type === 'booking_cancellation') {
            emailSubject = `❌ Cancelación de cita en ${businessName}`
            emailComponent= React.createElement(CancelBookingEmail, {
                customerName, businessName, date, time, logoUrl
            })
            pushTitle= '❌ Reserva Cancelada'
            pushBody = `Hola ${customerName}, tu cita el ${date} a las ${time} en ${businessName} ha sido cancelada.`
        } else {
            return NextResponse.json({ error: 'Tipo de notificación no válido' })
        }

        const emailPromise = resend.emails.send({
            from: 'Reservas Kupo <onboarding@resend.dev>', // ⚠️ CAMBIAR POR TU DOMINIO EN PRODUCCIÓN
            to: [email],
            subject: emailSubject,
            react: emailComponent
        }).catch(error => {
            console.error('Error enviando email: ', error)
            throw error
        }) 

        const pushPromise = (async () => {
            const { data: subscriptions } = await supabaseAdmin
                .from('push_subscriptions')
                .select('subscription')
                .eq('user_email', email)

            if (!subscriptions || subscriptions.length === 0) return { pushed: 0 }
            
            const payload = JSON.stringify({
                title: pushTitle,
                body: pushBody,
                url: `${appUrl}/reserva`
            })

            const results = await Promise.allSettled(
                subscriptions.map(sub => 
                    webpush.sendNotification(sub.subscription, payload).catch(async error => {
                        if (error.statusCode === 410) {
                            console.log('🗑️ Suscripción caducada eliminada.')
                            await supabaseAdmin.from('push_subscriptions').delete().eq('subscription', sub.subscription)
                        }
                        throw error
                    })
                )
            )
            return { pushed: results.filter(r => r.status === 'fulfilled').length }
        })().catch(error => {
            console.error('Error enviando push: ', error)
            return { pushed: 0 }
        })

        const [emailResult, pushResult] = await Promise.allSettled([emailPromise, pushPromise])

        return NextResponse.json({
            success: true,
            email: emailResult.status === 'fulfilled' ? 'Sent' : 'Failed',
            push: pushResult.status === 'fulfilled' ? 'Sent' : 'Failed'
        })


    } catch (error: any) {
        console.error('💥 Error fatal en Dispatcher:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}