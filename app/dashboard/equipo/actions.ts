'use server'

import { createClient as createServerClient } from "@/utils/supabase/server"

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

    const sortedMembers = profiles.sort((a, b) => {
      if (a.id === user.id) return -1 
      if (b.id === user.id) return 1

      if (a.is_active && !b.is_active) return -1
      if (!a.is_active && b.is_active) return 1

      return (a.full_name || '').localeCompare(b.full_name || '')
    })

    return {
      success: true,
      teamMembers: sortedMembers || [],
      currentUserId: profile.id,
      role: profile.role
    }

  } catch (error) {
    console.error('Error: ', error)
    return { error: 'Error interno.' }
  }
}