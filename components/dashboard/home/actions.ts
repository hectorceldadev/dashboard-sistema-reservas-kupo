'use server'

import { createClient } from "@/utils/supabase/server"
import { formatInTimeZone } from "date-fns-tz"

const TIMEZONE = 'Europe/Madrid'

export async function getMembers () {
    try {
        const supabase = await createClient()

        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return { error: 'No estás autenticado.' }

        const { data: profile } = await supabase
            .from('profiles')
            .select('business_id, role')
            .eq('id', user.id)
            .single()

        if (!profile) return { error: 'Error obteniendo datos del negocio.' }

        const { data: profiles } = await supabase
            .from('profiles')
            .select('*')
            .eq('business_id', profile.business_id)
            .eq('is_active', true)

        if (!profiles) return { error: 'Error obteniendo datos del negocio.', profiles: [] }

        profiles.sort((a, b) => {
            if (a.id === user.id) return -1
            if (b.id === user.id) return 1
            return a.full_name.localeCompare(b.full_name || '')
        })

        return {
            success: true,
            profiles: profiles || [],
            isAdmin: profile.role === 'admin',
            currentUserId: user.id
        }

    } catch (error) {
        console.error('Error: ', error)
        return { error: 'Error interno.' }
    }
}

export async function getDashboardData (memberId: string) {
    try {
        const supabase = await createClient()

        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return { error: 'No estás autenticado' }

        const { data: profile } = await supabase
            .from('profiles')
            .select('business_id, role')
            .eq('id', user.id)
            .single()

        if (!profile) return { error: 'Error obteniendo datos del negocio.' }
        if (profile.role !== 'admin' && memberId !== user.id) return { error: 'No tienes los permisos necesarios para ver los datos de este miembro.' }

        const { data: memberProfile } = await supabase
            .from('profiles')
            .select('full_name, avatar_url')
            .eq('business_id', profile.business_id)
            .eq('id', memberId)
            .single()

        if (!memberProfile) return { error: 'Error obteniendo los datos del miembro.' }

        const today = formatInTimeZone(new Date(), TIMEZONE, 'yyyy-MM-dd')

        const { data: bookings } = await supabase
            .from('bookings')
            .select(`
                *,
                booking_items (
                    price, 
                    service_name, 
                    duration
                ),
                staff:profiles!staff_id (
                    full_name,
                    avatar_url
                )
            `)
            .eq('date', today)
            .eq('staff_id', memberId)
            .eq('business_id', profile.business_id)
            .order('start_time', { ascending: true })

        if (!bookings) return { error: 'Error obteniendo las reservas.' }

        const validBookings = bookings || []

        const now = formatInTimeZone(new Date(), TIMEZONE, 'HH:mm')

        const nextBooking = bookings.find(b => 
            (b.status === 'confirmed' || b.status === 'pending_payment') &&
            b.start_time >= now 
        ) || null

        const kpis = {
            totalBookings: validBookings.length,
            completedBookings: validBookings.filter(b => b.status === 'completed').length,
            cancelledBookings: validBookings.filter(b => b.status === 'cancelled').length,
            totalEarnings: validBookings.reduce((acc, b) => {
                if (b.status === 'cancelled' ) return acc
                const price = b.total_price || b.booking_items?.reduce((sum: number, item: { price: number, service_name: string }) => sum + item.price, 0)
                return acc + price
            }, 0)
        }

        return {
            success: true,
            kpis,
            memberInfo: {
                name: memberProfile.full_name,
                avatar: memberProfile.avatar_url
            },
            nextBooking,
            bookings: validBookings || []
        }

    } catch (error) {
        console.error('Error: ', error)
        return { error: 'Error interno.' }
    }
}