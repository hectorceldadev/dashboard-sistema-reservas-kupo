'use server'

import { createClient } from "@/utils/supabase/server"

export async function getRole () {
    try {
        const supabase = await createClient()

        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return { error: 'No estás autenticado.' }

        const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single()

        if (!profile?.role) return { error: 'Error obteniendo datos del negocio.' }

        return {
            success: true,
            role: profile.role
        }
    } catch (error) {
        console.error('Error: ', error)
        return { error: 'Error interno.' }
    }
}