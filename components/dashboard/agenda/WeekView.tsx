'use client'

import { startOfWeek, addDays, format, isToday, isSameMonth, isBefore, startOfDay } from 'date-fns'
import { es } from 'date-fns/locale'
import { formatInTimeZone } from 'date-fns-tz'
import { useState, useEffect } from 'react'
import DaySummaryModal from './DaySummaryModal' 

const TIMEZONE = 'Europe/Madrid'
const HOUR_HEIGHT = 120 // 120px exactos por hora

interface WeekViewProps {
    currentDate: Date
    bookings: any[]
    businessHours: {
        open: number
        close: number
    }
}

export default function WeekView({ currentDate, bookings, businessHours }: WeekViewProps) {
    const [summaryData, setSummaryData] = useState<{ date: Date, bookings: any[] } | null>(null)
    const [now, setNow] = useState(new Date())

    // 1. Reloj en tiempo real para la línea amarilla (Se actualiza cada minuto)
    useEffect(() => {
        const interval = setInterval(() => setNow(new Date()), 60000)
        return () => clearInterval(interval)
    }, [])

    const { open: startHour, close: closeHour } = businessHours

    // 2. Cálculos de la cuadrícula
    const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 })
    const weekDays = Array.from({ length: 7 }).map((_, i) => addDays(weekStart, i))
    const hours = Array.from({ length: closeHour - startHour + 1 }).map((_, i) => startHour + i)
    const today = startOfDay(new Date())

    // 3. Obtener citas de una hora exacta
    const getAppointmentsForHour = (date: Date, hour: number) => {
        const dateString = format(date, 'yyyy-MM-dd')
        return bookings.filter(b => {
            if (b.date !== dateString) return false
            const bHour = b.start_time ? parseInt(formatInTimeZone(b.start_time, TIMEZONE, 'HH'), 10) : 0
            return bHour === hour
        })
    }

    // 4. Lógica de la línea de tiempo actual
    const isCurrentWeek = weekDays.some(day => isToday(day))
    const currentHourTZ = parseInt(formatInTimeZone(now, TIMEZONE, 'HH'), 10)
    const currentMinuteTZ = parseInt(formatInTimeZone(now, TIMEZONE, 'mm'), 10)
    const showTimeLine = isCurrentWeek && currentHourTZ >= startHour && currentHourTZ <= closeHour

    return (
        <div className="flex flex-col h-full w-full animate-in fade-in duration-300 gap-4">
            
            {/* Contenedor principal con scroll unificado */}
            <div className="flex-1 overflow-x-auto overflow-y-auto custom-scrollbar rounded-xl relative">
                
                {/* min-w para que no se aplaste en móviles */}
                <div className="min-w-[700px] sm:min-w-[800px] flex flex-col h-full relative">
                    
                    {/* --- CABECERA DE DÍAS --- */}
                    <div className="grid grid-cols-[60px_repeat(7,1fr)] sm:grid-cols-[80px_repeat(7,1fr)] bg-zinc-950 rounded-xl mb-6 sticky top-0 z-40">
                        
                        {/* Esquina vacía - Sticky left para scroll horizontal en móvil */}
                        <div className="py-3 border-r border-zinc-800/50 bg-zinc-950 sticky left-0 z-50 rounded-l-xl"></div>
                        
                        {weekDays.map((day, idx) => {
                            const isCurrentMonth = isSameMonth(day, currentDate)
                            const isCurrentDay = isToday(day)
                            const isPastDay = isBefore(day, today)

                            return (
                                <div key={idx} className={`flex flex-col items-center justify-center py-3 border-r border-zinc-800/50 last:border-r-0 gap-1 transition-opacity ${isPastDay ? 'opacity-50' : 'opacity-100'}`}>
                                    <span className={`text-center text-[10px] sm:text-xs font-bold uppercase tracking-wider ${isCurrentDay ? 'text-yellow-500' : 'text-zinc-500'}`}>
                                        <span className="hidden sm:inline">{format(day, 'EEEE', { locale: es })}</span>
                                        <span className="sm:hidden">{format(day, 'E', { locale: es })}</span>
                                    </span>
                                    <span className={`
                                        flex items-center justify-center w-6 h-6 sm:w-6 sm:h-6 text-sm sm:text-base font-bold rounded-full
                                        ${isCurrentDay 
                                            ? 'bg-yellow-500 text-zinc-950 shadow-md shadow-yellow-500/20' 
                                            : isCurrentMonth ? 'text-zinc-300' : 'text-zinc-600'
                                        }
                                    `}>
                                        {format(day, 'd')}
                                    </span>
                                </div>
                            )
                        })}
                    </div>

                    {/* --- CUADRÍCULA INTERNA --- */}
                    <div className="grid grid-cols-[60px_repeat(7,1fr)] sm:grid-cols-[80px_repeat(7,1fr)] flex-1 relative border border-zinc-700/30 rounded-xl">
                        
                        {/* LÍNEA DE TIEMPO AMARILLA (Indicador actual) */}
                        {showTimeLine && (
                            <div 
                                className="absolute left-[60px] sm:left-[86px] right-0 z-30 flex items-center pointer-events-none transition-all duration-1000"
                                style={{
                                    top: `${((currentHourTZ - startHour) * HOUR_HEIGHT) + (currentMinuteTZ * (HOUR_HEIGHT / 60))}px`
                                }}
                            >
                                <div className="w-2.5 h-2.5 bg-yellow-500 rounded-full -ml-[5px] shadow-[0_0_8px_rgba(234,179,8,0.8)]" />
                                <div className="flex-1 h-0.5 bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.8)]" />
                            </div>
                        )}

                        {/* COLUMNA IZQUIERDA (Horas) - Sticky para scroll lateral en móvil */}
                        <div className="flex flex-col border-r rounded-l-xl border-zinc-700/60 bg-zinc-950 sticky left-0 z-30">
                            {hours.map(hour => (
                                <div key={hour} style={{ height: `${HOUR_HEIGHT}px` }} className="relative border-b border-zinc-700/30 flex items-start justify-end pr-2 sm:pr-3">
                                    {/* Ajustamos la hora visualmente a la línea superior (como GCalendar) */}
                                    <span className="absolute top-2 right-1.5 sm:right-3 text-[10px] sm:text-xs font-bold text-zinc-500  px-1 tracking-wider z-10">
                                        {hour.toString().padStart(2, '0')}:00
                                    </span>
                                </div>
                            ))}
                        </div>

                        {/* COLUMNAS DE DÍAS (Celdas por hora) */}
                        {weekDays.map((day, idx) => {
                            const isCurrentDay = isToday(day)
                            const isPastDay = isBefore(day, today)

                            return (
                                <div key={idx} className={`flex flex-col border-r border-zinc-700/30 last:border-r-0 transition-opacity ${isPastDay ? 'bg-zinc-800/50' : ''}`}>
                                    {hours.map(hour => {
                                        const isPastCell = isPastDay || (isCurrentDay && hour < currentHourTZ)
                                        const hourBookings = getAppointmentsForHour(day, hour)
                                        const appointmentsCount = hourBookings.length

                                        return (
                                            <button
                                                key={`${day}-${hour}`}
                                                onClick={() => appointmentsCount > 0 && setSummaryData({ date: day, bookings: hourBookings })}
                                                style={{ height: `${HOUR_HEIGHT}px` }}
                                                disabled={appointmentsCount === 0}
                                                className={`
                                                    relative flex w-full items-center justify-center p-1 sm:p-2 border-b border-zinc-700/30 transition-all group
                                                    ${isPastCell && !isPastDay ? 'bg-zinc-800/50' : ''}
                                                    ${appointmentsCount > 0 ? 'hover:bg-zinc-800/50 cursor-pointer focus:bg-zinc-800 focus:outline-none hover:opacity-100' : 'cursor-default'}
                                                `}
                                            >
                                                {/* Indicador de Citas CENTRADO */}
                                                {appointmentsCount > 0 && (
                                                    <div className={`
                                                        w-full max-w-[120px] px-2 py-1.5 rounded-lg text-[10px] sm:text-xs font-bold flex items-center justify-center gap-1.5 sm:justify-between transition-colors z-10 shadow-sm
                                                        ${appointmentsCount > 2 
                                                            ? 'bg-red-500/10 text-red-500 border border-red-500/20 group-focus:bg-red-500/20 group-focus:border-red-500/50' 
                                                            : 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 group-focus:bg-emerald-500/20 group-focus:border-emerald-500/50'
                                                        }
                                                    `}>
                                                        <span className="flex items-center gap-1">
                                                            <span>{appointmentsCount}</span>
                                                            <span className="hidden sm:inline">citas</span>
                                                        </span>
                                                        <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${appointmentsCount > 2 ? 'bg-red-500' : 'bg-emerald-500'}`} />
                                                    </div>
                                                )}

                                                {/* Efecto Hover Borde (Opcional) */}
                                                {appointmentsCount > 0 && (
                                                    <div className="absolute inset-0 border-2 border-yellow-500/0 group-hover:border-yellow-500/30 group-focus:border-yellow-500/60 rounded-md m-0.5 transition-colors pointer-events-none" />
                                                )}
                                            </button>
                                        )
                                    })}
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>

            {/* --- MODAL DE RESUMEN DE ESA HORA --- */}
            {summaryData && (
                <DaySummaryModal 
                    date={summaryData.date}
                    bookings={summaryData.bookings}
                    onClose={() => setSummaryData(null)}
                />
            )}
        </div>
    )
}