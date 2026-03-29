import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"
import webpush from "web-push"

export async function POST(request: Request) {
    try {
        const authHeader = request.headers.get('authorization')
        if (process.env.API_SECRET_KEY && authHeader !== `Bearer ${process.env.API_SECRET_KEY}`) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
        }

        const body = await request.json()
        const { type, email, customerName, date, time } = body

        if (!email) return NextResponse.json({ error: 'Email requerido' }, { status: 400 })

        // Configuración de Web Push
        webpush.setVapidDetails(
            process.env.VAPID_SUBJECT || 'mailto:test@test.com',
            process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
            process.env.VAPID_PRIVATE_KEY!
        )

        const supabaseAdmin = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!, 
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        )

        let pushTitle = ''
        let pushBody = ''
        const dashboardUrl = process.env.DASHBOARD_URL || 'http://localhost:3001'
        const pushUrl = `${dashboardUrl}/dashboard/agenda`

        // === DETERMINAR EL MENSAJE ===
        if (type === 'staff_new_booking') {
            pushTitle = '📅 ¡Nueva Reserva!'
            pushBody = `${customerName} ha reservado contigo el ${date} a las ${time}.`
        } else if (type === 'staff_booking_cancelled') {
            pushTitle = '❌ Cita Cancelada'
            pushBody = `${customerName} ha cancelado su cita del ${date} a las ${time}.`
        } else {
            return NextResponse.json({ error: 'Tipo no válido para dashboard' }, { status: 400 })
        }

        // === ENVIAR NOTIFICACIÓN PUSH ===
        const pushResult = await (async () => {
            // Filtramos: Solo enviamos si el interruptor está activo
            const { data: subscriptions } = await supabaseAdmin
                .from('push_subscriptions')
                .select('subscription')
                .eq('user_email', email)
                .eq('is_active', true)
                .not('staff_id', 'is', null)

            if (!subscriptions || subscriptions.length === 0) return { pushed: 0 }

            const payload = JSON.stringify({ title: pushTitle, body: pushBody, url: pushUrl })
            
            const results = await Promise.allSettled(
                subscriptions.map(sub => webpush.sendNotification(sub.subscription, payload).catch(async e => {
                    if (e.statusCode === 410) {
                        console.log('🗑️ Suscripción caducada eliminada.')
                        await supabaseAdmin.from('push_subscriptions').delete().eq('subscription', sub.subscription)
                    }
                    throw e
                }))
            )
            return { pushed: results.filter(r => r.status === 'fulfilled').length }
        })().catch(e => { 
            console.error('Error Push:', e)
            return { pushed: 0 } 
        })

        return NextResponse.json({ 
            success: true, 
            push: pushResult.pushed > 0 ? 'Sent' : 'Failed' 
        })

    } catch (error: any) {
        console.error('Error fatal en Dashboard Dispatcher:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}