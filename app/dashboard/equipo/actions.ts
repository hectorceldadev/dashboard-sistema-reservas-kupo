'use server'

import { createClient } from '@supabase/supabase-js'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createTeamMember(formData: FormData) {
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
  const businessId = formData.get('businessId') as string // Debes pasar esto en un input hidden

  // 3. Creamos el usuario en Auth pasándole los METADATOS
  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true, // Confirmamos el email automáticamente para que pueda entrar ya
    user_metadata: {
      business_id: businessId, // El trigger leerá esto
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