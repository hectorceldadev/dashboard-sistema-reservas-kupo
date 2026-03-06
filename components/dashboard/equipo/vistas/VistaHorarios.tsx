'use client'

import { useState, useEffect } from 'react'
import { Clock, Plus, X, Save, Coffee, Lock, Loader2, Trash, ChevronDown, CalendarRange, LoaderCircle } from 'lucide-react'
import { sileo } from 'sileo'
import { TeamMember, StaffSchedule, BlockedPeriod } from '../EquipoManager'
import { getMemberSchedule, updateMemberSchedule, createBlockedPeriods, deleteBlockedPeriod } from './actions'

const getInitials = (name: string) => name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()

const DAYS_OF_WEEK = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']

export default function VistaHorarios({ members }: { members: TeamMember[] }) {
    const [selectedMemberId, setSelectedMemberId] = useState<string | null>(members[0]?.id || null)
    const [activeView, setActiveView] = useState<'schedule' | 'blocks'>('schedule')
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)

    const [schedules, setSchedules] = useState<StaffSchedule[]>([])
    const [blockedPeriods, setBlockedPeriods] = useState<BlockedPeriod[]>([])
    const [isLoading, setIsLoading] = useState(false)

    const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false)
    const [selectedDayIndex, setSelectedDayIndex] = useState<number | null>(null)
    const [hasBreak, setHasBreak] = useState(false)

    const [isBlockModalOpen, setIsBlockModalOpen] = useState(false)

    const [isLoadingDelete, setIsLoadingDelete] = useState<string | null>(null)

    const selectedMember = members.find(m => m.id === selectedMemberId)

    // ✅ Forzamos a que is_working sea un boolean, nunca null
    const [memberSchedule, setMemberSchedule] = useState<{
        start_time: string | null,
        end_time: string | null,
        break_start: string | null,
        break_end: string | null,
        day_of_week: number | null,
        is_working: boolean 
    }>({
        start_time: null,
        end_time: null,
        break_start: null,
        break_end: null,
        day_of_week: null,
        is_working: false
    })

    const [blockedPeriod, setBlockedPeriod] = useState<{
        start_date: string | null
        end_date: string | null
        reason: string | null
    }>({
        start_date: null,
        end_date: null,
        reason: null,
    })

    // Función aislada para poder recargar desde cualquier sitio
    const loadMemberData = async (memberId: string) => {
        setIsLoading(true)
        try {
            const response = await getMemberSchedule(memberId)
            if (response.error) {
                sileo.error({ title: 'Error', description: response.error })
                return
            }
            setSchedules(response.schedule || [])
            setBlockedPeriods(response.blockedPeriods || [])
        } catch {
            sileo.error({ title: 'Error interno' })
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        if (selectedMemberId) {
            loadMemberData(selectedMemberId)
        }
    }, [selectedMemberId])

    const formatDateTime = (dateString: string) => {
        return new Date(dateString).toLocaleString('es-ES', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })
    }

    const activeBlocks = blockedPeriods.filter(b => b.status === 'active')
    const completedBlocks = blockedPeriods.filter(b => b.status === 'completed')

    const orderedDays = [1, 2, 3, 4, 5, 6, 0]
    const hoy = new Date().toISOString().slice(0, 16)
    const limiteMaximo = '2099-12-31T23:59'

    return (
        <div className="animate-fade-in space-y-6">

            {/* BARRA SUPERIOR */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-zinc-900 border border-zinc-800 p-4 rounded-3xl relative z-20">
                <div className="relative w-full md:w-80">
                    <button
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="flex items-center justify-between w-full bg-zinc-950 border border-zinc-800 p-3 rounded-2xl hover:border-zinc-700 transition-colors cursor-pointer"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center shrink-0 text-sm font-bold border border-zinc-700 text-zinc-400">
                                {getInitials(selectedMember?.full_name || '')}
                            </div>
                            <div className="text-left overflow-hidden">
                                <p className="text-sm font-bold text-white truncate">{selectedMember?.full_name}</p>
                                <p className="text-[10px] text-zinc-500 uppercase">{selectedMember?.role}</p>
                            </div>
                        </div>
                        <ChevronDown className={`w-5 h-5 text-zinc-500 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {isDropdownOpen && (
                        <>
                            <div className="fixed inset-0 z-10 cursor-pointer" onClick={() => setIsDropdownOpen(false)}></div>
                            <div className="absolute top-full mt-2 left-0 w-full bg-zinc-900 border border-zinc-800 rounded-2xl shadow-xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
                                <div className="max-h-60 overflow-y-auto custom-scrollbar p-2 space-y-1">
                                    {members.map(member => (
                                        <button
                                            key={member.id}
                                            onClick={() => { setSelectedMemberId(member.id); setIsDropdownOpen(false); }}
                                            className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all hover:bg-white/20 ${selectedMemberId === member.id ? 'bg-yellow-500/10 text-yellow-500' : 'hover:bg-zinc-800 text-zinc-400'} cursor-pointer`}
                                        >
                                            <div className="text-sm font-bold truncate">{member.full_name}</div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}
                </div>

                <div className="flex items-center p-1.5 bg-zinc-950 border border-zinc-800 rounded-xl w-full md:w-auto overflow-x-auto custom-scrollbar">
                    <button
                        onClick={() => setActiveView('schedule')}
                        className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-bold rounded-lg transition-all whitespace-nowrap ${activeView === 'schedule' ? 'bg-zinc-800 text-white shadow-md' : 'text-zinc-500 hover:text-zinc-300'} cursor-pointer`}
                    >
                        <Clock className="w-4 h-4" /> <span>Horario Base</span>
                    </button>
                    <button
                        onClick={() => setActiveView('blocks')}
                        className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-bold rounded-lg transition-all whitespace-nowrap ${activeView === 'blocks' ? 'bg-zinc-800 text-white shadow-md' : 'text-zinc-500 hover:text-zinc-300'} cursor-pointer`}
                    >
                        <CalendarRange className="w-4 h-4" /> <span>Ausencias y Bloqueos</span>
                    </button>
                </div>
            </div>

            {/* ÁREA DE CONTENIDO */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 min-h-[400px]">
                {isLoading ? (
                    <div className="h-full min-h-[350px] flex flex-col items-center justify-center text-zinc-500 gap-3">
                        <Loader2 className="w-8 h-8 animate-spin text-yellow-500" />
                        <p className="text-sm font-medium animate-pulse">Cargando agenda de {selectedMember?.full_name.split(' ')[0]}...</p>
                    </div>
                ) : (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">

                        {/* VISTA 1: HORARIO BASE */}
                        {activeView === 'schedule' && (
                            <div>
                                <div className="mb-6 pb-6 border-b border-zinc-800">
                                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                        <Clock className="w-5 h-5 text-yellow-500" /> Planificador Semanal
                                    </h2>
                                    <p className="text-sm text-zinc-400 mt-1">Configura los días y turnos fijos de la semana. Pulsa sobre un día para editarlo.</p>
                                </div>

                                <div className="flex w-full overflow-x-auto pb-4 gap-1 custom-scrollbar snap-x">
                                    {orderedDays.map(dayIndex => {
                                        const dayName = DAYS_OF_WEEK[dayIndex];
                                        const daySchedule = schedules.find(s => s.day_of_week === dayIndex);
                                        const isWorking = daySchedule?.is_working ?? false;

                                        return (
                                            <button
                                                key={dayName}
                                                onClick={() => {
                                                    setSelectedDayIndex(dayIndex)
                                                    setHasBreak(!!daySchedule?.break_start)
                                                    setMemberSchedule({
                                                        start_time: daySchedule?.start_time?.slice(0, 5) || "09:00",
                                                        end_time: daySchedule?.end_time?.slice(0, 5) || "20:00",
                                                        break_start: daySchedule?.break_start?.slice(0, 5) || "14:00",
                                                        break_end: daySchedule?.break_end?.slice(0, 5) || "16:00",
                                                        day_of_week: dayIndex,
                                                        is_working: isWorking
                                                    });
                                                    setIsScheduleModalOpen(true)
                                                }}
                                                className={`relative flex-shrink-0 w-[140px] xl:flex-1 flex flex-col items-center py-4 px-2 rounded-3xl border transition-all group snap-center cursor-pointer
                                                ${isWorking
                                                        ? 'bg-zinc-950 border-zinc-800 hover:border-yellow-500/50 hover:shadow-lg hover:shadow-yellow-500/5'
                                                        : 'bg-zinc-900/30 border-zinc-700 hover:opacity-100 border-dashed hover:border-zinc-700'
                                                    }
                                            `}
                                            >
                                                <div className={`text-xs font-bold uppercase tracking-wider mb-4 group-hover:text-yellow-500 transition-colors duration-300 ${isWorking ? 'text-white' : 'text-zinc-500'}`}>
                                                    {dayName}
                                                </div>

                                                {isWorking ? (
                                                    <div className="flex flex-col items-center w-full gap-3">
                                                        <div className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl py-3 flex flex-col items-center justify-center group-hover:border-yellow-500/30 transition-colors">
                                                            <span className="text-sm font-mono font-bold text-zinc-200">{daySchedule?.start_time.slice(0, 5)}</span>
                                                            <div className="w-1/2 border-t border-zinc-800 my-1"></div>
                                                            <span className="text-sm font-mono font-bold text-zinc-200">{daySchedule?.end_time.slice(0, 5)}</span>
                                                        </div>

                                                        {daySchedule?.break_start ? (
                                                            <div className="flex flex-col items-center gap-1 w-full pt-2">
                                                                <Coffee className="w-4 h-4 text-yellow-500/70" />
                                                                <span className="text-[10px] text-zinc-500 font-medium">
                                                                    {daySchedule.break_start.slice(0, 5)} - {daySchedule.break_end?.slice(0, 5)}
                                                                </span>
                                                            </div>
                                                        ) : (
                                                            <div className="flex flex-col items-center gap-1 w-full pt-2">
                                                                <Coffee className="w-4 h-4 text-yellow-500/70" />
                                                                <span className="text-[10px] text-zinc-500 font-medium">
                                                                    Sin Descansos
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <div className="flex flex-col items-center justify-center h-full gap-3 py-6">
                                                        <div className="w-10 h-10 rounded-full bg-zinc-800/50 flex items-center justify-center">
                                                            <X className="w-4 h-4 text-zinc-500" />
                                                        </div>
                                                        <span className="text-xs text-zinc-500 font-medium">Libre</span>
                                                    </div>
                                                )}
                                            </button>
                                        )
                                    })}
                                </div>
                            </div>
                        )}

                        {/* VISTA 2: BLOQUEOS Y EXCEPCIONES */}
                        {activeView === 'blocks' && (
                            <div>
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-6 border-b border-zinc-800">
                                    <div>
                                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                            <Lock className="w-5 h-5 text-red-500" /> Excepciones y Bloqueos
                                        </h2>
                                        <p className="text-sm text-zinc-400 mt-1">Añade vacaciones, citas médicas o ausencias puntuales.</p>
                                    </div>
                                    <button
                                        onClick={() => setIsBlockModalOpen(true)}
                                        className="flex items-center gap-2 bg-red-500 hover:bg-red-400 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg shadow-red-500/20 whitespace-nowrap cursor-pointer"
                                    >
                                        <Plus className="w-4 h-4" /> Nuevo Bloqueo
                                    </button>
                                </div>

                                <div className="grid lg:grid-cols-2 gap-8">
                                    <div>
                                        <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                                            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span> Activos / Programados
                                        </h3>
                                        <div className="space-y-3">
                                            {activeBlocks.length === 0 && (
                                                <div className="p-6 border border-dashed border-zinc-800 rounded-2xl flex flex-col items-center justify-center text-center">
                                                    <CalendarRange className="w-8 h-8 text-zinc-700 mb-2" />
                                                    <p className="text-sm text-zinc-500">No hay ausencias programadas.</p>
                                                </div>
                                            )}
                                            {activeBlocks.map(block => (
                                                <div key={block.id} className="flex flex-col sm:flex-row justify-between p-4 rounded-xl border border-red-500/20 bg-red-500/5 gap-4 hover:border-red-500/40 transition-colors">
                                                    <div>
                                                        <p className="text-sm font-bold text-white mb-1">
                                                            {formatDateTime(block.start_date)} <span className="text-zinc-500 mx-1">→</span> {formatDateTime(block.end_date)}
                                                        </p>
                                                        <p className="text-xs text-red-400 font-medium flex items-center gap-1.5">
                                                            <Lock className="w-3 h-3" /> {block.reason || 'Ausencia general'}
                                                        </p>
                                                    </div>
                                                    <button 
                                                        onClick={async () => {
                                                            try {
                                                                if (!selectedMemberId) return

                                                                setIsLoadingDelete(block.id)
                                                                const response = await deleteBlockedPeriod(block.id, selectedMemberId)

                                                                if (response.error) {
                                                                    sileo.error({ title: 'Error eliminando', description: response.error })
                                                                    return
                                                                }
                                                                if (response.success) {
                                                                    sileo.success({ title: 'Eliminado con éxito' })
                                                                    const optimisticBlockedPeriods = blockedPeriods.filter(b => b.id !== block.id)
                                                                    setBlockedPeriods(optimisticBlockedPeriods)
                                                                }
                                                            } catch (error) {
                                                                console.error('Error: ', error)
                                                                sileo.error({ title: 'Error interno.' })
                                                            } finally {
                                                                setIsLoadingDelete(null)
                                                            }
                                                        }}
                                                        className="p-2 text-zinc-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors shrink-0 self-start sm:self-center border border-transparent hover:border-red-500/20 cursor-pointer">
                                                        {isLoadingDelete === block.id ? <LoaderCircle className='w-4 h-4 animate-spin' /> : <Trash className="w-4 h-4" />}
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-4">Historial Pasado</h3>
                                        <div className="space-y-3 opacity-60">
                                            {completedBlocks.length === 0 && <p className="text-sm text-zinc-600 italic">No hay historial.</p>}
                                            {completedBlocks.map(block => (
                                                <div key={block.id} className="p-4 rounded-xl border border-zinc-800 bg-zinc-950">
                                                    <p className="text-sm font-bold text-zinc-400 mb-1">
                                                        {formatDateTime(block.start_date)} <span className="text-zinc-600 mx-1">→</span> {formatDateTime(block.end_date)}
                                                    </p>
                                                    <p className="text-xs text-zinc-500">{block.reason || 'Ausencia general'}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* MODAL 1: MODIFICAR HORARIO BASE DEL DÍA */}
            {isScheduleModalOpen && selectedDayIndex !== null && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
                    <div className="bg-zinc-900 border border-zinc-800 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col">
                        <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-800 bg-zinc-900/50">
                            <div>
                                <h3 className="text-lg font-bold text-white flex items-center gap-2"><Clock className="w-5 h-5 text-yellow-500" /> Editar Horario</h3>
                                <p className="text-sm text-zinc-400">Para todos los <span className="text-white font-medium">{DAYS_OF_WEEK[selectedDayIndex]}s</span></p>
                            </div>
                            <button onClick={() => setIsScheduleModalOpen(false)} className="text-zinc-500 hover:text-white transition-colors"><X className="w-6 h-6" /></button>
                        </div>

                        <div className="flex flex-col">
                            <div className="p-6 space-y-6">

                                <div className="flex items-center justify-between bg-zinc-950/50 border border-zinc-800 rounded-xl p-4 mb-4">
                                    <div>
                                        <h4 className="text-sm font-bold text-white">Día Laborable</h4>
                                        <p className="text-xs text-zinc-500">¿El trabajador opera este día?</p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setMemberSchedule({ ...memberSchedule, is_working: !memberSchedule.is_working })
                                            setHasBreak(false)
                                        }}
                                        className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${memberSchedule.is_working ? 'bg-yellow-500' : 'bg-zinc-700'}`}
                                    >
                                        <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${memberSchedule.is_working ? 'translate-x-6' : 'translate-x-1'}`} />
                                    </button>
                                </div>

                                <div className={`transition-opacity ${!memberSchedule.is_working ? 'opacity-50 pointer-events-none' : ''}`}>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-zinc-500 uppercase">Entrada</label>
                                            <input
                                                type="time"
                                                value={memberSchedule.start_time || ''}
                                                onChange={(e) => setMemberSchedule({ ...memberSchedule, start_time: e.target.value })}
                                                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:border-yellow-500 outline-none text-center font-mono"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-zinc-500 uppercase">Salida</label>
                                            <input
                                                type="time"
                                                value={memberSchedule.end_time || ''}
                                                onChange={(e) => setMemberSchedule({ ...memberSchedule, end_time: e.target.value })}
                                                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:border-yellow-500 outline-none text-center font-mono"
                                            />
                                        </div>
                                    </div>

                                    <div className="relative my-6">
                                        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-zinc-800"></div></div>
                                        <div className="relative flex justify-center"><span className="bg-zinc-900 px-3 text-xs font-medium text-zinc-500">Descanso / Break</span></div>
                                    </div>

                                    <div className="flex items-center justify-between bg-zinc-950/50 border border-zinc-800 rounded-xl p-4 mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className={`p-2 rounded-lg ${hasBreak ? 'bg-yellow-500/10 text-yellow-500' : 'bg-zinc-800 text-zinc-500'}`}><Coffee className="w-5 h-5" /></div>
                                            <span className="text-sm font-bold text-zinc-300">¿Tiene descanso?</span>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                const newHasBreak = !hasBreak;
                                                setHasBreak(newHasBreak);
                                                if (!newHasBreak) {
                                                    setMemberSchedule({ ...memberSchedule, break_start: null, break_end: null });
                                                } else {
                                                    setMemberSchedule({ ...memberSchedule, break_start: '14:00', break_end: '15:00' });
                                                }
                                            }}
                                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${hasBreak ? 'bg-yellow-500' : 'bg-zinc-700'}`}
                                        >
                                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${hasBreak ? 'translate-x-6' : 'translate-x-1'}`} />
                                        </button>
                                    </div>

                                    {hasBreak && (
                                        <div className="grid grid-cols-2 gap-4 animate-in slide-in-from-top-2">
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-zinc-500 uppercase">Inicio Descanso</label>
                                                <input
                                                    type="time"
                                                    value={memberSchedule.break_start || ''}
                                                    onChange={(e) => setMemberSchedule({ ...memberSchedule, break_start: e.target.value })}
                                                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:border-yellow-500 outline-none text-center font-mono"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-zinc-500 uppercase">Fin Descanso</label>
                                                <input
                                                    type="time"
                                                    value={memberSchedule.break_end || ''}
                                                    onChange={(e) => setMemberSchedule({ ...memberSchedule, break_end: e.target.value })}
                                                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:border-yellow-500 outline-none text-center font-mono"
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="px-6 py-4 bg-zinc-950 border-t border-zinc-800 flex gap-3">
                                <button type="button" onClick={() => setIsScheduleModalOpen(false)} className="flex-1 py-3 rounded-xl border border-zinc-800 text-zinc-400 hover:text-white font-bold transition-colors">Cancelar</button>

                                <button
                                    type="button"
                                    disabled={isLoading}
                                    onClick={async (e) => {
                                        e.preventDefault();
                                        try {
                                            if (!selectedMemberId) return

                                            setIsLoading(true)

                                            const finalBreakStart = hasBreak ? memberSchedule.break_start : null
                                            const finalBreakEnd = hasBreak ? memberSchedule.break_end : null
                                            
                                            // ✅ Pasamos el booleano de forma estricta. Nada de || o ??
                                            const isWorkingValue = Boolean(memberSchedule.is_working)

                                            console.log("Enviando a BD:", { is_working: isWorkingValue, day: memberSchedule.day_of_week })

                                            const response = await updateMemberSchedule(selectedMemberId, {
                                                break_end: finalBreakEnd,
                                                break_start: finalBreakStart,
                                                day_of_week: memberSchedule.day_of_week ?? 1,
                                                end_time: memberSchedule.end_time,
                                                is_working: isWorkingValue,
                                                start_time: memberSchedule.start_time
                                            })
                                            
                                            if (!response) return
                                            
                                            if (response.error) {
                                                sileo.error({ 
                                                    title: 'Error actualizando horario',
                                                    description: response.error
                                                })
                                                return
                                            }
                                            if (response.success) {
                                                sileo.success({ title: 'Horario actualizado con éxito', fill: 'black', styles: { title: 'text-white' } })
                                                
                                                // Recargamos los datos para ver reflejado el cambio
                                                await loadMemberData(selectedMemberId)
                                            }
                                        } catch (error) {
                                            console.error('Error: ', error)
                                            sileo.error({ title: 'Error interno.' })
                                        } finally {
                                            setIsScheduleModalOpen(false)
                                        }
                                    }}
                                    className="flex-1 py-3 rounded-xl bg-yellow-500 text-zinc-950 font-bold transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                    Guardar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL DE BLOQUEOS (lo dejo como lo tenías) ... */}
            {isBlockModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
                    <div className="bg-zinc-900 border border-red-500/20 rounded-3xl w-full max-w-md shadow-2xl flex flex-col">
                        <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-800 rounded-t-3xl bg-zinc-900/50">
                            <div>
                                <h3 className="text-xl font-bold text-white flex items-center gap-2"><Lock className="w-5 h-5 text-red-500" /> Bloquear Agenda</h3>
                                <p className="text-sm text-zinc-400">Para: <span className="text-white font-medium">{selectedMember?.full_name}</span></p>
                            </div>
                            <button onClick={() => setIsBlockModalOpen(false)} className="p-2 rounded-lg hover:bg-zinc-800 text-zinc-500 hover:text-white cursor-pointer"><X className="w-6 h-6" /></button>
                        </div>
                        <div className="flex flex-col">
                            <div className="p-6 space-y-6">
                                <input type="hidden" name="staff_id" value={selectedMemberId || ''} />

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-zinc-500 uppercase">Inicio</label>
                                        <input 
                                            name="start_date" 
                                            value={blockedPeriod.start_date || ''}
                                            onChange={(e) => setBlockedPeriod({ ...blockedPeriod, start_date: e.target.value })} 
                                            required 
                                            type="datetime-local" 
                                            min={hoy}
                                            max={limiteMaximo}
                                            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:border-red-500 outline-none text-sm [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert cursor-pointer" 
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-zinc-500 uppercase">Fin</label>
                                        <input 
                                            name="end_date" 
                                            value={blockedPeriod.end_date || ''}
                                            onChange={(e) => 
                                            setBlockedPeriod({ ...blockedPeriod, end_date: e.target.value })} 
                                            required 
                                            type="datetime-local" 
                                            min={hoy}
                                            max={limiteMaximo}
                                            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:border-red-500 outline-none text-sm [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert cursor-pointer" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-zinc-500 uppercase">Motivo (Opcional)</label>
                                    <input 
                                        name="reason" 
                                        value={blockedPeriod.reason || ''}
                                        onChange={(e) => setBlockedPeriod({ ...blockedPeriod, reason: e.target.value })} 
                                        type="text" 
                                        placeholder="Ej: Cita médica, vacaciones..." 
                                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:border-red-500 outline-none placeholder:text-zinc-600 cursor-pointer" 
                                    />
                                </div>
                            </div>
                            <div className="px-6 py-4 bg-zinc-950 border-t rounded-b-3xl border-zinc-800 flex gap-3">
                                <button type="button" onClick={() => setIsBlockModalOpen(false)} className="flex-1 py-3 rounded-xl border border-zinc-800 text-zinc-400 hover:text-white font-bold transition-colors cursor-pointer">Cancelar</button>
                                <button 
                                    type='button'
                                    onClick={async (e) => {
                                        e.preventDefault()
                                        try {
                                            if (!selectedMemberId) return
                                            if (!blockedPeriod.start_date || !blockedPeriod.end_date) {
                                                sileo.error({ 
                                                    title: 'Datos inválidos',
                                                    description: 'Por favor, rellena las fechas de inicio y fin.' 
                                                })
                                                return;
                                            }

                                            const response = await createBlockedPeriods(selectedMemberId, {
                                                end_date: blockedPeriod.end_date,
                                                reason: blockedPeriod.reason || '',
                                                start_date: blockedPeriod.start_date
                                            })

                                            if (response.error) {
                                                sileo.error({
                                                    title: 'Error creando el bloqueo',
                                                    description: response.error
                                                })
                                                return
                                            }
                                            if (response.success) {
                                                setBlockedPeriod({ start_date: null, end_date: null, reason: null })
                                                sileo.success({
                                                    title: 'Bloqueo creado correctamente'
                                                })
                                                await loadMemberData(selectedMemberId)
                                            }
                                        } catch (error) {
                                            console.error('Error: ', error)
                                            sileo.error({ title: 'Error interno.' })
                                        } finally {
                                            setIsBlockModalOpen(false)
                                        }
                                    }}
                                    disabled={isLoading} 
                                    className="flex-1 py-3 rounded-xl bg-red-500 text-white font-bold flex items-center justify-center gap-2 shadow-lg shadow-red-500/20 cursor-pointer">
                                    {isLoading ? <><Loader2 className="w-4 h-4 animate-spin" /><span>Creando...</span></> : <><Lock className="w-4 h-4" /><span>Crear Bloqueo</span></>}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}