'use client'

import Link from "next/link"
import { CalendarDays, Plus, Clock, Ban, ArrowRight, Scissors, CheckCircle2, ChevronRight, User, ChevronDown, Euro } from "lucide-react"
import { useEffect, useState } from "react"
import { sileo } from "sileo"
import { getDashboardData, getMembers } from "./actions"
import { Member } from "@/lib/types/databaseTypes"
import { formatInTimeZone } from "date-fns-tz"
import BookingDetailsModal from "./BookingDetailModal"
import { cancelBookingAction } from "@/app/dashboard/agenda/actions"
import { useAdminBooking } from "@/context/AdminBookingContext"

const TIMEZONE = 'Europe/Madrid'

export const DashboardHome = () => {

    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [members, setMembers] = useState<Member[]>([])
    const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null)
    const [isAdmin, setIsAdmin] = useState<boolean>(false)

    const [kpis, setKpis] = useState<{
        totalBookings: number | null
        completedBookings: number | null
        cancelledBookings: number | null
        totalEarnings: number | null
    }>({
        totalBookings: null,
        completedBookings: null,
        cancelledBookings: null,
        totalEarnings: null
    })

    const [nextBooking, setNextBooking] = useState<any | null>(null)
    const [memberInfo, setMemberInfo] = useState<{
        name: string | null
        avatar: string | null
    }>({
        name: null,
        avatar: null
    })
    const [bookings, setBookings] = useState<any[]>([])

    const [selectedBooking, setSelectedBooking] = useState<any | null>(null)

    const { openModal } = useAdminBooking()

    const dateOptions: Intl.DateTimeFormatOptions = { weekday: 'long', day: 'numeric', month: 'long', timeZone: TIMEZONE }
    const todayString = new Date().toLocaleDateString('es-ES', dateOptions)

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const response = await getMembers()

                if (response.error) {
                    sileo.error({ title: 'Error obteniendo miembros', description: response.error })
                    return
                }
                if (response.success) {
                    setMembers(response.profiles)
                    setIsAdmin(response.isAdmin)
                    const defaultId = response.profiles.some(p => p.id === response.currentUserId) 
                        ? response.currentUserId
                        : (response.profiles[0].id || null)
                    setSelectedMemberId(defaultId)
                }
            } catch (error) {
                console.error('Error: ', error)
                sileo.error({ title: 'Error interno', description: 'Vuelve a intentarlo' })
            }
        }

        fetchInitialData()
    }, [])

    useEffect(() => {
        const fetchData = async () => {
            if (!selectedMemberId) return

            try {
                setIsLoading(true)
                const response = await getDashboardData(selectedMemberId)

                if (response.error) {
                    sileo.error({ title: 'Error cargando datos', description: response.error })
                    return
                }
                if (response.success) {
                    setKpis(response.kpis)
                    setNextBooking(response.nextBooking)
                    setMemberInfo(response.memberInfo)
                    setBookings(response.bookings)
                }
            } catch (error) {
                console.error('Error: ', error)
                sileo.error({ title: 'Error interno' })
            } finally {
                setIsLoading(false)
            }
        }

        fetchData()
    }, [selectedMemberId])

    if (isLoading && !memberInfo.name) {
        return (
            <div className="max-w-5xl mx-auto space-y-6 sm:space-y-8 pb-10 animate-pulse">
                {/* --- 1. HEADER SKELETON --- */}
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-5 border-b border-zinc-800 pb-5 sm:pb-6">
                    <div>
                        <div className="h-8 sm:h-10 w-48 sm:w-64 bg-zinc-800/60 rounded-lg"></div>
                        <div className="h-4 sm:h-5 w-32 sm:w-48 bg-zinc-800/40 rounded-md mt-3"></div>
                    </div>

                    <div className="grid grid-cols-5 justify-center items-center gap-3 w-full lg:w-auto mt-2 lg:mt-0">
                        {/* Selector falso */}
                        <div className="w-full sm:w-48 h-11 bg-zinc-800/50 rounded-xl col-span-3"></div>
                        
                        {/* Botones falsos */}
                        <div className="col-span-2 col-start-4 flex items-center gap-2 w-full sm:w-auto">
                            <div className="hidden sm:block w-11 h-11 bg-zinc-800/50 rounded-xl shrink-0"></div>
                            <div className="hidden sm:block w-11 h-11 bg-zinc-800/50 rounded-xl shrink-0"></div>
                            <div className="flex-1 sm:w-32 h-11 bg-zinc-800/50 rounded-xl"></div>
                        </div>
                    </div>
                </div>

                {/* --- 2. KPIs SKELETON --- */}
                <div className="grid grid-cols-3 gap-3 sm:gap-4">
                    <div className="bg-zinc-900 border border-zinc-800/50 p-3.5 sm:p-5 rounded-xl flex flex-col items-center justify-center gap-3 h-[90px] sm:h-[104px]">
                        <div className="w-16 h-4 bg-zinc-800/60 rounded-md"></div>
                        <div className="w-20 h-7 bg-zinc-800/80 rounded-lg"></div>
                    </div>
                    <div className="bg-zinc-900 border border-zinc-800/50 p-3.5 sm:p-5 rounded-xl flex flex-col items-center justify-center gap-3 h-[90px] sm:h-[104px]">
                        <div className="w-16 h-4 bg-zinc-800/60 rounded-md"></div>
                        <div className="w-20 h-7 bg-zinc-800/80 rounded-lg"></div>
                    </div>
                    <div className="bg-zinc-900 border border-zinc-800/50 p-3.5 sm:p-5 rounded-xl flex flex-col items-center justify-center gap-3 h-[90px] sm:h-[104px]">
                        <div className="w-16 h-4 bg-zinc-800/60 rounded-md"></div>
                        <div className="w-20 h-7 bg-zinc-800/80 rounded-lg"></div>
                    </div>
                </div>

                {/* --- 3. PRÓXIMA CITA SKELETON --- */}
                <div>
                    <div className="h-4 w-32 bg-zinc-800/60 rounded-md mb-3 sm:mb-4"></div>
                    <div className="bg-zinc-900 border border-zinc-800/50 rounded-2xl sm:rounded-3xl h-[120px] sm:h-[136px] p-4 sm:p-6 flex items-center gap-4 sm:gap-6">
                        <div className="w-[75px] sm:w-[90px] h-full bg-zinc-800/50 rounded-xl shrink-0"></div>
                        <div className="flex-1 flex flex-col justify-center gap-3">
                            <div className="w-40 sm:w-64 h-6 sm:h-7 bg-zinc-800/80 rounded-md"></div>
                            <div className="w-24 sm:w-40 h-4 bg-zinc-800/50 rounded-md"></div>
                        </div>
                        <div className="hidden sm:block w-32 h-10 bg-zinc-800/60 rounded-xl shrink-0"></div>
                    </div>
                </div>

                {/* --- 4. TIMELINE SKELETON --- */}
                <div>
                    <div className="h-4 w-32 bg-zinc-800/60 rounded-md mb-3 sm:mb-4"></div>
                    <div className="bg-zinc-900 border border-zinc-800/50 rounded-xl sm:rounded-3xl p-3 sm:p-6 space-y-4 sm:space-y-6 min-h-[200px] flex flex-col relative">
                        <div className="absolute left-[39px] sm:left-[61px] top-6 bottom-6 w-[2px] bg-zinc-800/50 rounded-full" />
                        
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex items-center gap-3 sm:gap-4 relative z-10">
                                <div className="w-[45px] sm:w-[60px] shrink-0 flex justify-end">
                                    <div className="w-10 h-4 bg-zinc-800/60 rounded"></div>
                                </div>
                                <div className="w-2.5 h-2.5 rounded-full bg-zinc-800/80 shrink-0"></div>
                                <div className="flex-1 h-[72px] sm:h-[80px] bg-zinc-950/50 border border-zinc-800/30 rounded-xl flex flex-col justify-center px-4 gap-2">
                                    <div className="w-32 sm:w-48 h-5 bg-zinc-800/60 rounded-md"></div>
                                    <div className="w-20 sm:w-32 h-3 bg-zinc-800/40 rounded-md"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className={`max-w-5xl mx-auto space-y-6 sm:space-y-8 pb-10 animate-in fade-in duration-300 ${isLoading ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>

            {/* --- 1. HEADER Y ACCIONES RÁPIDAS --- */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-5 border-b border-zinc-800 pb-5 sm:pb-6">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                        Hola, {memberInfo.name?.split(' ')[0] || 'Equipo'}
                    </h1>
                    <p className="text-sm sm:text-base text-zinc-400 mt-1 capitalize">
                        Hoy es {todayString}.
                    </p>
                </div>

                <div className="grid grid-cols-5 justify-center items-center gap-3 w-full lg:w-auto">

                    {/* SELECTOR DE MIEMBRO */}
                    {isAdmin && members.length > 0 && (
                        <div className="relative w-full sm:w-auto col-span-3">
                            <select
                                value={selectedMemberId || ''}
                                onChange={(e) => setSelectedMemberId(e.target.value)}
                                className="w-full sm:w-48 appearance-none bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-300 h-11 pl-4 pr-10 rounded-xl text-sm font-medium outline-none transition-colors cursor-pointer"
                            >
                                {members.map(p => (
                                    <option key={p.id} value={p.id}>
                                        {p.full_name}
                                    </option>
                                ))}
                            </select>
                            <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
                        </div>
                    )}

                    {/* BOTONERA (Adaptada para pulgares en móvil) */}
                    <div className="col-span-2 col-start-4 flex items-center gap-2 w-full sm:w-auto">
                        <button 
                            className="flex-1 sm:flex-none h-11 flex items-center justify-center gap-2 bg-yellow-500 hover:bg-yellow-400 text-zinc-950 px-4 rounded-xl font-bold text-sm transition-all shadow-lg shadow-yellow-500/20 cursor-pointer"
                            onClick={openModal}    
                        >
                            <Plus size={18} />
                            Nueva Cita
                        </button>
                    </div>
                </div>
            </div>

            {/* --- 2. EL PULSO DE HOY (KPIs) --- */}
            <div className="grid grid-cols-3 gap-3 sm:gap-4">
                <div className="bg-yellow-500/5 border border-yellow-500/30 p-3.5 sm:p-5 rounded-xl flex flex-col items-center justify-center gap-2 hover:border-zinc-700 transition-colors">
                    <div className="flex items-center gap-2 text-yellow-400">
                        <CalendarDays size={14} className="text-yellow-500" />
                        <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider">Citas Hoy</span>
                    </div>
                    <div className="flex flex-wrap items-baseline gap-1.5 mt-auto">
                        <h3 className="text-2xl sm:text-3xl font-black text-yellow-500 leading-none">{kpis.totalBookings || 0}</h3>
                        <span className="text-[10px] sm:text-xs text-yellow-500 font-medium">/{kpis.completedBookings || 0} listas</span>
                    </div>
                </div>

                <div className="bg-emerald-500/5 border border-emerald-500/30 p-3.5 sm:p-5 rounded-xl flex flex-col items-center justify-center gap-2 hover:border-zinc-700 transition-colors">
                    <div className="flex items-center gap-2 text-emerald-500">
                        <Euro size={14} className="text-emerald-500" />
                        <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider">Ingresos</span>
                    </div>
                    <div className="mt-auto">
                        <h3 className="text-2xl sm:text-3xl font-black text-emerald-500 leading-none">{kpis.totalEarnings?.toFixed(2) || "0.00"}€</h3>
                    </div>
                </div>

                {/* En móvil ocupa 2 columnas, en PC 1 */}
                <div className="col-span-1 bg-red-500/5 border border-red-500/30 p-3.5 sm:p-5 rounded-xl flex flex-col items-center justify-center gap-2 hover:border-zinc-700 transition-colors">
                    <div className="flex items-center gap-2 text-red-500">
                        <Ban size={14} className="text-red-500" />
                        <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider">Canceladas</span>
                    </div>
                    <div className="mt-auto">
                        <h3 className="text-2xl sm:text-3xl font-black text-red-500 leading-none">{kpis.cancelledBookings || 0}</h3>
                    </div>
                </div>
            </div>

            {/* --- 3. PRÓXIMA CITA (Destacado) --- */}
            <div>
                <h2 className="text-xs sm:text-sm font-bold text-zinc-500 uppercase tracking-wider mb-3 sm:mb-4 flex items-center gap-2">
                    <Clock size={16} className="text-yellow-500" /> Tu Próxima Cita
                </h2>
                {nextBooking ? (
                    <div 
                        onClick={() => setSelectedBooking(nextBooking)}
                        className="relative bg-zinc-900 border border-yellow-500/30 rounded-xl sm:rounded-3xl p-4 sm:p-6 overflow-hidden group cursor-pointer">
                        <div className="absolute top-0 right-0 w-48 h-48 sm:w-64 sm:h-64 bg-yellow-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

                        <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-6">
                            <div className="flex items-center gap-4 w-full min-w-0">
                                <div className="bg-zinc-950 border border-zinc-800 p-3 sm:p-4 rounded-xl flex flex-col items-center justify-center min-w-[75px] sm:min-w-[90px] shrink-0">
                                    <span className="text-xl sm:text-2xl font-black text-white leading-none">
                                        {formatInTimeZone(nextBooking.start_time, TIMEZONE, 'HH:mm')}
                                    </span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-lg sm:text-xl font-bold text-white mb-1.5 truncate">{nextBooking.customer_name}</h3>
                                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs text-zinc-400">
                                        <span className="flex items-center gap-1.5 truncate">
                                            <Scissors size={12} className="text-zinc-500 shrink-0" />
                                            <span className="truncate">{nextBooking.booking_items?.[0]?.service_name + `${nextBooking.booking_items.length > 1 ? ` + ${nextBooking.booking_items.length}` : ''}` || 'Servicio'}</span>
                                        </span>
                                        {isAdmin && nextBooking.staff && (
                                            <>
                                                <span className="text-zinc-700 hidden xs:inline">•</span>
                                                <span className="flex items-center gap-1.5 shrink-0"><User size={12} className="text-zinc-500" /> {nextBooking.staff.full_name?.split(' ')[0]}</span>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <button 
                                className="w-full sm:w-auto bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-2.5 sm:py-2 rounded-xl text-sm font-bold transition-colors flex items-center justify-center gap-2 shrink-0 cursor-pointer"
                                onClick={() => setSelectedBooking(nextBooking)}
                            >
                                Ver Detalles <ArrowRight size={16} />
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="bg-zinc-900 border border-dashed border-zinc-800 rounded-xl sm:rounded-3xl p-6 sm:p-8 flex flex-col items-center justify-center text-center">
                        <CheckCircle2 size={36} className="text-emerald-500 mb-3" />
                        <h3 className="text-base sm:text-lg font-bold text-white">¡Agenda libre!</h3>
                        <p className="text-xs sm:text-sm text-zinc-500 mt-1">No tienes citas próximas pendientes.</p>
                    </div>
                )}
            </div>

            {/* --- 4. TIMELINE DEL DÍA --- */}
            <div>
                <h2 className="text-xs sm:text-sm font-bold text-zinc-500 uppercase tracking-wider mb-3 sm:mb-4">Agenda de Hoy</h2>
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl sm:rounded-3xl p-3 sm:p-6 min-h-[200px]">
                    {bookings && bookings.length > 0 ? (
                        <div className="relative">
                            {/* Línea vertical unificada para Móvil y PC */}
                            <div className="absolute left-[64px] sm:left-[83px] top-6 bottom-6 w-[2px] bg-zinc-800 rounded-full" />

                            <div className="space-y-3 relative z-10">
                                {bookings.map((booking: any) => {
                                    const isCompleted = booking.status === 'completed'
                                    const isCancelled = booking.status === 'cancelled'
                                    const isNext = nextBooking?.id === booking.id

                                    return (
                                        <div 
                                            key={booking.id} 
                                            onClick={() => setSelectedBooking(booking)}
                                            className="flex items-stretch gap-3 sm:gap-4 relative cursor-pointer group">

                                            {/* Hora */}
                                            <div className="w-[45px] sm:w-[60px] shrink-0 flex flex-col items-end pt-3.5 sm:pt-4">
                                                <span className={`text-xs sm:text-sm font-bold ${isNext ? 'text-yellow-500' : 'text-zinc-400'}`}>
                                                    {formatInTimeZone(booking.start_time, TIMEZONE, 'HH:mm')}
                                                </span>
                                            </div>

                                            {/* Punto en la línea */}
                                            <div className="relative flex flex-col items-center w-4 shrink-0">
                                                <div className={`
                                                    mt-4 w-2.5 h-2.5 rounded-full ring-[4px] ring-zinc-900 z-10
                                                    ${isNext ? 'bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.8)]' : isCompleted ? 'bg-emerald-600' : isCancelled ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]' : 'bg-yellow-700'}
                                                `} ><div className={`w-2.5 h-2.5 rounded-full ${isNext ? 'bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.8)] animate-ping' : isCompleted ? 'bg-emerald-600/30 shadow-[0_0_8px_rgba(5,150,05,0.8)] animate-ping' : isCancelled ? 'bg-red-500/20 animate-ping' : 'bg-zinc-400'}`} /></div>
                                            </div>

                                            {/* Tarjeta Cita */}
                                            <div className={`
                                                flex-1 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-3 
                                                p-3 sm:p-4 rounded-xl border transition-colors my-1
                                                ${isNext ? 'bg-zinc-950 border-yellow-500/20 shadow-md' : 'bg-zinc-950/50 border-zinc-800/60 group-hover:border-zinc-700'}
                                                ${isCompleted || isCancelled ? 'opacity-50' : ''}
                                            `}>
                                                <div className="min-w-0 w-full">
                                                    <div className="flex flex-wrap items-center gap-2 mb-1">
                                                        <h4 className={`font-bold text-sm sm:text-base truncate ${isCancelled ? 'line-through text-zinc-500' : 'text-zinc-200'}`}>
                                                            {booking.customer_name}
                                                        </h4>
                                                        {isCompleted && <span className="bg-emerald-500/10 text-emerald-500 text-[9px] font-bold px-1.5 py-0.5 rounded-md flex items-center gap-1 shrink-0"><CheckCircle2 size={10} /> Listo</span>}
                                                        {isCancelled && <span className="bg-red-500/10 text-red-500 text-[9px] font-bold px-1.5 py-0.5 rounded-md flex items-center gap-1 shrink-0"><Ban size={10} /> Cancelada</span>}
                                                    </div>
                                                    <div className="flex flex-wrap items-center gap-2 text-[11px] sm:text-xs text-zinc-500">
                                                        <span className="flex items-center gap-1 truncate">
                                                            <Scissors size={12} className="shrink-0" />
                                                            <span className="truncate">{booking.booking_items?.[0]?.service_name + `${booking.booking_items.length > 1 ? ` + ${booking.booking_items.length}` : ''}` || 'Servicio'}</span>
                                                        </span>
                                                        {isAdmin && booking.staff && (
                                                            <>
                                                                <span className="hidden sm:inline text-zinc-700">•</span>
                                                                <span className="flex items-center gap-1 shrink-0"><User size={12} /> {booking.staff.full_name?.split(' ')[0]}</span>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="text-zinc-500 group-hover:text-white p-2 rounded-lg group-hover:bg-zinc-800 transition-colors hidden sm:block shrink-0">
                                                    <ChevronRight size={18} />
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    ) : (
                        <div className="py-10 sm:py-12 flex flex-col items-center justify-center text-center">
                            <CalendarDays size={40} className="text-zinc-800 mb-3" />
                            <p className="text-zinc-400 text-sm font-medium">No hay citas programadas para hoy.</p>
                        </div>
                    )}
                </div>
            </div>

            {
                selectedBooking && (
                    <BookingDetailsModal
                        booking={selectedBooking}
                        isLoading={isLoading}
                        onClose={() => setSelectedBooking(null)}
                        onCancel={async () => {
                            setIsLoading(true)
                            const result = await cancelBookingAction(selectedBooking.id)

                            if (result.error) {
                                // 1. Ocurrió un error grave (ej. fallo en BD)
                                setIsLoading(false)
                                sileo.error({
                                    title: 'Error al cancelar la reserva.',
                                    description: result.error
                                })
                            } else if (result.warning) {
                                setIsLoading(false)
                                sileo.warning({
                                    title: 'Reserva cancelada.',
                                    description: result.warning // "Cita cancelada pero hubo un error al enviar el correo..."
                                })
                            } else if (result.success) {
                                setIsLoading(false)
                                sileo.success({
                                    title: 'Reserva cancelada con éxito.',
                                    description: 'El cliente recibira un correo con la cancelación.'
                                })

                            } else {
                                setIsLoading(false)
                                sileo.error({
                                    title: 'Error al cancelar la reserva.'
                                })
                            }
                            setSelectedBooking(null)
                        }}
                    />
                )
            }
        </div>
    )
}