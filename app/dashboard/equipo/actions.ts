'use server'

import { createClient } from '@supabase/supabase-js'
import { createClient as createServerClient } from "@/utils/supabase/server"
import { revalidatePath } from 'next/cache'

export async function createTeamMember(formData: FormData) {

  const supabase = await createServerClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No estás autenticado.' }

  const { data: profile } = await supabase  
    .from('profiles')
    .select('role, business_id')
    .eq('id', user.id)
    .single()

  if (!profile) return { error: 'Error obteniendo datos del negocio.' }
  if (profile?.role !== 'admin') return { error: 'No tienes los permisos necesarios para crear un nuevo miembro.' }

  // 1. Creamos un cliente con permisos de ADMIN (Service Role)
  // IMPORTANTE: Este cliente se salta las reglas de seguridad (RLS), úsalo con cuidado.
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!, 
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  )

  // 2. Recogemos datos del formulario
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const fullName = formData.get('fullName') as string
  const role = formData.get('role') as string // 'admin' o 'worker'
  const description = formData.get('description') as string

  // 3. Creamos el usuario en Auth pasándole los METADATOS
  const { error } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true, // Confirmamos el email automáticamente para que pueda entrar ya
    user_metadata: {
      business_id: profile.business_id, // El trigger leerá esto
      full_name: fullName,     // El trigger leerá esto
      role: role,              // El trigger leerá esto
      description: description // El trigger leerá esto
    }
  })

  if (error) {
    console.error('Error creando miembro:', error)
    return { error: error.message }
  }

  // 4. Refrescamos la UI
  revalidatePath('/dashboard/equipo')
  return { success: true }
}

export async function getTeamMembers () {
  try {
    const supabase = await createServerClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'No estás autenticado.' }

    const { data: profile } = await supabase
      .from('profiles')
      .select('business_id, id, role')
      .eq('id', user.id)
      .single()

    if (!profile) return { error: 'Error obteniendo datos del negocio.' }

    const { data: profiles } = await supabase
      .from('profiles')
      .select('*')
      .eq('business_id', profile.business_id)

    if (!profiles) return { error: 'Error obteniendo los miembros.' }

    return {
      success: true,
      teamMembers: profiles || [],
      currentUserId: profile.id,
      role: profile.role
    }

  } catch (error) {
    console.error('Error: ', error)
    return { error: 'Error interno.' }
  }
}