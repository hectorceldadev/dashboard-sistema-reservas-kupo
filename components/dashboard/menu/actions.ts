'use server'

import { createClient } from "@/utils/supabase/server"
import { headers } from "next/headers"

export async function getRole() {
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

export async function toggleStaffPushSubscription(subscription: any, isActive: boolean) {
    try {
        const supabase = await createClient()

        const headersList = await headers()
        const userAgent = headersList.get('user-agent') || 'Dispositivo desconocido'

        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return { error: 'No estás autenticado' }

        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('business_id')
            .eq('id', user.id)
            .single()

        if (profileError || !profile?.business_id) {
            console.error('Error perfil:', profileError)
            return { error: 'Error obteniendo datos del negocio.' }
        }

        const { error } = await supabase
            .from('push_subscriptions')
            .upsert({
                staff_id: user.id,
                user_email: user.email,
                business_id: profile.business_id,
                subscription: subscription,
                user_agent: userAgent,
                is_active: isActive
            }, { onConflict: 'business_id,user_email,subscription' }) // <-- CORRECCIÓN: Sin espacios

        // CORRECCIÓN: Si hay error, devolvemos el mensaje exacto de Supabase para saber qué pasa
        if (error) {
            console.error('🔴 Error exacto de Supabase:', error)
            return { error: `Error BD: ${error.message}` }
        }

        const { error: updateError } = await supabase
            .from('push_subscriptions')
            .update({ is_active: isActive })
            .eq('staff_id', user.id)
            .eq('business_id', profile.business_id)
            .eq('user_email', user.email)

        if (updateError) {
            console.error('🔴 Error exacto de Supabase (Update Masivo):', updateError)
            return { error: `Error unificando estados: ${updateError.message}` }
        }

        return { success: true }

    } catch (error: any) {
        console.error('🔴 Error interno en el servidor: ', error)
        return { error: `Error interno: ${error.message}` }
    }
}

export async function getSubscriptionState (subscription: any) {
    try {
        const supabase = await createClient()

        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return { success: true, isActive: false }
        
        const { data: profile } = await supabase
            .from('profiles')
            .select('business_id')
            .eq('id', user.id)
            .single()

        if (!profile?.business_id) return { success: true, isActive: false }

        // Aquí usamos maybeSingle() en lugar de single() para que no tire error si no encuentra fila
        const { data, error } = await supabase
            .from('push_subscriptions')
            .select('is_active')
            .eq('staff_id', user.id)
            .eq('business_id', profile.business_id)
            .eq('subscription->>endpoint', subscription.endpoint) // <-- CORREGIDO: con "c"
            .limit(1)

        if (error) {
            console.error("Error BD:", error)
            return { error: 'Error gestionando notificaciones' }
        }

        const row = data && data.length > 0 ?  data[0] : null

        // Si no hay datos, asumimos que no está activo
        return { 
            success: true,
            isActive: row ? row.is_active : false
        }

    } catch (error) {
        console.error('Error: ', error)
        return { error: 'Error interno' }
    }
}