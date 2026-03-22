import { createServerClient } from "@supabase/ssr";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { NextRequest, NextResponse } from "next/server";

const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL ,
    token: process.env.UPSTASH_REDIS_REST_TOKEN
})

const rateLimit = new Ratelimit({
    redis: redis,
    limiter: Ratelimit.slidingWindow(100, '1m')
})

export async function updateSession (request: NextRequest) {

    const ip = request.headers.get('x-forwarded-for') ?? '127.0.0.1'

  const { success } = await rateLimit.limit(`global_${ip}`)

  if (!success) {
    // Si superan el límite, devolvemos un error 429 (Too Many Requests) sin interfaz gráfica, ahorrando recursos
    return new NextResponse(
      'Has realizado demasiadas peticiones a KUPO. Por favor, espera un minuto.',
      { 
        status: 429, 
        headers: { 'content-type': 'text/plain; charset=utf-8' } 
      }
    )
  }

    let supabaseResponse = NextResponse.next({
        request
    })

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY

    if (!supabaseUrl || !supabaseKey) {
        throw new Error('Faltan las variables de entorno de Supabase')
    }

    const supabase = createServerClient(
        supabaseUrl,
        supabaseKey,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) => 
                        request.cookies.set(name, value)
                    )
                    supabaseResponse = NextResponse.next({
                        request
                    })
                    cookiesToSet.forEach(({ name, value, options }) => 
                        supabaseResponse.cookies.set(name, value, options)
                    )
                }
            }
        }
    )
    const { data: { user } } = await supabase.auth.getUser()

    if (request.nextUrl.pathname.startsWith('/dashboard') && !user) {
        const url = request.nextUrl.clone()
        url.pathname = '/login'
        return NextResponse.redirect(url)
    }

    if (user && (request.nextUrl.pathname === '/' || request.nextUrl.pathname === '/login')) {
        const url = request.nextUrl.clone()
        url.pathname = '/dashboard'
        return NextResponse.redirect(url)
    }

    return supabaseResponse
}