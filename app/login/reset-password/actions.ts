'use server'

import { createClient } from "@/utils/supabase/server"

export async function updatePassword(prevState: any, formData: FormData) {
    try {
        const password = formData.get('password') as string
        const confirmPassword = formData.get('confirmPassword') as string

        if (!password || confirmPassword.length < 6) return { error: 'La contraseña debe de tener al menos 6 carácteres.' }
        if (password !== confirmPassword) return { error: 'Las contraseñas no coinciden.' }

        const supabase = await createClient()

        const { error } = await supabase.auth.updateUser({
            password: password
        })

        if (error) {
            console.error('Error actualizando contraseña: ', error)
            return { error: 'No se pudo actualizar la contraseña. El enlace puede haber caducado.' }
        }

        return { success: true }

    } catch (error) {
        console.error('Error: ', error)
        return { error: 'Error interno, vuelve a intentarlo' }
    }
}