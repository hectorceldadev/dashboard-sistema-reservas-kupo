'use client'

import { format, isToday, isBefore, startOfDay } from 'date-fns'
import { es } from 'date-fns/locale'
import { formatInTimeZone } from 'date-fns-tz'
import { useState, useEffect } from 'react'
import { Clock, User, Scissors, ArrowRight, AlertCircle, Calendar } from 'lucide-react'
import Image from 'next/image'
import BookingDetailsModal from './BookingDetailModal'
import { cancelBookingAction } from '@/app/dashboard/agenda/actions'
import { sileo } from 'sileo'

const TIMEZONE = 'Europe/Madrid'

interface DayViewProps {
    currentDate: Date
    bookings: any[]
    businessHours: {
        open: number
        close: number
    }
}

export default function DayView({ currentDate, bookings, businessHours }: DayViewProps) {
    const [selectedBooking, setSelectedBooking] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [now, setNow] = useState(new Date())

    // Actualizamos el reloj cada minuto
    useEffect(() => {
        const interval = setInterval(() => setNow(new Date()), 60000)
        return () => clearInterval(interval)
    }, [])

    const { open: startHour, close: closeHour } = businessHours
    const hours = Array.from({ length: closeHour - startHour + 1 }).map((_, i) => startHour + i)

    const today = startOfDay(new Date())
    const currentHourTZ = parseInt(formatInTimeZone(now, TIMEZONE, 'HH'), 10)
    const currentMinuteTZ = parseInt(formatInTimeZone(now, TIMEZONE, 'mm'), 10)
    const isCurrentDay = isToday(currentDate)
    const isPastDay = isBefore(startOfDay(currentDate), today)

    // Filtrar citas solo para el día seleccionado
    const dateString = format(currentDate, 'yyyy-MM-dd')
    const dayBookings = bookings
        .filter(b => b.date === dateString)
        .sort((a, b) => a.start_time.localeCompare(b.start_time))

    const getAppointmentsForHour = (hour: number) => {
        return dayBookings.filter(b => {
            const bHour = b.start_time ? parseInt(formatInTimeZone(b.start_time, TIMEZONE, 'HH'), 10) : 0
            return bHour === hour
        })
    }

    return (
        <div className="flex flex-col h-full w-full animate-in fade-in duration-300 stagger-container">

            {/* Cabecera del Día */}
            <div className="bg-zinc-950 rounded-xl mb-6 p-6 shadow-sm flex items-center justify-between sticky top-0 z-30">
                <div>
                    <h2 className="text-xl font-bold font-unbounded text-white capitalize">
                        {format(currentDate, "EEEE, d 'de' MMMM", { locale: es })}
                    </h2>
                    <p className="text-base font-medium text-zinc-400 mt-1 flex items-center gap-2">
                        {dayBookings.length > 0 && <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />}
                        {dayBookings.length} {dayBookings.length === 1 ? 'cita programada' : 'citas programadas'}
                    </p>
                </div>
                {isCurrentDay && (
                    <div className="hidden sm:flex px-4 py-2 bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 rounded-lg text-sm font-bold items-center gap-2">
                        <Clock size={16} />
                        {formatInTimeZone(now, TIMEZONE, 'HH:mm')}
                    </div>
                )}
            </div>

            {/* Timeline Vertical */}
            <div className="flex-1 bg-zinc-950 border border-zinc-700/70 rounded-xl p-2 sm:p-8 overflow-y-auto custom-scrollbar relative">

                <div className="max-w-4xl mx-auto relative">
                    {hours.map(hour => {
                        const hourBookings = getAppointmentsForHour(hour)
                        const isPastHour = isPastDay || (isCurrentDay && hour < currentHourTZ)
                        const isThisHour = isCurrentDay && hour === currentHourTZ

                        return (
                            // AÑADIDO: border-b para separar las horas y padding general ajustado
                            <div key={hour} className={`relative flex gap-3 sm:gap-8 group border-b border-zinc-800/30 last:border-b-0 pt-4 pb-6 ${isPastHour ? 'opacity-60' : 'opacity-100'}`}>

                                {/* Línea vertical del Timeline (Corregida para que baje hasta el final) */}
                                <div className={`absolute left-[38px] sm:left-[47px] top-0 bottom-0 w-px ${isThisHour ? 'bg-yellow-500/50' : 'bg-zinc-700/50'}`} />

                                {/* AÑADIDO: Línea amarilla de tiempo real interactiva para la hora actual */}
                                {isThisHour && (
                                    <div
                                        className="absolute left-[38px] sm:left-[47px] right-0 z-30 flex items-center pointer-events-none transition-all duration-1000"
                                        style={{
                                            top: `${Math.max(5, (currentMinuteTZ / 60) * 100)}%` // Calcula la posición exacta dentro del bloque de esta hora
                                        }}
                                    >
                                        <div className="w-2.5 h-2.5 bg-yellow-500 rounded-full -ml-[5px] shadow-[0_0_8px_rgba(234,179,8,0.8)]" />
                                        <div className="flex-1 h-[2px] bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.8)]" />
                                    </div>
                                )}

                                {/* Etiqueta de la Hora */}
                                <div className="w-[38px] sm:w-[47px] shrink-0 text-right relative">
                                    <span className={`text-xs sm:text-xs font-bold tracking-wider relative z-10 px-1 ${isThisHour ? 'text-yellow-500 bg-zinc-950' : 'text-zinc-500 bg-zinc-950'}`}>
                                        {hour.toString().padStart(2, '0')}:00
                                    </span>
                                </div>

                                {/* Contenedor de Citas de esta hora */}
                                <div className="flex-1 flex flex-col gap-3 min-h-[60px]">
                                    {hourBookings.length === 0 ? (
                                        <div className="h-full border border-dashed border-zinc-800/30 rounded-xl flex items-center px-4 sm:px-6 opacity-0 group-hover:opacity-100 transition-opacity min-h-[50px]">
                                            <span className="text-xs sm:text-xs font-medium text-zinc-600">Hora libre</span>
                                        </div>
                                    ) : (
                                        hourBookings.map(booking => {
                                            const isCompleted = booking.status === 'completed'
                                            const itemsList = Array.isArray(booking.booking_items) ? booking.booking_items : []
                                            const firstServiceTitle = itemsList[0]?.service_name || 'Servicio'
                                            const extraServicesCount = itemsList.length > 1 ? itemsList.length - 1 : 0

                                            const formattedTime = booking.start_time ? formatInTimeZone(booking.start_time, TIMEZONE, 'HH:mm') : '--:--'
                                            const formattedEndTime = booking.end_time ? formatInTimeZone(booking.end_time, TIMEZONE, 'HH:mm') : '--:--'

                                            return (
                                                <button
                                                    key={booking.id}
                                                    onClick={() => setSelectedBooking(booking)}
                                                    className={`
                                                        w-full relative bg-zinc-900 border border-zinc-800/80 rounded-xl overflow-hidden flex flex-col sm:flex-row text-left transition-all hover:border-yellow-500/50 hover:shadow-lg hover:-translate-y-0.5 group/card focus:outline-none focus:border-yellow-500 cursor-pointer
                                                    `}
                                                >
                                                    {/* Línea de estado */}
                                                    <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${isCompleted ? 'bg-emerald-500' : 'bg-yellow-500'}`} />

                                                    {/* Info Principal - Optimizada para Móvil */}
                                                    <div className="flex-1 p-3 sm:p-5 pl-4 sm:pl-6 flex flex-col justify-center">
                                                        <div className="flex flex-wrap items-start justify-between mb-2 gap-2">
                                                            <h3 className="font-bold text-base sm:text-md font-unbounded text-zinc-100 group-hover/card:text-white transition-colors">
                                                                {booking.customer_name}
                                                            </h3>
                                                        </div>

                                                        <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-xs text-zinc-400">
                                                            <span className="flex items-center gap-1.5 bg-zinc-950 px-2 py-1 rounded-md border border-zinc-800/50">
                                                                <Clock size={12} className="text-zinc-500" />
                                                                <span className="font-medium">{formattedTime} - {formattedEndTime}</span>
                                                            </span>

                                                            <span className="flex items-center gap-1.5 bg-zinc-950/50 sm:bg-transparent px-2 py-1 sm:p-0 rounded-md">
                                                                <Scissors size={14} className="text-zinc-600" />
                                                                <span className="font-medium text-zinc-300">{firstServiceTitle}</span>
                                                                {extraServicesCount > 0 && (
                                                                    <span className="text-[10px] font-bold bg-zinc-800 text-zinc-300 px-1.5 py-0.5 rounded-md ml-0.5">
                                                                        +{extraServicesCount}
                                                                    </span>
                                                                )}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    {/* Info Secuntaria (Staff y Acción) - Ajustada en móvil */}
                                                    <div className="bg-zinc-950/50 border-t sm:border-t-0 sm:border-l border-zinc-800/50 p-3 sm:p-5 flex flex-row sm:flex-col justify-between items-center sm:items-end sm:min-w-[140px] w-full sm:w-auto shrink-0">
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-zinc-800 overflow-hidden relative border border-zinc-700">
                                                                {booking.staff?.avatar_url ? (
                                                                    <Image src={booking.staff.avatar_url} alt="Staff" fill className="object-cover" />
                                                                ) : (
                                                                    <User size={12} className="absolute inset-0 m-auto text-zinc-500" />
                                                                )}
                                                            </div>
                                                            <span className="text-xs sm:text-xs font-medium text-zinc-400">
                                                                {booking.staff?.full_name?.split(' ')[0] || 'Staff'}
                                                            </span>
                                                        </div>
                                                        <span className="text-xs font-bold text-yellow-500 flex items-center gap-1 group-hover/card:translate-x-1 transition-transform">
                                                            Ver Detalles <ArrowRight size={12} />
                                                        </span>
                                                    </div>
                                                </button>
                                            )
                                        })
                                    )}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* MODAL DE DETALLE */}
            {selectedBooking &&
                <BookingDetailsModal
                    booking={selectedBooking}
                    onClose={() => setSelectedBooking(null)}
                    isLoading={isLoading}
                    onCancel={async (id) => {
                        setIsLoading(true)
                        const result = await cancelBookingAction(id)

                        if (result.error) {
                            sileo.error({ title: 'Error al cancelar la reserva.', description: result.error })
                        } else if (result.warning) {
                            sileo.warning({ title: 'Reserva cancelada.', description: result.warning })
                        } else if (result.success) {
                            sileo.success({ title: 'Reserva cancelada con éxito.', description: 'El cliente recibirá un correo de cancelación.' })
                        }

                        setIsLoading(false)
                        setSelectedBooking(null)
                    }}
                />
            }
        </div>
    )
}