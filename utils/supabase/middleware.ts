import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";

export async function updateSession (request: NextRequest) {
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