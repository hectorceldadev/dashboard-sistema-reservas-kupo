import { EquipoManager } from '@/components/dashboard/equipo/EquipoManager';
import { getTeamMembers } from './actions';
import { sileo } from 'sileo';

const Page = async () => {

  const response = await getTeamMembers()
  
  if (response.error) {
    sileo.error({
      title: 'Error obteniendo miembros.'
    }) 
    return
  }

  const teamMembers = response.teamMembers || []
  const currentUserId = response.currentUserId
  const role = response.role

  return (
    <div className="max-w-7xl mx-auto p-6">
        {/* Pasamos los datos al componente interactivo */}
        <EquipoManager members={teamMembers} currentUserId={currentUserId} currentUserRole={role} />
    </div>
  )
}

export default Page