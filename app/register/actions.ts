'use server'

import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"

export async function createUser (prevSate: any, formData: FormData) {

    const supabase = await createClient()

    const email = formData.get('email') as string
    const password = formData.get('password') as string

    const { error } = await supabase.auth.signUp({
        email: email,
        password: password
    })

    if (error) {
        return { error: 'Credenciales inválidas. Inténtelo de nuevo.' }
    }

    redirect('/dashboard')
}