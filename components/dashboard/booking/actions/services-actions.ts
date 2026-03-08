'use server'

import { createClient } from "@/utils/supabase/server"

export async function getServices () {
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

        const { data: services } = await supabase
            .from('services')
            .select('*')
            .eq('business_id', profile.business_id)
            .eq('is_active', true)
            .order('price', { ascending: true })

        if (!services) return { error: 'Error obteniendo servicios.' }

        return {
            success: true,
            services: services || []
        }
    } catch (error) {
        console.error('Error: ', error)
        return { error: 'Error interno.' }
    }
}