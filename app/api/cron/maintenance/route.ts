import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

export const dynamic = 'force-dynamic'
export const maxDuration = 60

export async function GET (request: Request) {
    try {
        const authHeader = request.headers.get('authorization')
        if (process.env.CRON_SECRET_KEY && authHeader !== `Bearer ${process.env.CRON_SECRET_KEY}`) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
        }

        const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
        
        const now = new Date().toISOString()
        console.log(`[CRON MANTENIMIENTO] Iniciando lipmieza a las ${now}...`)

        const { data: bookingsData, error: bookingsError } = await supabaseAdmin
            .from('bookings')
            .update({ status: 'completed' })
            .eq('status', 'confirmed')
            .lt('end_time', now)
            .select('id')

        if (bookingsError) console.error('Error actualizando las citas: ', bookingsError)
            
        const { data: blocksData, error: blocksError } = await supabaseAdmin
            .from('blocked_periods')
            .update({ status: 'completed' })
            .eq('status', 'active')
            .lt('end_date', now)
            .select('id')

        if (blocksError) console.error('Error actualizando bloqueos:', blocksError)

        console.log(`[CRON MANTENIMIENTO] Fin. Citas: ${bookingsData?.length || 0} | Bloqueos: ${blocksData?.length || 0}`)

        return NextResponse.json({
            success: true,
            bookingsUpdated: bookingsData?.length || 0,
            blocksUpdated: blocksData?.length || 0,
            timeStamp: now
        })
    } catch (error: any) {
        console.error('[CRON FATAL ERROR]: ', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
