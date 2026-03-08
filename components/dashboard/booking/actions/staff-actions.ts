'use server'

import { createClient } from "@/utils/supabase/server"

export async function getStaff() {
    try {
        const supabase = await createClient()

        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return { error: 'No estás autenticado.' }

        const { data: profile } = await supabase
            .from('profiles')
            .select('business_id')
            .eq('id', user.id)
            .single()

        if (!profile?.business_id) return { error: 'Error obteniendo datos del negocio.' }

        const { data: profiles } = await supabase
            .from('profiles')
            .select('*')
            .eq('business_id', profile.business_id)
            .eq('is_active', true)
            .order('full_name', { ascending: true })

        if (!profiles) return { error: 'Error obteniendo los miembros del equipo.' }

        return {
            success: true,
            profiles: profiles || []
        }
    } catch (error) {
        console.error('Error: ', error)
        return { error: 'Error interno.' }
    }
}