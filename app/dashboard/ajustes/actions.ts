'use server'

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateSettings (businessData: {
    name: string | null
    open_hour: string | null
    close_hour: string | null
    address: string | null
    phone: string | null
}) {
    
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { error: 'No estás autenticado' }

    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

    if (!profile) return { error: 'No se encontró tu perfil de usuario' }
    if (profile.role !== 'admin') return { error: 'Necesitas ser admin para poder modificar la configuración del negocio' }
    if (!profile.business_id) return { error: 'No tienes ningún negocio vinculado' }

    const timeToMins = (time: string) => {
        const [h, m] = time.split(':').map(Number)
        return h * 60 + m
    }

    const openHour = timeToMins(businessData.open_hour!)
    const closeHour = timeToMins(businessData.close_hour!)

    if (isNaN(openHour) || isNaN(closeHour)) return { error: 'Las horas enviadas no son válidas.' }
    if (openHour < 0 || closeHour > 1440) return { error: 'Las horas deben estar entre 0 y 24.' }
    if (closeHour <= openHour) return { error: 'La hora de apertura debe ser anterior a la hora de cierre.' }

    const { error } = await supabase
        .from('businesses')
        .update({
            name: businessData.name,
            address: businessData.address,
            phone: businessData.phone,
            open_hour: businessData.open_hour,
            close_hour: businessData.close_hour
        })
        .eq('id', profile.business_id)

    if (error) {
        console.error(error)
        return { error: 'Error al actualizar los datos.' }
    }

    revalidatePath('/dashboard/ajustes')
    revalidatePath('/dashboard/agenda')
    return { success: 'Información del negocio actualizada correctamente.' }

}