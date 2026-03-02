'use client'

import { 
    startOfMonth, 
    endOfMonth, 
    startOfWeek, 
    endOfWeek, 
    eachDayOfInterval, 
    format, 
    isSameMonth, 
    isToday,
    isBefore,
    startOfDay
} from 'date-fns'
import { es } from 'date-fns/locale'

interface MonthViewProps {
    currentDate: Date
    selectedStaffId: string
    bookings: any[]
    onDayClick: (date: Date) => void
}

export default function MonthView({ currentDate, selectedStaffId, bookings, onDayClick }: MonthViewProps) {
    
    // 1. Cálculos de la cuadrícula del calendario
    const monthStart = startOfMonth(currentDate)
    const monthEnd = endOfMonth(monthStart)
    // Empezamos la semana en lunes (weekStartsOn: 1)
    const startDate = startOfWeek(monthStart, { weekStartsOn: 1 }) 
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 })

    const calendarDays = eachDayOfInterval({
        start: startDate,
        end: endDate
    })

    const weekDays = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']

    // Día actual sin horas para comparaciones exactas
    const today = startOfDay(new Date())

    const getAppointmentsCount = (date: Date) => {
        const dateString = format(date, 'yyyy-MM-dd')
        return bookings.filter(b => b.date === dateString).length
    }

    return (
        <div className="flex flex-col h-full w-full bg-zinc-900 animate-in fade-in duration-300 gap-4">
            
            {/* Cabecera de los días de la semana */}
            <div className="grid grid-cols-7 bg-zinc-950/50 rounded-xl">
                {weekDays.map(day => (
                    <div key={day} className="py-3 text-center text-xs font-bold text-yellow-500 uppercase tracking-wider">
                        <span className="hidden sm:inline">{day}</span>
                        <span className="sm:hidden">{day.slice(0, 1)}</span>
                    </div>
                ))}
            </div>

            {/* Cuadrícula de días */}
            <div className="grid grid-cols-7 gap-0.5 flex-1 auto-rows-fr">
                {calendarDays.map((day) => {
                    const isCurrentMonth = isSameMonth(day, monthStart)
                    const isCurrentDay = isToday(day)
                    const isPastDay = isBefore(day, today)
                    const appointmentsCount = getAppointmentsCount(day)

                    return (
                        <button
                            key={day.toString()}
                            onClick={() => onDayClick(day)}
                            className={`
                                relative group min-h-[80px] md:min-h-[120px] p-1.5 sm:p-2 rounded-md border-r border-b border-zinc-800/50 
                                flex flex-col items-start justify-start text-left transition-colors 
                                hover:bg-zinc-800/50 focus:outline-none focus:bg-yellow-500 group cursor-pointer
                                ${!isCurrentMonth 
                                    ? 'bg-zinc-950/30' // Mes anterior/siguiente
                                    : isPastDay && !isCurrentDay 
                                        ? 'bg-zinc-800/50' // Días pasados de este mes
                                        : 'bg-zinc-950' // Días futuros o el actual
                                }
                            `}
                        >
                            {/* Número del día */}
                            <div className="flex items-center justify-between w-full mb-2">
                                <span className={`
                                    flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 text-xs sm:text-sm font-bold rounded-full
                                    ${isCurrentDay 
                                        ? 'bg-yellow-500 group-focus:bg-zinc-900 text-zinc-950 group-focus:text-yellow-500 shadow-md shadow-yellow-500/20' 
                                        : isCurrentMonth ? 'text-zinc-300 group-focus:text-black' : 'text-zinc-600 group-focus:text-yellow-500'
                                    }
                                `}>
                                    {format(day, 'd')}
                                </span>
                            </div>

                            {/* Indicador de Citas */}
                            {appointmentsCount > 0 && (
                                <div className="mt-auto w-full">
                                    <div className={`w-full px-1 sm:px-2 py-1 sm:py-1.5 rounded-md sm:rounded-lg text-[10px] sm:text-xs font-bold flex items-center justify-center sm:justify-between gap-1.5 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 group-focus:bg-black/10 group-focus:text-black group-focus:border-black`}>
                                        <span>
                                            {appointmentsCount}
                                            {/* Ocultamos la palabra "citas" en móvil para que encaje perfecto */}
                                            <span className="hidden sm:inline"> citas</span>
                                        </span>
                                    </div>
                                </div>
                            )}

                            {/* Efecto Hover Borde (opcional, le da un toque premium) */}
                            <div className="absolute inset-0 border-2 border-yellow-500/0 group-hover:border-yellow-500/50 rounded-lg m-0.5 transition-colors pointer-events-none" />
                        </button>
                    )
                })}
            </div>
        </div>
    )
}