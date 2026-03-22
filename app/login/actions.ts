'use server'

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN
})

const rateLimit = new Ratelimit({
    redis: redis,
    limiter: Ratelimit.slidingWindow(10, '1m')
})

export async function login (prevState: any , formData: FormData) {

    const headersList = await headers()
    const ip = headersList.get("x-forwarded-for") ?? "127.0.0.1";

    const { success } = await rateLimit.limit(`login_${ip}`)

    if (!success) {
        // Si no tiene éxito, cortamos la ejecución ANTES de tocar Supabase
        return { error: 'Demasiados intentos. Por favor, espera un minuto.' };
    }

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

export async function signOut() {
    const supabase = await createClient()
    await supabase.auth.signOut()
    redirect('/')
}