'use client'

import { useState, useEffect } from 'react'
import { useFormStatus } from 'react-dom'
import { useActionState } from 'react' // Nota: En versiones anteriores de Next.js puede ser 'react-dom'
import { User, Plus, Edit3, Clock, X, Save, Mail, Shield, FileText, Power, Coffee, ChevronLeft, ChevronRight, Calendar as CalendarIconLucide, Trash, MoreHorizontal, Lock, Loader2, AlertCircle } from 'lucide-react'
import { createMember, updateMember } from './actions' // Asegúrate de que la ruta sea correcta a tu server action
import { sileo } from 'sileo'

type TeamMember = {
  id: string
  business_id: string
  role: 'admin' | 'worker'
  full_name: string
  description?: string | null
  email?: string | null
  is_active: boolean
  avatar_url?: string | null
  created_at?: string
  metadata?: any
}

const getInitials = (name: string) => name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()

export function Equipo({ 
    members, 
    currentUserRole, 
    currentUserId 
}: { 
    members: TeamMember[], 
    currentUserRole: string, 
    currentUserId: string 
}) {
  const [activeTab, setActiveTab] = useState<'team' | 'schedule'>('team')
  
  // Estados Modales
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false) // <--- NUEVO ESTADO
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null)
  
  // Estados Schedule
  const [selectedMemberId, setSelectedMemberId] = useState<string>(members[0]?.id)
  const [selectedDate, setSelectedDate] = useState<number | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [hasBreak, setHasBreak] = useState(false)

  // --- CONEXIÓN CON SERVER ACTION ---
  const [addState, addAction] = useActionState(createMember, null)
  const [editState, editAction] = useActionState(updateMember, null)

  useEffect(() => {
    if (addState?.success) {
        setIsAddModalOpen(false)
        sileo.success({
            title: 'Miembro añadido con éxito',
            fill: "black",
            styles: {
                title: 'text-white font-bold'
            }
        })
    }
    if (editState?.success) {
    setIsEditModalOpen(false)
    sileo.success({ 
        title: 'Perfil actualizado', 
        fill: "black", 
        styles: { 
            title: 'text-white font-bold' 
        } 
    })
    }
  }, [addState, editState])

  const daysInMonth = Array.from({ length: 30 }, (_, i) => i + 1)

  const handleEditClick = (member: TeamMember) => {
    setEditingMember(member)
    setIsEditModalOpen(true)
  }

  const handleInputChange = (field: keyof TeamMember, value: any) => {
    if (editingMember) {
        setEditingMember({ ...editingMember, [field]: value })
    }
  }

  const handleDayClick = (day: number) => {
    setSelectedDate(day)
    setIsModalOpen(true)
  }

  const isAdmin = currentUserRole === 'admin'
  const isSelf = editingMember?.id === currentUserId

  const canEditRole = isAdmin
  const canEditStatus = isAdmin || isSelf

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* HEADER & TABS (Sin cambios) */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 border-b border-zinc-800 pb-8">
        <div>
           <h1 className="text-2xl font-bold text-white">Gestión de Equipo</h1>
           <p className="text-zinc-400 mt-2">Administra los permisos, roles y turnos de trabajo.</p>
        </div>
        <div className="flex items-center p-1.5 bg-zinc-900 border border-zinc-800 rounded-xl">
            <button onClick={() => setActiveTab('team')} className={`flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-lg transition-all ${activeTab === 'team' ? 'bg-yellow-500 text-zinc-950 shadow-lg shadow-yellow-500/10' : 'text-zinc-500 hover:text-zinc-300'}`}>
                <User className="w-4 h-4" /> <span>Mi Equipo</span>
            </button>
            <button onClick={() => setActiveTab('schedule')} className={`flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-lg transition-all ${activeTab === 'schedule' ? 'bg-yellow-500 text-zinc-950 shadow-lg shadow-yellow-500/10' : 'text-zinc-500 hover:text-zinc-300'}`}>
                <Clock className="w-4 h-4" /> <span>Horarios</span>
            </button>
        </div>
      </div>

      {/* VISTA 1: GRID DE EQUIPO */}
      {/* VISTA 1: GRID DE EQUIPO */}
{activeTab === 'team' && (
  <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
    {members.map((member) => {
      
      // 1. CALCULAMOS PERMISOS PARA CADA TARJETA INDIVIDUALMENTE
      const canEditThisMember = currentUserRole === 'admin' || currentUserId === member.id;

      return (
        <div key={member.id} className="group relative bg-zinc-900 border border-zinc-800 rounded-3xl p-6 hover:border-zinc-600 transition-all duration-300 shadow-sm hover:shadow-2xl hover:shadow-black/50 flex flex-col justify-between h-full min-h-[340px]">
          
          {/* Botón de opciones (3 puntos): Ocultar si no tiene permisos */}
          {canEditThisMember && (
             <button className="absolute top-5 right-5 text-zinc-600 hover:text-white transition-colors">
                <MoreHorizontal className="w-5 h-5" />
             </button>
          )}

          <div className="flex flex-col items-center gap-5 mt-4">
            <div className="relative">
              <div className="h-24 w-24 rounded-full bg-zinc-800 border-2 border-zinc-700 flex items-center justify-center shrink-0 text-zinc-400 font-bold text-2xl shadow-xl group-hover:border-yellow-500/50 group-hover:shadow-yellow-500/10 transition-all overflow-hidden">
                {member.avatar_url ? <img src={member.avatar_url} alt={member.full_name} className="w-full h-full object-cover" /> : getInitials(member.full_name)}
              </div>
              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap px-3 py-1 rounded-full bg-zinc-950 border border-zinc-800 text-[10px] font-bold text-yellow-500 uppercase tracking-widest shadow-lg">{member.role}</div>
            </div>
            <div className="text-center pt-2 px-2">
              <h3 className="text-xl font-bold text-white leading-tight mb-1">{member.full_name}</h3>
              <p className="text-sm text-zinc-500 font-medium line-clamp-2">{member.description || "Sin descripción disponible"}</p>
            </div>
          </div>

          <div className="py-6 w-full">
            {/* 2. BOTÓN CONDICIONAL */}
            <button 
                onClick={() => canEditThisMember && handleEditClick(member)} 
                disabled={!canEditThisMember}
                className={`w-full flex items-center justify-center gap-2 border border-zinc-800 py-2.5 rounded-xl transition-all font-medium text-sm group/btn
                    ${canEditThisMember 
                        ? 'bg-zinc-950 hover:bg-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white cursor-pointer' 
                        : 'bg-zinc-900/50 text-zinc-600 opacity-50 cursor-not-allowed'
                    }
                `}
            >
              <Edit3 className={`w-4 h-4 transition-colors ${canEditThisMember ? 'text-zinc-500 group-hover/btn:text-yellow-500' : 'text-zinc-700'}`} /> 
              <span>{canEditThisMember ? 'Editar Perfil' : 'No editable'}</span>
            </button>
          </div>

          <div className="pt-4 border-t border-zinc-800/50 flex items-center justify-center w-full mt-auto">
            <div className="flex items-center gap-2.5 bg-zinc-950/50 px-3 py-1.5 rounded-full border border-white/5">
              <span className="relative flex h-2.5 w-2.5">
                <span className={`absolute inline-flex h-full w-full rounded-full opacity-75 ${member.is_active ? 'animate-ping bg-emerald-400' : 'hidden'}`}></span>
                <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${member.is_active ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
              </span>
              <span className={`text-[10px] font-bold uppercase tracking-wider ${member.is_active ? 'text-zinc-300' : 'text-zinc-500'}`}>{member.is_active ? 'Activo' : 'Inactivo'}</span>
            </div>
          </div>
        </div>
      );
    })}

    {/* Card Añadir - SOLO VISIBLE SI ES ADMIN */}
    {currentUserRole === 'admin' && (
        <button 
        onClick={() => setIsAddModalOpen(true)}
        className="flex flex-col items-center justify-center gap-5 p-8 rounded-3xl border-2 border-dashed border-zinc-800 bg-zinc-900/20 hover:bg-zinc-900 hover:border-yellow-500/40 text-zinc-500 hover:text-white transition-all h-full min-h-[340px] group"
        >
        <div className="w-20 h-20 rounded-full bg-zinc-950 border border-zinc-800 flex items-center justify-center group-hover:border-yellow-500/40 group-hover:shadow-[0_0_30px_-10px_rgba(234,179,8,0.3)] transition-all">
            <Plus className="w-8 h-8 group-hover:text-yellow-500 transition-colors" />
        </div>
        <div className="text-center space-y-1">
            <span className="block text-lg font-bold text-zinc-400 group-hover:text-white transition-colors">Añadir compañero</span>
        </div>
        </button>
    )}
  </div>
)}

      {/* VISTA 2: HORARIOS (Sin cambios) */}
      {activeTab === 'schedule' && (
        <div className="animate-fade-in grid lg:grid-cols-[300px_1fr] gap-8">
            <div className="space-y-4">
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 h-[calc(100vh-300px)] overflow-y-auto custom-scrollbar">
                    <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-4 px-2">Seleccionar Miembro</h3>
                    <div className="space-y-2">
                        {members.map(member => (
                            <button key={member.id} onClick={() => setSelectedMemberId(member.id)} className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all border ${selectedMemberId === member.id ? 'bg-yellow-500/10 border-yellow-500/50 shadow-lg shadow-yellow-500/5' : 'bg-transparent border-transparent hover:bg-zinc-800 hover:border-zinc-700'}`}>
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 text-sm font-bold border ${selectedMemberId === member.id ? 'bg-yellow-500 text-zinc-950 border-yellow-500' : 'bg-zinc-800 text-zinc-400 border-zinc-700'}`}>{getInitials(member.full_name)}</div>
                                <div className="text-left overflow-hidden">
                                    <div className={`text-sm font-bold truncate ${selectedMemberId === member.id ? 'text-white' : 'text-zinc-400'}`}>{member.full_name}</div>
                                    <div className="text-[10px] text-zinc-500 font-medium uppercase">{member.role}</div>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
            <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2"><CalendarIconLucide className="w-5 h-5 text-yellow-500" /> Octubre 2025</h2>
                    <div className="flex gap-2">
                        <button className="p-2 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 transition-colors"><ChevronLeft className="w-4 h-4" /></button>
                        <button className="p-2 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 transition-colors"><ChevronRight className="w-4 h-4" /></button>
                    </div>
                </div>
                <div className="grid grid-cols-7 mb-4">
                    {['L', 'M', 'X', 'J', 'V', 'S', 'D'].map(day => (<div key={day} className="text-center text-xs font-bold text-zinc-500 py-2">{day}</div>))}
                </div>
                <div className="grid grid-cols-7 gap-3">
                    <div className="aspect-square"></div><div className="aspect-square"></div>
                    {daysInMonth.map(day => (
                        <button key={day} onClick={() => handleDayClick(day)} className="group relative aspect-square bg-zinc-950 border border-zinc-800/50 rounded-xl hover:border-yellow-500/50 hover:shadow-lg hover:shadow-yellow-500/5 transition-all flex flex-col justify-between p-3">
                            <span className="text-xs font-medium text-zinc-500 group-hover:text-white transition-colors">{day}</span>
                            {day % 7 !== 0 ? (<div className="w-full bg-zinc-800 rounded px-1.5 py-1 flex flex-col items-start gap-0.5 group-hover:bg-yellow-500 group-hover:text-zinc-950 transition-colors"><span className="text-[10px] font-bold leading-none">09:00</span><span className="text-[10px] font-bold leading-none opacity-70">18:00</span></div>) : (<div className="w-full flex justify-center py-2 opacity-20"><div className="w-1.5 h-1.5 rounded-full bg-zinc-700"></div></div>)}
                        </button>
                    ))}
                </div>
            </div>
        </div>
      )}

      {/* ========================================================== */}
      {/* MODAL 1: AÑADIR NUEVO MIEMBRO (NUEVO)                      */}
      {/* ========================================================== */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
            <div className="bg-zinc-900 border border-zinc-800 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
                
                {/* Header Modal */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-800 bg-zinc-900/50">
                    <div>
                        <h3 className="text-xl font-bold text-white">Nuevo Miembro</h3>
                        <p className="text-sm text-zinc-400">Invita a un compañero a tu equipo.</p>
                    </div>
                    <button onClick={() => setIsAddModalOpen(false)} className="p-2 rounded-lg hover:bg-zinc-800 text-zinc-500 hover:text-white transition-colors">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Formulario conectado a Server Action */}
                <form action={addAction} className="flex flex-col h-full overflow-hidden">
                    <div className="p-6 space-y-6 overflow-y-auto custom-scrollbar">
                        
                        {/* Mensaje de Error global */}
                        {addState?.error && (
                            <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-200 text-sm rounded-xl flex items-start gap-3">
                                <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                                <span>{addState.error}</span>
                            </div>
                        )}

                        {/* Nombre */}
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-xs font-bold text-zinc-500 uppercase">
                                <User className="w-3 h-3" /> Nombre Completo
                            </label>
                            <input name="name" required type="text" placeholder="Ej. Ana García" className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 outline-none transition-all placeholder:text-zinc-600" />
                        </div>

                        {/* Email & Rol */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-xs font-bold text-zinc-500 uppercase">
                                    <Mail className="w-3 h-3" /> Email
                                </label>
                                <input name="email" required type="email" placeholder="correo@ejemplo.com" className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:border-yellow-500 outline-none transition-all placeholder:text-zinc-600" />
                            </div>
                            
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-xs font-bold text-zinc-500 uppercase">
                                    <Shield className="w-3 h-3" /> Rol
                                </label>
                                <div className="relative">
                                    <select name="role" className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:border-yellow-500 outline-none appearance-none cursor-pointer">
                                        <option value="worker">Worker</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Contraseña Temporal */}
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-xs font-bold text-zinc-500 uppercase">
                                <Lock className="w-3 h-3" /> Contraseña Temporal
                            </label>
                            <input name="password" required type="password" placeholder="••••••••" className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:border-yellow-500 outline-none transition-all placeholder:text-zinc-600" />
                            <p className="text-[10px] text-zinc-500">Mínimo 6 caracteres. El usuario podrá cambiarla después.</p>
                        </div>

                        {/* Descripción */}
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-xs font-bold text-zinc-500 uppercase">
                                <FileText className="w-3 h-3" /> Descripción (Opcional)
                            </label>
                            <textarea name="description" rows={2} placeholder="Rol o especialidad..." className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:border-yellow-500 outline-none resize-none placeholder:text-zinc-600" />
                        </div>
                    </div>

                    {/* Footer con Botón de Submit Especial */}
                    <div className="px-6 py-4 bg-zinc-950 border-t border-zinc-800 flex gap-3 mt-auto">
                        <button type="button" onClick={() => setIsAddModalOpen(false)} className="flex-1 py-3 rounded-xl border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-900 font-bold transition-colors">
                            Cancelar
                        </button>
                        <SubmitButton />
                    </div>
                </form>
            </div>
        </div>
      )}

      {/* MODAL 2: EDITAR PERFIL (CONECTADO A SERVER ACTION) */}
      {isEditModalOpen && editingMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
            <div className="bg-zinc-900 border border-zinc-800 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
                
                <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-800 bg-zinc-900/50">
                    <div>
                        <h3 className="text-xl font-bold text-white">Editar Perfil</h3>
                        <p className="text-sm text-zinc-400">Editando a: <span className="text-white font-medium">{editingMember.full_name}</span></p>
                    </div>
                    <button onClick={() => setIsEditModalOpen(false)} className="p-2 rounded-lg hover:bg-zinc-800 text-zinc-500 hover:text-white transition-colors"><X className="w-6 h-6" /></button>
                </div>

                {/* FORMULARIO CONECTADO */}
                <form action={editAction} className="flex flex-col h-full overflow-hidden">
                    <div className="p-6 space-y-6 overflow-y-auto custom-scrollbar">
                        
                        {/* INPUTS OCULTOS VITALES */}
                        <input type="hidden" name="id" value={editingMember.id} />
                        {/* Convertimos el booleano a string para el formData */}
                        <input type="hidden" name="is_active" value={editingMember.is_active ? 'true' : 'false'} />

                        {/* Mensajes de Error */}
                        {editState?.error && (
                             <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-200 text-sm rounded-xl flex items-center gap-2">
                                <AlertCircle className="w-4 h-4" /> {editState.error}
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-xs font-bold text-zinc-500 uppercase"><User className="w-3 h-3" /> Nombre Completo</label>
                            <input name="full_name" type="text" value={editingMember.full_name} onChange={(e) => handleInputChange('full_name', e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:border-yellow-500 outline-none transition-all" />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-xs font-bold text-zinc-500 uppercase"><Mail className="w-3 h-3" /> Email</label>
                                {/* Email SIEMPRE bloqueado */}
                                <input 
                                    name="email" 
                                    type="email" 
                                    value={editingMember.email || ''} 
                                    disabled={true} 
                                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-zinc-500 cursor-not-allowed outline-none" 
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-xs font-bold text-zinc-500 uppercase"><Shield className="w-3 h-3" /> Rol</label>
                                <div className="relative">
                                    {/* Rol bloqueado si no es Admin */}
                                    <select 
                                        name="role"
                                        value={editingMember.role} 
                                        onChange={(e) => handleInputChange('role', e.target.value)} 
                                        disabled={!canEditRole}
                                        className={`w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:border-yellow-500 outline-none appearance-none ${!canEditRole ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                                    >
                                        <option value="worker">Worker</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-xs font-bold text-zinc-500 uppercase"><FileText className="w-3 h-3" /> Descripción</label>
                            <textarea name="description" rows={3} value={editingMember.description || ''} onChange={(e) => handleInputChange('description', e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:border-yellow-500 outline-none resize-none" />
                        </div>

                        {/* ESTADO: Admin o Él mismo */}
                        <div className={`bg-zinc-950/50 border border-zinc-800 rounded-xl p-4 flex items-center justify-between ${!canEditStatus ? 'opacity-50' : ''}`}>
                            <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-lg ${editingMember.is_active ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}><Power className="w-5 h-5" /></div>
                                <div>
                                    <h4 className="text-sm font-bold text-white">Estado de la cuenta</h4>
                                    <p className="text-xs text-zinc-500">{editingMember.is_active ? 'Usuario activo.' : 'Usuario bloqueado.'}</p>
                                </div>
                            </div>
                            <button 
                                type="button" 
                                disabled={!canEditStatus}
                                onClick={() => canEditStatus && handleInputChange('is_active', !editingMember.is_active)} 
                                className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${editingMember.is_active ? 'bg-emerald-500' : 'bg-zinc-700'} ${!canEditStatus ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                            >
                                <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${editingMember.is_active ? 'translate-x-6' : 'translate-x-1'}`} />
                            </button>
                        </div>
                    </div>

                    <div className="px-6 py-4 bg-zinc-950 border-t border-zinc-800 flex gap-3 mt-auto">
                        <button type="button" onClick={() => setIsEditModalOpen(false)} className="flex-1 py-3 rounded-xl border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-900 font-bold transition-colors">Cancelar</button>
                        <SaveEditButton />
                    </div>
                </form>
            </div>
        </div>
      )}

      {/* MODAL 3: EDITAR HORARIO (EXISTENTE) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
            <div className="bg-zinc-900 border border-zinc-800 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-800 bg-zinc-900/50">
                    <div>
                        <h3 className="text-lg font-bold text-white">Editar Horario</h3>
                        <p className="text-sm text-zinc-400">Octubre {selectedDate}, 2025</p>
                    </div>
                    <button onClick={() => setIsModalOpen(false)} className="text-zinc-500 hover:text-white transition-colors"><X className="w-6 h-6" /></button>
                </div>
                <div className="p-6 space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-zinc-500 uppercase">Entrada</label>
                            <input type="time" defaultValue="09:00" className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:border-yellow-500 outline-none text-center font-mono" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-zinc-500 uppercase">Salida</label>
                            <input type="time" defaultValue="18:00" className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:border-yellow-500 outline-none text-center font-mono" />
                        </div>
                    </div>
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-zinc-800"></div></div>
                        <div className="relative flex justify-center"><span className="bg-zinc-900 px-3 text-xs font-medium text-zinc-500">Descanso / Break</span></div>
                    </div>
                    <div className="flex items-center justify-between bg-zinc-950/50 border border-zinc-800 rounded-xl p-4">
                        <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${hasBreak ? 'bg-yellow-500/10 text-yellow-500' : 'bg-zinc-800 text-zinc-500'}`}><Coffee className="w-5 h-5" /></div>
                            <span className="text-sm font-bold text-zinc-300">¿Tiene descanso?</span>
                        </div>
                        <button onClick={() => setHasBreak(!hasBreak)} className={`w-12 h-6 rounded-full p-1 transition-colors ${hasBreak ? 'bg-yellow-500' : 'bg-zinc-700'}`}>
                            <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${hasBreak ? 'translate-x-6' : 'translate-x-0'}`} />
                        </button>
                    </div>
                    {hasBreak && (
                        <div className="grid grid-cols-2 gap-4 animate-in slide-in-from-top-2">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-zinc-500 uppercase">Inicio Break</label>
                                <input type="time" defaultValue="14:00" className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:border-yellow-500 outline-none text-center font-mono" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-zinc-500 uppercase">Fin Break</label>
                                <input type="time" defaultValue="15:00" className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:border-yellow-500 outline-none text-center font-mono" />
                            </div>
                        </div>
                    )}
                </div>
                <div className="px-6 py-4 bg-zinc-950 border-t border-zinc-800 flex gap-3">
                    <button onClick={() => setIsModalOpen(false)} className="flex-1 py-3 rounded-xl border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-900 font-bold transition-colors">Cancelar</button>
                    <button onClick={() => setIsModalOpen(false)} className="flex-1 py-3 rounded-xl bg-yellow-500 hover:bg-yellow-400 text-zinc-950 font-bold transition-colors flex items-center justify-center gap-2"><Save className="w-4 h-4" /> Guardar</button>
                </div>
            </div>
        </div>
      )}

    </div>
  )
}

// COMPONENTE AUXILIAR PARA EL ESTADO DE CARGA (BUTTON)
function SubmitButton() {
    const { pending } = useFormStatus()

    return (
        <button 
            type="submit" 
            disabled={pending}
            className="flex-1 py-3 rounded-xl bg-yellow-500 hover:bg-yellow-400 text-zinc-950 font-bold transition-colors flex items-center justify-center gap-2 shadow-lg shadow-yellow-500/10 disabled:opacity-50 disabled:cursor-not-allowed"
        >
            {pending ? (
                <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Creando...</span>
                </>
            ) : (
                <>
                    <Save className="w-4 h-4" />
                    <span>Crear Miembro</span>
                </>
            )}
        </button>
    )
}

function SaveEditButton() {
    const { pending } = useFormStatus()
    return (
        <button 
            type="submit" 
            disabled={pending}
            className="flex-1 py-3 rounded-xl bg-yellow-500 hover:bg-yellow-400 text-zinc-950 font-bold transition-colors flex items-center justify-center gap-2 shadow-lg shadow-yellow-500/10 disabled:opacity-50 disabled:cursor-not-allowed"
        >
            {pending ? (
                <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Guardando...</span>
                </>
            ) : (
                <>
                    <Save className="w-4 h-4" />
                    <span>Guardar Cambios</span>
                </>
            )}
        </button>
    )
}