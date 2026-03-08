'use client'

import { useState, useEffect, useActionState, useRef } from 'react'
import { useFormStatus } from 'react-dom'
import { User, Plus, Edit3, MoreHorizontal, X, Save, Mail, Shield, FileText, Power, Lock, Loader2, AlertCircle, Trash2 } from 'lucide-react'
import { createMember, updateMember, } from '../actions' // Asegúrate de exportar deleteMember en actions.ts
import { sileo } from 'sileo'
import { TeamMember } from '../EquipoManager'
import { deleteMember } from './actions'
import Image from 'next/image'

const getInitials = (name: string) => name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()

interface VistaEquipoProps {
    members: TeamMember[]
    currentUserRole: string
    currentUserId: string
}

export default function VistaEquipo({ members, currentUserRole, currentUserId }: VistaEquipoProps) {
    // Estados
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [isAddModalOpen, setIsAddModalOpen] = useState(false)
    const [editingMember, setEditingMember] = useState<TeamMember | null>(null)

    // Nuevos estados para borrar
    const [memberToDelete, setMemberToDelete] = useState<TeamMember | null>(null)
    const [activeDropdownId, setActiveDropdownId] = useState<string | null>(null)
    const dropdownRef = useRef<HTMLDivElement>(null)

    // Actions
    const [addState, addAction] = useActionState(createMember, null)
    const [editState, editAction] = useActionState(updateMember, null)


    // Cerrar dropdown al hacer click fuera
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setActiveDropdownId(null)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [dropdownRef])

    useEffect(() => {
        if (addState?.success) {
            setIsAddModalOpen(false)
            sileo.success({ title: 'Miembro añadido con éxito', fill: "black", styles: { title: 'text-white font-bold' } })
        }
        if (editState?.success) {
            setIsEditModalOpen(false)
            sileo.success({ title: 'Perfil actualizado', fill: "black", styles: { title: 'text-white font-bold' } })
        }
    }, [addState, editState])

    const handleEditClick = (member: TeamMember) => {
        setEditingMember(member)
        setIsEditModalOpen(true)
        setActiveDropdownId(null)
    }

    const handleDeleteClick = (member: TeamMember) => {
        setMemberToDelete(member)
        setActiveDropdownId(null)
    }

    const handleInputChange = (field: keyof TeamMember, value: any) => {
        if (editingMember) setEditingMember({ ...editingMember, [field]: value })
    }

    const isAdmin = currentUserRole === 'admin'
    const isSelf = editingMember?.id === currentUserId
    const canEditRole = isAdmin
    const canEditStatus = isAdmin || isSelf

    return (
        <>
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {members.map((member) => {
                    const canEditThisMember = currentUserRole === 'admin' || currentUserId === member.id;
                    const isDropdownOpen = activeDropdownId === member.id;

                    return (
                        <div key={member.id} className="group relative bg-zinc-900 border border-zinc-800 rounded-3xl p-6 hover:border-zinc-600 transition-all duration-300 shadow-sm hover:shadow-2xl flex flex-col justify-between h-full min-h-[340px]">

                            {/* Botón de opciones (tres puntos) */}
                            {canEditThisMember && isAdmin && currentUserId !== member.id && (
                                <div className="absolute top-5 right-5 z-20" ref={isDropdownOpen ? dropdownRef : null}>
                                    <button
                                        onClick={() => setActiveDropdownId(isDropdownOpen ? null : member.id)}
                                        className="p-1 text-zinc-600 hover:text-white hover:bg-zinc-800 rounded-md transition-colors cursor-pointer"
                                    >
                                        <MoreHorizontal className="w-5 h-5" />
                                    </button>

                                    {/* Menú Desplegable */}
                                    {isDropdownOpen && (
                                        <div className="absolute right-0 mt-2 w-48 bg-zinc-900 border border-zinc-800 rounded-xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2">
                                            <button
                                                onClick={() => handleDeleteClick(member)}
                                                className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-500 hover:bg-red-500/10 transition-colors text-left font-medium cursor-pointer"
                                            >
                                                <Trash2 className="w-4 h-4" /> Eliminar miembro
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}

                            <div className="flex flex-col items-center gap-5 mt-4">
                                <div className="relative">
                                    <div className="h-24 w-24 rounded-full bg-zinc-800 border-2 border-zinc-700 flex items-center justify-center shrink-0 text-zinc-400 font-bold text-2xl shadow-xl overflow-hidden">
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
                                <button
                                    onClick={() => canEditThisMember && handleEditClick(member)}
                                    disabled={!canEditThisMember}
                                    className={`w-full flex items-center justify-center gap-2 border border-zinc-800 py-2.5 rounded-xl transition-all font-medium text-sm group/btn cursor-pointer
                        ${canEditThisMember ? 'bg-zinc-950 hover:bg-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white' : 'bg-zinc-900/50 text-zinc-600 opacity-50 cursor-not-allowed'}
                    `}
                                >
                                    <Edit3 className="w-4 h-4" /> <span>{canEditThisMember ? 'Editar Perfil' : 'No editable'}</span>
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

                {/* Card Añadir */}
                {currentUserRole === 'admin' && (
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="flex flex-col items-center justify-center gap-5 p-8 rounded-3xl border-2 border-dashed border-zinc-800 bg-zinc-900/20 hover:bg-zinc-900 hover:border-yellow-500/40 text-zinc-500 hover:text-white transition-all h-full min-h-[340px] group cursor-pointer"
                    >
                        <div className="w-20 h-20 rounded-full bg-zinc-950 border border-zinc-800 flex items-center justify-center group-hover:border-yellow-500/40 transition-all">
                            <Plus className="w-8 h-8 group-hover:text-yellow-500 transition-colors" />
                        </div>
                        <div className="text-center space-y-1">
                            <span className="block text-lg font-bold text-zinc-400 group-hover:text-white transition-colors">Añadir compañero</span>
                        </div>
                    </button>
                )}
            </div>

            {/* MODAL 1: AÑADIR NUEVO MIEMBRO */}
            {isAddModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
                    <div className="bg-zinc-900 border border-zinc-800 rounded-3xl w-full max-w-lg shadow-2xl flex flex-col max-h-[90vh]">
                        <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-800 bg-zinc-900/50">
                            <div>
                                <h3 className="text-xl font-bold text-white">Nuevo Miembro</h3>
                                <p className="text-sm text-zinc-400">Invita a un compañero a tu equipo.</p>
                            </div>
                            <button onClick={() => setIsAddModalOpen(false)} className="p-2 rounded-lg hover:bg-zinc-800 text-zinc-500 hover:text-white"><X className="w-6 h-6" /></button>
                        </div>
                        <form action={addAction} className="flex flex-col h-full overflow-hidden">
                            <div className="p-6 space-y-6 overflow-y-auto custom-scrollbar">
                                {addState?.error && (
                                    <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-200 text-sm rounded-xl flex items-start gap-3">
                                        <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" /><span>{addState.error}</span>
                                    </div>
                                )}
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-xs font-bold text-zinc-500 uppercase"><User className="w-3 h-3" /> Nombre Completo</label>
                                    <input name="name" required type="text" className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:border-yellow-500 outline-none" />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="flex items-center gap-2 text-xs font-bold text-zinc-500 uppercase"><Mail className="w-3 h-3" /> Email</label>
                                        <input name="email" required type="email" className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:border-yellow-500 outline-none" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="flex items-center gap-2 text-xs font-bold text-zinc-500 uppercase"><Shield className="w-3 h-3" /> Rol</label>
                                        <select name="role" className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:border-yellow-500 outline-none">
                                            <option value="worker">Worker</option>
                                            <option value="admin">Admin</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-xs font-bold text-zinc-500 uppercase"><Lock className="w-3 h-3" /> Contraseña Temporal</label>
                                    <input name="password" required type="password" className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:border-yellow-500 outline-none" />
                                </div>
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-xs font-bold text-zinc-500 uppercase"><FileText className="w-3 h-3" /> Descripción</label>
                                    <textarea name="description" rows={2} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:border-yellow-500 outline-none resize-none" />
                                </div>
                            </div>
                            <div className="px-6 py-4 bg-zinc-950 border-t border-zinc-800 flex gap-3 mt-auto">
                                <button type="button" onClick={() => setIsAddModalOpen(false)} className="flex-1 py-3 rounded-xl border border-zinc-800 text-zinc-400 hover:text-white font-bold cursor-pointer">Cancelar</button>
                                <SubmitButton />
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* MODAL 2: EDITAR PERFIL */}
            {isEditModalOpen && editingMember && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
                    <div className="bg-zinc-900 border border-zinc-800 rounded-3xl w-full max-w-lg shadow-2xl flex flex-col max-h-[90vh]">
                        <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-800 bg-zinc-900/50">
                            <div>
                                <h3 className="text-xl font-bold text-white">Editar Perfil</h3>
                                <p className="text-sm text-zinc-400">Editando a: <span className="text-white font-medium">{editingMember.full_name}</span></p>
                            </div>
                            <button onClick={() => setIsEditModalOpen(false)} className="p-2 rounded-lg hover:bg-zinc-800 text-zinc-500 hover:text-white"><X className="w-6 h-6" /></button>
                        </div>
                        <form action={editAction} className="flex flex-col h-full overflow-hidden">
                            <div className="p-6 space-y-6 overflow-y-auto custom-scrollbar">
                                <input type="hidden" name="id" value={editingMember.id} />
                                <input type="hidden" name="is_active" value={editingMember.is_active ? 'true' : 'false'} />

                                {editState?.error && (
                                    <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-200 text-sm rounded-xl flex items-center gap-2">
                                        <AlertCircle className="w-4 h-4" /> {editState.error}
                                    </div>
                                )}

                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-xs font-bold text-zinc-500 uppercase"><User className="w-3 h-3" /> Nombre Completo</label>
                                    <input name="full_name" type="text" value={editingMember.full_name} onChange={(e) => handleInputChange('full_name', e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:border-yellow-500 outline-none" />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="flex items-center gap-2 text-xs font-bold text-zinc-500 uppercase"><Mail className="w-3 h-3" /> Email</label>
                                        <input name="email" type="email" value={editingMember.email || ''} disabled={true} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-zinc-500 cursor-not-allowed outline-none" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="flex items-center gap-2 text-xs font-bold text-zinc-500 uppercase"><Shield className="w-3 h-3" /> Rol</label>
                                        <select name="role" value={editingMember.role} onChange={(e) => handleInputChange('role', e.target.value)} disabled={!canEditRole} className={`w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:border-yellow-500 outline-none ${!canEditRole && 'opacity-50'}`}>
                                            <option value="worker">Worker</option>
                                            <option value="admin">Admin</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-xs font-bold text-zinc-500 uppercase"><FileText className="w-3 h-3" /> Descripción</label>
                                    <textarea name="description" rows={3} value={editingMember.description || ''} onChange={(e) => handleInputChange('description', e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:border-yellow-500 outline-none resize-none" />
                                </div>

                                <div className={`bg-zinc-950/50 border border-zinc-800 rounded-xl p-4 flex items-center justify-between ${!canEditStatus ? 'opacity-50' : ''}`}>
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-lg ${editingMember.is_active ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}><Power className="w-5 h-5" /></div>
                                        <div>
                                            <h4 className="text-sm font-bold text-white">Estado de la cuenta</h4>
                                            <p className="text-xs text-zinc-500">{editingMember.is_active ? 'Usuario activo.' : 'Usuario bloqueado.'}</p>
                                        </div>
                                    </div>
                                    <button type="button" disabled={!canEditStatus} onClick={() => canEditStatus && handleInputChange('is_active', !editingMember.is_active)} className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors cursor-pointer ${editingMember.is_active ? 'bg-emerald-500' : 'bg-zinc-700'}`}>
                                        <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${editingMember.is_active ? 'translate-x-6' : 'translate-x-1'}`} />
                                    </button>
                                </div>
                            </div>

                            <div className="px-6 py-4 bg-zinc-950 border-t border-zinc-800 flex gap-3 mt-auto">
                                <button type="button" onClick={() => setIsEditModalOpen(false)} className="flex-1 py-3 rounded-xl border border-zinc-800 text-zinc-400 hover:text-white font-bold cursor-pointer">Cancelar</button>
                                <SaveEditButton />
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* MODAL 3: CONFIRMAR BORRADO */}
            {memberToDelete && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
                    <div className="bg-zinc-950 border border-red-500/20 rounded-3xl w-full max-w-md shadow-2xl flex flex-col overflow-hidden">
                        <div className="p-8 flex flex-col items-center text-center space-y-4">
                            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center">
                                <AlertCircle className="w-8 h-8 text-red-500" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white mb-2">¿Eliminar miembro?</h3>
                                <p className="text-sm text-zinc-400">
                                    Estás a punto de eliminar a <span className="font-bold text-white">{memberToDelete.full_name}</span>. Esta acción es irreversible y eliminará su acceso al sistema.
                                </p>
                            </div>
                        </div>

                        <div className="px-6 py-4 bg-zinc-900 border-t border-zinc-800 flex gap-3">
                            <button
                                onClick={() => setMemberToDelete(null)}
                                type="button"
                                className="flex-1 py-3 rounded-xl border border-zinc-800 bg-zinc-950 text-zinc-400 hover:text-white hover:bg-zinc-800 font-bold transition-all cursor-pointer"
                            >
                                Cancelar
                            </button>
                            <button 
                                type="submit" 
                                disabled={isLoading} 
                                className="flex-1 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-red-900/20 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                onClick={async () => {
                                    try {
                                        if (!memberToDelete.id) {
                                            sileo.error({
                                                title: 'Error eliminando miembro'
                                            })
                                            return
                                        }
                                        setIsLoading(true)

                                        const response = await deleteMember(memberToDelete.id)

                                        if (response.error) {
                                            sileo.error({
                                                title: 'Error eliminando miembro',
                                                description: response.error
                                            })
                                        }
                                        if (response.success) {
                                            sileo.success({
                                                title: 'Miembro eliminado con éxito'
                                            })
                                        }

                                    } catch (error) {
                                        console.error('Error: ', error)
                                        sileo.error({ title: 'Error interno' })
                                    } finally {
                                        setIsLoading(false)
                                        setMemberToDelete(null)
                                    }
                                }}
                            >
                                {isLoading ? <><Loader2 className="w-4 h-4 animate-spin" /><span>Eliminando...</span></> : <><Trash2 className="w-4 h-4" /><span>Sí, eliminar</span></>}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

function SubmitButton() {
    const { pending } = useFormStatus()
    return (
        <button type="submit" disabled={pending} className="flex-1 py-3 rounded-xl bg-yellow-500 text-zinc-950 font-bold flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
            {pending ? <><Loader2 className="w-4 h-4 animate-spin" /><span>Creando...</span></> : <><Save className="w-4 h-4" /><span>Crear Miembro</span></>}
        </button>
    )
}

function SaveEditButton() {
    const { pending } = useFormStatus()
    return (
        <button type="submit" disabled={pending} className="flex-1 py-3 rounded-xl bg-yellow-500 text-zinc-950 font-bold flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
            {pending ? <><Loader2 className="w-4 h-4 animate-spin" /><span>Guardando...</span></> : <><Save className="w-4 h-4" /><span>Guardar Cambios</span></>}
        </button>
    )
}