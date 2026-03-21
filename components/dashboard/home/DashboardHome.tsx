'use client'

import { CalendarDays, Plus, Clock, Ban, ArrowRight, Scissors, CheckCircle2, User, ChevronDown, Euro } from "lucide-react"
import { useEffect, useState } from "react"
import { sileo } from "sileo"
import { getDashboardData, getMembers } from "./actions"
import { Member } from "@/lib/types/databaseTypes"
import { formatInTimeZone } from "date-fns-tz"
import BookingDetailsModal from "./BookingDetailModal"
import { cancelBookingAction } from "@/app/dashboard/agenda/actions"
import { useAdminBooking } from "@/context/AdminBookingContext"
import Image from "next/image"
import { createClient } from "@/utils/supabase/client"

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

    useEffect(() => {
        if (!selectedMemberId) return

        const supabase = createClient()
        let channel: any

        const setupRealtime = async () => {
            // 1. OBLIGAMOS al cliente a leer la sesión y sincronizar la cookie ANTES de abrir el túnel
            const { data: { session } } = await supabase.auth.getSession()
            console.log("¿Cliente autenticado para Realtime?:", session ? "Sí" : "No")

            // 2. Ahora sí, abrimos el canal
            channel = supabase
                .channel('dashboard_booking_changes')
                .on(
                    'postgres_changes',
                    {
                        event: '*',
                        schema: 'public',
                        table: 'bookings'
                    },
                    (payload) => {
                        console.log('Cambio detectado en reservas: ', payload)

                        const reloadData = async () => {
                            const response = await getDashboardData(selectedMemberId)
                            if (response.success) {
                                setKpis(response.kpis)
                                setBookings(response.bookings)
                                setNextBooking(response.nextBooking)
                            }
                        }
                        reloadData()
                    }
                ).subscribe((status, err) => {
                    // 3. Este chivato nos dirá si el túnel se abrió correctamente o fue bloqueado
                    console.log('Estado de la conexión Realtime:', status, err || '')
                })
        }

        setupRealtime()

        // Limpieza del canal al desmontar
        return () => {
            if (channel) {
                supabase.removeChannel(channel)
            }
        }

    }, [selectedMemberId])


    if (isLoading && !memberInfo.name) {
        return (
            <div className="max-w-5xl mx-auto space-y-6 lg:space-y-8 pb-10 animate-pulse">
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

                {/* --- 2. KPIs SKELETON (Estilo Negocio) --- */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="bg-zinc-900 border border-zinc-800 p-4 sm:p-5 rounded-2xl flex flex-col h-full min-h-[130px] sm:min-h-[140px]">
                            <div className="flex justify-between items-start">
                                <div>
                                    <div className="h-3 w-16 sm:w-24 bg-zinc-800/50 rounded-md animate-pulse mb-3" />
                                    <div className="h-6 sm:h-8 w-20 sm:w-32 bg-zinc-800/50 rounded-lg animate-pulse" />
                                </div>
                                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-zinc-800/50 rounded-xl animate-pulse" />
                            </div>
                            <div className="mt-auto h-5 sm:h-6 w-24 bg-zinc-800/50 rounded-md animate-pulse" />
                        </div>
                    ))}
                </div>

                {/* --- 3. PRÓXIMA CITA SKELETON (Estilo Card Horizontal) --- */}
                <div>
                    <div className="h-4 w-32 bg-zinc-800/60 rounded-md mb-3 sm:mb-4"></div>
                    <div className="w-full relative bg-zinc-900 border border-zinc-800/80 rounded-xl overflow-hidden flex flex-col sm:flex-row">
                        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-zinc-800" />
                        <div className="flex-1 p-3 sm:p-5 pl-4 sm:pl-6 flex flex-col justify-center gap-3">
                            <div className="h-5 w-48 bg-zinc-800/80 rounded-md"></div>
                            <div className="flex gap-3">
                                <div className="h-4 w-24 bg-zinc-800/50 rounded-md"></div>
                                <div className="h-4 w-32 bg-zinc-800/50 rounded-md"></div>
                            </div>
                        </div>
                        <div className="bg-zinc-950/50 border-t sm:border-t-0 sm:border-l border-zinc-800/50 p-3 sm:p-5 flex flex-row sm:flex-col justify-between items-center sm:items-end sm:min-w-[140px] w-full sm:w-auto shrink-0">
                            <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full bg-zinc-800/60"></div>
                                <div className="h-3 w-16 bg-zinc-800/50 rounded-md"></div>
                            </div>
                            <div className="h-3 w-20 bg-zinc-800/40 rounded-md mt-2 sm:mt-0"></div>
                        </div>
                    </div>
                </div>

                {/* --- 4. TIMELINE SKELETON --- */}
                {/* --- 4. TIMELINE SKELETON (Estilo Card Horizontal) --- */}
                <div>
                    <div className="h-4 w-32 bg-zinc-800/60 rounded-md mb-3 sm:mb-4"></div>
                    <div className="bg-zinc-900 border border-zinc-800/50 rounded-xl sm:rounded-3xl p-3 sm:p-6 space-y-4 sm:space-y-6 min-h-[200px] flex flex-col relative">
                        
                        <div className="absolute left-[39px] sm:left-[47px] top-6 bottom-6 w-px bg-zinc-800/50" />

                        {[1, 2, 3].map((i) => (
                            <div key={i} className="relative flex gap-3 sm:gap-6 group z-10">
                                
                                {/* Hora esqueleto */}
                                <div className="w-[38px] sm:w-[47px] shrink-0 text-right relative pt-4">
                                    <div className="h-3 w-8 ml-auto bg-zinc-800/60 rounded-md"></div>
                                </div>

                                {/* Tarjeta esqueleto */}
                                <div className="flex-1 relative bg-zinc-900 border border-zinc-800/80 rounded-xl overflow-hidden flex flex-col sm:flex-row">
                                    <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-zinc-800" />
                                    
                                    <div className="flex-1 p-3 sm:p-5 pl-4 sm:pl-6 flex flex-col justify-center gap-3">
                                        <div className="h-5 w-40 bg-zinc-800/80 rounded-md"></div>
                                        <div className="flex gap-2">
                                            <div className="h-4 w-20 bg-zinc-800/50 rounded-md"></div>
                                            <div className="h-4 w-24 bg-zinc-800/50 rounded-md"></div>
                                        </div>
                                    </div>

                                    <div className="bg-zinc-950/50 border-t sm:border-t-0 sm:border-l border-zinc-800/50 p-3 sm:p-5 flex flex-row sm:flex-col justify-between items-center sm:items-end sm:min-w-[140px] w-full sm:w-auto shrink-0">
                                        <div className="flex items-center gap-2">
                                            <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-zinc-800/60"></div>
                                            <div className="h-3 w-12 bg-zinc-800/50 rounded-md"></div>
                                        </div>
                                        <div className="h-3 w-16 bg-zinc-800/40 rounded-md mt-2 sm:mt-0"></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className={`max-w-5xl mx-auto space-y-6 sm:space-y-8 pb-10 animate-in fade-in duration-300 ${isLoading ? 'opacity-50 pointer-events-none' : 'opacity-100'} stagger-container`}>

            {/* --- 1. HEADER Y ACCIONES RÁPIDAS --- */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-5 border-b border-zinc-800 pb-5 sm:pb-6">
                <div>
                    <h1 className="text-2xl font-unbounded font-semibold text-white tracking-tight">
                        Hola, {memberInfo.name?.split(' ')[0] || 'Equipo'}
                    </h1>
                    <p className="text-sm sm:text-base text-zinc-400 mt-1 capitalize">
                        Hoy es {todayString}.
                    </p>
                </div>

                <div className="grid grid-cols-5 justify-center items-center gap-3 w-full lg:w-auto">

                    {/* SELECTOR DE MIEMBRO */}
                    {isAdmin && members.length > 0 && (
                        <div className="relative w-full lg:w-auto col-span-3  font-unbounded">
                            <select
                                value={selectedMemberId || ''}
                                onChange={(e) => setSelectedMemberId(e.target.value)}
                                className="w-full  appearance-none text-xs bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-300 h-11 pl-4 pr-10 rounded-xl font-medium outline-none transition-colors cursor-pointer"
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
                    {
                        !isAdmin &&
                        <div className="relative w-full lg:w-auto col-span-3">
                            <div
                                className="w-full lg:w-48 flex justify-center items-center bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-300 h-11 pl-4 pr-10 rounded-xl text-sm font-medium outline-none transition-colors cursor-pointer"
                            >
                                {memberInfo.name}
                            </div>

                        </div>

                    }

                    {/* BOTONERA (Adaptada para pulgares en móvil) */}
                    <div className="col-span-2 col-start-4 flex items-center gap-2 w-full lg:w-auto">
                        <button
                            className="flex-1 lg:flex-none h-11 flex text-xs font-unbounded items-center justify-center gap-2 bg-yellow-500 hover:bg-yellow-400 text-zinc-950 px-4 rounded-xl font-bold transition-all shadow-lg shadow-yellow-500/20 cursor-pointer"
                            onClick={openModal}
                        >
                            <Plus size={18} />
                            Nueva Cita
                        </button>
                    </div>
                </div>
            </div>

            {/* --- 2. EL PULSO DE HOY (KPIs Estilo Negocio) --- */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 stagger-container">
                
                {/* 1. Citas Totales */}
                <div className="bg-zinc-900 border border-zinc-800 p-4 sm:p-5 rounded-2xl relative overflow-hidden group hover:border-zinc-700 transition-colors flex flex-col h-full min-h-[130px] sm:min-h-[140px]">
                    <div className="flex justify-between items-start relative z-10">
                        <div>
                            <p className="text-zinc-500 text-[12px] sm:text-xs font-bold font-unbounded mb-1 line-clamp-1">Citas Hoy</p>
                            <h3 className="text-2xl sm:text-3xl font-black text-white">{kpis.totalBookings || 0}</h3>
                        </div>
                        <div className="p-1.5 sm:p-2 bg-blue-500/10 rounded-xl text-blue-500 group-hover:scale-110 transition-transform">
                            <CalendarDays size={18} className="sm:w-5 sm:h-5" />
                        </div>
                    </div>
                    <div className="font-unbounded mt-auto flex items-center text-[10px] sm:text-xs font-bold gap-1 w-fit px-1.5 py-1 sm:px-2 sm:py-1 rounded-md text-zinc-400 bg-zinc-800/50">
                        Programadas hoy
                    </div>
                </div>

                {/* 2. Citas Completadas */}
                <div className="bg-zinc-900 border border-zinc-800 p-4 sm:p-5 rounded-2xl relative overflow-hidden group hover:border-zinc-700 transition-colors flex flex-col h-full min-h-[130px] sm:min-h-[140px]">
                    <div className="flex justify-between items-start relative z-10">
                        <div>
                            <p className="text-zinc-500 text-[12px] sm:text-xs font-bold font-unbounded mb-1 line-clamp-1">Completadas</p>
                            <h3 className="text-2xl sm:text-3xl font-black text-white">{kpis.completedBookings || 0}</h3>
                        </div>
                        <div className="p-1.5 sm:p-2 bg-emerald-500/10 rounded-xl text-emerald-500 group-hover:scale-110 transition-transform">
                            <CheckCircle2 size={18} className="sm:w-5 sm:h-5" />
                        </div>
                    </div>
                    <div className="font-unbounded mt-auto flex items-center text-[10px] sm:text-xs font-bold gap-1 w-fit px-1.5 py-1 sm:px-2 sm:py-1 rounded-md text-emerald-500 bg-emerald-500/10">
                        Citas completadas
                    </div>
                </div>

                {/* 3. Canceladas */}
                <div className="bg-zinc-900 border border-zinc-800 p-4 sm:p-5 rounded-2xl relative overflow-hidden group hover:border-zinc-700 transition-colors flex flex-col h-full min-h-[130px] sm:min-h-[140px]">
                    <div className="flex justify-between items-start relative z-10">
                        <div>
                            <p className="text-zinc-500 text-[12px] sm:text-xs font-bold font-unbounded mb-1 line-clamp-1">Canceladas</p>
                            <h3 className="text-2xl sm:text-3xl font-black text-white">{kpis.cancelledBookings || 0}</h3>
                        </div>
                        <div className="p-1.5 sm:p-2 bg-red-500/10 rounded-xl text-red-500 group-hover:scale-110 transition-transform">
                            <Ban size={18} className="sm:w-5 sm:h-5" />
                        </div>
                    </div>
                    <div className="font-unbounded mt-auto flex items-center text-[10px] sm:text-xs font-bold gap-1 w-fit px-1.5 py-1 sm:px-2 sm:py-1 rounded-md text-red-500 bg-red-500/10">
                        Perdidas
                    </div>
                </div>

                {/* 4. Ingresos */}
                <div className="bg-zinc-900 border border-zinc-800 p-4 sm:p-5 rounded-2xl relative overflow-hidden group hover:border-zinc-700 transition-colors flex flex-col h-full min-h-[130px] sm:min-h-[140px]">
                    <div className="flex justify-between items-start relative z-10">
                        <div>
                            <p className="text-zinc-500 text-[12px] sm:text-xs font-bold font-unbounded mb-1 line-clamp-1">Ingresos Hoy</p>
                            <h3 className="text-2xl sm:text-3xl font-black text-yellow-500">{kpis.totalEarnings?.toFixed(2) || "0.00"}€</h3>
                        </div>
                        <div className="p-1.5 sm:p-2 bg-yellow-500/10 rounded-xl text-yellow-500 group-hover:scale-110 transition-transform">
                            <Euro size={18} className="sm:w-5 sm:h-5" />
                        </div>
                    </div>
                    <div className="font-unbounded mt-auto flex items-center text-[10px] sm:text-xs font-bold gap-1 w-fit px-1.5 py-1 sm:px-2 sm:py-1 rounded-md text-yellow-500 bg-yellow-500/10">
                        Total esperado
                    </div>
                </div>
            </div>

            {/* --- 3. PRÓXIMA CITA (Destacado - Estilo DayView Card) --- */}
            <div>
                <h2 className="text-xs sm:text-sm font-unbounded font-bold text-zinc-500 mb-3 sm:mb-4 flex items-center gap-2">
                    <Clock size={16} className="text-yellow-500" /> Tu Próxima Cita
                </h2>
                
                {nextBooking ? (
                    <button
                        onClick={() => setSelectedBooking(nextBooking)}
                        className="w-full relative bg-zinc-900 border border-zinc-800/80 rounded-xl overflow-hidden flex flex-col sm:flex-row text-left transition-all hover:border-yellow-500/50 hover:shadow-lg hover:-translate-y-0.5 group/card focus:outline-none focus:border-yellow-500 cursor-pointer"
                    >
                        {/* Línea de estado amarilla */}
                        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-yellow-500" />

                        {/* Info Principal - Optimizada para Móvil */}
                        <div className="flex-1 p-3 sm:p-5 pl-4 sm:pl-6 flex flex-col justify-center">
                            <div className="flex flex-wrap items-start justify-between mb-2 gap-2">
                                <h3 className="font-bold font-unbounded text-sm sm:text-md text-zinc-100 group-hover/card:text-white transition-colors">
                                    {nextBooking.customer_name}
                                </h3>
                                <span className="bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 text-[9px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider animate-pulse shrink-0">
                                    Siguiente
                                </span>
                            </div>

                            <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-[10px] sm:text-xs text-zinc-400">
                                <span className="flex items-center gap-1.5 bg-zinc-950 px-2 py-1 rounded-md border border-zinc-800/50">
                                    <Clock size={12} className="text-zinc-500" />
                                    <span className="font-medium">
                                        {formatInTimeZone(nextBooking.start_time, TIMEZONE, 'HH:mm')}
                                        {nextBooking.end_time ? ` - ${formatInTimeZone(nextBooking.end_time, TIMEZONE, 'HH:mm')}` : ''}
                                    </span>
                                </span>

                                <span className="flex items-center gap-1.5 bg-zinc-950/50 sm:bg-transparent px-2 py-1 sm:p-0 rounded-md">
                                    <Scissors size={14} className="text-zinc-600" />
                                    <span className="font-medium text-zinc-300">
                                        {nextBooking.booking_items?.[0]?.service_name || 'Servicio'}
                                    </span>
                                    {nextBooking.booking_items?.length > 1 && (
                                        <span className="text-[9px] font-bold bg-zinc-800 text-zinc-300 px-1.5 py-0.5 rounded-md ml-0.5">
                                            +{nextBooking.booking_items.length - 1}
                                        </span>
                                    )}
                                </span>
                            </div>
                        </div>

                        {/* Info Secundaria (Staff y Acción) */}
                        <div className="bg-zinc-950/50 border-t sm:border-t-0 sm:border-l border-zinc-800/50 p-3 sm:p-5 flex flex-row sm:flex-col justify-between items-center sm:items-end sm:min-w-[140px] w-full sm:w-auto shrink-0">
                            <div className="flex items-center gap-2">
                                <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-zinc-800 overflow-hidden relative border border-zinc-700">
                                    {nextBooking.staff?.avatar_url ? (
                                        <Image src={nextBooking.staff.avatar_url} alt="Staff" fill className="object-cover" />
                                    ) : (
                                        <User size={12} className="absolute inset-0 m-auto text-zinc-500" />
                                    )}
                                </div>
                                <span className="text-[10px] sm:text-xs font-medium text-zinc-400">
                                    {nextBooking.staff?.full_name?.split(' ')[0] || 'Staff'}
                                </span>
                            </div>
                            <span className="text-[10px] font-bold text-yellow-500 flex items-center gap-1 group-hover/card:translate-x-1 transition-transform">
                                Ver Detalles <ArrowRight size={12} />
                            </span>
                        </div>
                    </button>
                ) : (
                    <div className="bg-zinc-900 border border-dashed border-zinc-800 rounded-xl p-6 sm:p-8 flex flex-col items-center justify-center text-center">
                        <CheckCircle2 size={32} className="text-emerald-500 mb-3" />
                        <h3 className="text-base font-bold text-white">¡Agenda libre!</h3>
                        <p className="text-xs text-zinc-500 mt-1">No tienes citas próximas pendientes.</p>
                    </div>
                )}
            </div>

            {/* --- 4. TIMELINE DEL DÍA --- */}
            <div>
                <div className="flex gap-2">
                    <CalendarDays size={16} className="text-yellow-500" />                
                    <h2 className="text-xs sm:text-sm font-bold text-zinc-500 font-unbounded mb-3 sm:mb-4">Agenda de Hoy</h2>
                </div>
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl sm:rounded-3xl p-1.5 sm:p-6 min-h-[200px]">
                    {bookings && bookings.length > 0 ? (
                        <div className="relative">
                            {/* Línea vertical unificada para Móvil y PC */}
                            <div className="absolute left-[64px] sm:left-[83px] top-6 bottom-6 w-[2px] bg-zinc-800 rounded-full" />

                            <div className="space-y-3 relative z-10">
                                {bookings.map((booking: any) => {
                                    const isCompleted = booking.status === 'completed'
                                    const isCancelled = booking.status === 'cancelled'
                                    const isNext = nextBooking?.id === booking.id

                                    const itemsList = Array.isArray(booking.booking_items) ? booking.booking_items : []
                                    const firstServiceTitle = itemsList[0]?.service_name || 'Servicio'
                                    const extraServicesCount = itemsList.length > 1 ? itemsList.length - 1 : 0
                                    
                                    const formattedTime = booking.start_time ? formatInTimeZone(booking.start_time, TIMEZONE, 'HH:mm') : '--:--'
                                    const formattedEndTime = booking.end_time ? formatInTimeZone(booking.end_time, TIMEZONE, 'HH:mm') : '--:--'

                                    return (
                                        <div
                                            key={booking.id}
                                            onClick={() => setSelectedBooking(booking)}
                                            className="flex items-stretch gap-3 sm:gap-4 relative cursor-pointer group">

                                            {/* Hora */}
                                            <div className="w-[45px] sm:w-[60px] shrink-0 flex flex-col items-end pt-3.5 sm:pt-4">
                                                <span className={`text-xs sm:text-sm font-bold ${isNext ? 'text-yellow-500' : 'text-zinc-400'}`}>
                                                    {formattedTime}
                                                </span>
                                            </div>

                                            {/* Punto en la línea */}
                                            <div className="relative flex flex-col items-center w-4 shrink-0">
                                                <div className={`
                                                    mt-4 w-2.5 h-2.5 rounded-full ring-[4px] ring-zinc-900 z-10
                                                    ${isNext ? 'bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.8)]' : isCompleted ? 'bg-emerald-600' : isCancelled ? 'bg-red-500 ' : 'bg-yellow-700'}
                                                `} ><div className={`w-2.5 h-2.5 rounded-full ${isNext ? 'bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.8)] animate-ping' : isCompleted ? 'bg-emerald-600/30 shadow-[0_0_8px_rgba(5,150,05,0.8)] animate-ping' : isCancelled ? 'bg-red-500/20 animate-ping' : 'bg-zinc-400'}`} /></div>
                                            </div>

                                            {/* Tarjeta Cita - MODIFICADA AL ESTILO DAYVIEW */}
                                            <div className={`
                                                flex-1 relative bg-zinc-950 border rounded-xl overflow-hidden flex flex-col sm:flex-row text-left transition-all hover:shadow-lg hover:-translate-y-0.5 group/card my-1
                                                ${isNext ? 'border-yellow-500/50 hover:border-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.05)]' : 'border-zinc-800/80 hover:border-zinc-600'}
                                                ${isCompleted || isCancelled ? 'opacity-60' : 'opacity-100'}
                                            `}>
                                                {/* Línea de estado vertical */}
                                                <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${isCompleted ? 'bg-emerald-500' : isCancelled ? 'bg-red-500' : isNext ? 'bg-yellow-500' : 'bg-zinc-600'}`} />

                                                {/* Info Principal */}
                                                <div className="flex-1 p-3 sm:p-4 pl-4 sm:pl-5 flex flex-col justify-center">
                                                    <div className="flex flex-wrap items-start justify-between mb-2 gap-2">
                                                        <h3 className={`font-bold text-sm sm:text-md font-unbounded transition-colors ${isCancelled ? 'line-through text-zinc-500' : 'text-zinc-100 group-hover/card:text-white'}`}>
                                                            {booking.customer_name}
                                                        </h3>
                                                        <div className="flex gap-1.5">
                                                            {isNext && <span className="bg-yellow-500/10 text-yellow-500 text-[9px] font-bold px-1.5 py-0.5 rounded-md uppercase tracking-wider flex items-center shrink-0 animate-pulse">Siguiente</span>}
                                                            {isCompleted && <span className="bg-emerald-500/10 text-emerald-500 text-[9px] font-bold px-1.5 py-0.5 rounded-md tracking-wider flex items-center gap-1 shrink-0"><CheckCircle2 size={10} /> Listo</span>}
                                                            {isCancelled && <span className="bg-red-500/10 text-red-500 text-[9px] font-bold px-1.5 py-0.5 rounded-md tracking-wider flex items-center gap-1 shrink-0"><Ban size={10} /> Cancelada</span>}
                                                        </div>
                                                    </div>

                                                    <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-[10px] sm:text-xs text-zinc-400">
                                                        <span className="flex items-center gap-1.5 bg-zinc-900 px-2 py-1 rounded-md border border-zinc-800/50">
                                                            <Clock size={12} className="text-zinc-500" />
                                                            <span className="font-medium">{formattedTime} - {formattedEndTime}</span>
                                                        </span>

                                                        <span className="flex items-center gap-1.5 bg-zinc-900/50 sm:bg-transparent px-2 py-1 sm:p-0 rounded-md">
                                                            <Scissors size={14} className="text-zinc-600" />
                                                            <span className="font-medium text-zinc-300">{firstServiceTitle}</span>
                                                            {extraServicesCount > 0 && (
                                                                <span className="text-[9px] font-bold bg-zinc-800 text-zinc-300 px-1.5 py-0.5 rounded-md ml-0.5">
                                                                    +{extraServicesCount}
                                                                </span>
                                                            )}
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Info Secundaria (Staff y Acción) */}
                                                <div className="bg-zinc-950/50 border-t sm:border-t-0 sm:border-l border-zinc-800/50 p-3 sm:p-4 flex flex-row sm:flex-col justify-between items-center sm:items-end sm:min-w-[130px] w-full sm:w-auto shrink-0">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-zinc-800 overflow-hidden relative border border-zinc-700">
                                                            {booking.staff?.avatar_url ? (
                                                                <Image src={booking.staff.avatar_url} alt="Staff" fill className="object-cover" />
                                                            ) : (
                                                                <User size={12} className="absolute inset-0 m-auto text-zinc-500" />
                                                            )}
                                                        </div>
                                                        <span className="text-[10px] sm:text-xs font-medium text-zinc-400">
                                                            {booking.staff?.full_name?.split(' ')[0] || 'Staff'}
                                                        </span>
                                                    </div>
                                                    <span className={`text-[10px] font-bold flex items-center gap-1 group-hover/card:translate-x-1 transition-transform ${isNext ? 'text-yellow-500' : 'text-zinc-500 group-hover/card:text-white'}`}>
                                                        Ver Detalles <ArrowRight size={12} />
                                                    </span>
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