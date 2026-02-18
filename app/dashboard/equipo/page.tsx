import { Equipo } from '@/components/dashboard/equipo/Equipo';
import { getTeamMembers } from '../../../lib/data/equipo';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

const Page = async () => {

  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (error || !profile) redirect('/login')
    
  

  const teamMembers = await getTeamMembers(profile.business_id) 

  return (
    <div className="max-w-7xl mx-auto p-6">
        {/* Pasamos los datos al componente interactivo */}
        <Equipo members={teamMembers} currentUserId={user.id} currentUserRole={profile.role} />
    </div>
  )
}

export default Page