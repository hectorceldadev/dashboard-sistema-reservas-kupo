'use server'

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function login (prevState: any , formData: FormData) {
    const supabase = await createClient() 

    const email = formData.get('email') as string
    const password = formData.get('password') as string

    const { error } = await supabase.auth.signInWithPassword({
        email, 
        password
    })

    if (error) {
        return { error: 'Credenciales inválidas. Por favor, inténtalo de nuevo.' }
    }

    revalidatePath('/', 'layout')
    redirect('/dashboard')
}