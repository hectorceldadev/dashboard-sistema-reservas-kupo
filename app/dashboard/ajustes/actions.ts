'use server'

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateSettings (prevState: any, formData: FormData) {
    
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

    const name = formData.get('business_name') as string
    const address = formData.get('address') as string
    const phone = formData.get('phone') as string

    const { error } = await supabase
        .from('businesses')
        .update({
            name: name,
            address: address,
            phone: phone
        })
        .eq('id', profile.business_id)

    if (error) {
        console.error(error)
        return { error: 'Error al actualizar los datos.' }
    }

    revalidatePath('/dashboard/ajustes')
    return { success: 'Información del negocio actualizada correctamente.' }

}