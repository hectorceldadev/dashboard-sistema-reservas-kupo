'use client'

import { useState } from 'react'
import { User, Clock } from 'lucide-react'
import VistaEquipo from './vistas/VistaEquipo'
import VistaHorarios from './vistas/VistaHorarios'

// Tipos base para que TypeScript no se queje
export type TeamMember = {
  id: string
  business_id: string
  role: 'admin' | 'worker'
  full_name: string
  description?: string | null
  email?: string | null
  is_active: boolean
  avatar_url?: string | null
}

export type StaffSchedule = {
  id: string
  staff_id: string
  day_of_week: number
  start_time: string
  end_time: string
  is_working: boolean
  break_start?: string | null
  break_end?: string | null
}

export type BlockedPeriod = {
  id: string
  staff_id: string
  start_date: string
  end_date: string
  reason: string | null
  status: 'active' | 'completed'
}

interface EquipoManagerProps {
    members: TeamMember[]
    currentUserRole: string
    currentUserId: string
}

export function EquipoManager({ members, currentUserRole, currentUserId }: EquipoManagerProps) {
  
  const [activeTab, setActiveTab] = useState<'team' | 'schedule'>('team')

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* HEADER & TABS */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 border-b border-zinc-800 pb-8">
        <div>
           <h1 className="text-2xl font-bold text-white">Gestión de Equipo</h1>
           <p className="text-zinc-400 mt-2">Administra los permisos, roles y turnos de trabajo.</p>
        </div>
        <div className="flex items-center p-1.5 bg-zinc-900 border border-zinc-800 rounded-xl">
            <button 
                onClick={() => setActiveTab('team')} 
                className={`flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-lg transition-all ${activeTab === 'team' ? 'bg-yellow-500 text-zinc-950 shadow-lg shadow-yellow-500/10' : 'text-zinc-500 hover:text-zinc-300'} cursor-pointer`}
            >
                <User className="w-4 h-4" /> <span>Mi Equipo</span>
            </button>
            <button 
                onClick={() => setActiveTab('schedule')} 
                className={`flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-lg transition-all ${activeTab === 'schedule' ? 'bg-yellow-500 text-zinc-950 shadow-lg shadow-yellow-500/10' : 'text-zinc-500 hover:text-zinc-300'} cursor-pointer`}
            >
                <Clock className="w-4 h-4" /> <span>Horarios</span>
            </button>
        </div>
      </div>

      {/* RENDERIZADO CONDICIONAL DE VISTAS */}
      {activeTab === 'team' ? (
          <VistaEquipo 
                members={members} 
                currentUserRole={currentUserRole} 
                currentUserId={currentUserId} 
          />
      ) : (
          <VistaHorarios 
                members={members} 
          />
      )}

    </div>
  )
}