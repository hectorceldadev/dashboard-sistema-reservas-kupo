'use server'

import { createClient as createServerClient } from "@/utils/supabase/server";
import { createClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";

export async function createMember (prevState: any, formData: FormData) {
    
    const supabase = await createServerClient()

    const { data: { user: adminUser } } = await supabase.auth.getUser()

    if (!adminUser) {
        return { error: 'No estás autenticado.' }
    }

    const { data: adminProfile } = await supabase
        .from('profiles')
        .select('business_id')
        .eq('id', adminUser.id)
        .single()

    if (!adminProfile?.business_id) {
        return { error: 'No se pudo identificar tu negocio.' }
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseKey) {
        throw new Error('Credenciales de Supabase inválidas')
    }

    const supabaseAdmin = createClient(
        supabaseUrl, 
        supabaseKey,
        {
            auth: {
                autoRefreshToken: false,
                persistSession: false
            }
        }
    )

    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const name = formData.get('name') as string
    const description = formData.get('description') as string
    const role = formData.get('role') as string

    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
        email: email,
        password: password,
        email_confirm: true,
        user_metadata: { full_name: name }
    })

    if (authError) {
        return { error: 'Error creando el usuario en Auth: ', authError }
    }

    if (!authData.user) {
        return { error: 'No se pudo generar el ID del usuario.' }
    }

    const { error: profileError } = await supabaseAdmin 
        .from('profiles')
        .insert({
            id: authData.user.id,
            business_id: adminProfile.business_id,
            email: email,
            full_name: name,
            role: role || 'worker',
            description: description,
            is_active: true
        })

    if (profileError) {
        await supabaseAdmin.auth.admin.deleteUser(authData.user.id)
        return { error: 'Error creando la ficha del perfil: ', profileError }
    }

    revalidatePath('/dashboard/equipo')
    return { success: 'Miembro creado correctamente' }

}

export async function updateMember(prevState: any, formData: FormData) {
    
    const supabase = await createServerClient()

    const { data: { user: currentUser } } = await supabase.auth.getUser()
    if (!currentUser) return { error: 'No estás autenticado.' }

    const { data: requesterProfile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', currentUser.id)
        .single()
    
    if (!requesterProfile) return { error: 'No tienes perfil.' }

    const targetUserId = formData.get('id') as string
    const name = formData.get('full_name') as string
    const description = formData.get('description') as string

    const role = formData.get('role') as string
    const isActiveString = formData.get('is_active') as string
    const isActive = isActiveString === 'true'

    const isSelf = targetUserId === currentUser.id
    const isAdmin = requesterProfile.role === 'admin'

    if (!isAdmin && !isSelf) return { error: 'No tienes permisos para editar este perfil' }

    const updates: any = {
        full_name: name,
        description: description,
        is_active: isActive
    }

    if (isAdmin) {
        updates.role = role
    } else {}

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseKey) {
        throw new Error('Credenciales de Supabase inválidas')
    }

    const supabaseAdmin = createClient(
        supabaseUrl, 
        supabaseKey,
        {
            auth: {
                autoRefreshToken: false,
                persistSession: false
            }
        }
    )

    const { error } = await supabaseAdmin
        .from('profiles')
        .update(updates)
        .eq('id', targetUserId)
        .eq('business_id', requesterProfile.business_id)

    if (error) {
        console.error(error)
        return { error: 'Error al actualizar: ' + error }
    }

    revalidatePath('/dashboard/equipo')
    return { success: 'Perfil actualizado correctamente.' }

}