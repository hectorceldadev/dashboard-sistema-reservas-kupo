'use client'

import { useState } from 'react'
import { 
    ChevronLeft, 
    ChevronRight, 
    Calendar as CalendarIcon, 
    Users 
} from 'lucide-react'
import { 
    addMonths, 
    subMonths, 
    addWeeks, 
    subWeeks, 
    addDays, 
    subDays, 
    format 
} from 'date-fns'
import { es } from 'date-fns/locale'
import MonthView from './MonthView'
import DaySummaryModal from './DaySummaryModal'
import WeekView from './WeekView'
import DayView from './DayView'

// Tipos
type ViewType = 'month' | 'week' | 'day'

interface StaffMember {
    id: string
    full_name: string
    role: string
}

interface AgendaContainerProps {
    initialStaff: StaffMember[]
    isAdmin: boolean
    currentUserId: string
    initialBookings: any[],
    businessHours: {
        open: number
        close: number
    }
}

export default function AgendaContainer({ initialStaff, isAdmin, currentUserId, initialBookings, businessHours }: AgendaContainerProps) {
    // --- ESTADOS GLOBALES DE LA AGENDA ---
    const [currentDate, setCurrentDate] = useState(new Date())
    const [viewType, setViewType] = useState<ViewType>('month')
    const [selectedStaffId, setSelectedStaffId] = useState<string>('all')

    const [selectedDay, setSelectedDay] = useState<Date | null>(null)
    const [isDayModalOpen, setIsDayModalOpen] = useState<boolean>(false)

    // --- LÓGICA DE NAVEGACIÓN DE FECHAS ---
    const goToToday = () => setCurrentDate(new Date())

    const handlePrevious = () => {
        if (viewType === 'month') setCurrentDate(subMonths(currentDate, 1))
        if (viewType === 'week') setCurrentDate(subWeeks(currentDate, 1))
        if (viewType === 'day') setCurrentDate(subDays(currentDate, 1))
    }

    const handleNext = () => {
        if (viewType === 'month') setCurrentDate(addMonths(currentDate, 1))
        if (viewType === 'week') setCurrentDate(addWeeks(currentDate, 1))
        if (viewType === 'day') setCurrentDate(addDays(currentDate, 1))
    }

    // Texto de la cabecera (Ej: "Octubre 2025" o "12 Octubre, 2025")
    const headerDateText = format(
        currentDate, 
        viewType === 'day' ? "d 'de' MMMM" : "MMMM yyyy", 
        { locale: es }
    )

    const handleDayClick = (date: Date) => {
        setSelectedDay(date)
        setIsDayModalOpen(true)
    }

    const filteredBookings = initialBookings.filter(booking => {
        if (selectedStaffId === 'all') return true
        return booking.staff_id === selectedStaffId
    })

    return (
        <div className="space-y-6 mb-10">
            {/* --- BARRA DE HERRAMIENTAS (TOOLBAR) --- */}
            <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 bg-zinc-900 border border-zinc-800 p-4 rounded-2xl shadow-sm stagger-container">
                
                {/* 1. Controles de Fecha */}
                <div className="flex items-center font-unbounded gap-4">
                    <div className="flex items-center bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden">
                        <button onClick={handlePrevious} className="p-2 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer">
                            <ChevronLeft size={20} />
                        </button>
                        <button onClick={goToToday} className="px-4 py-2 text-xs font-bold text-zinc-300 hover:text-white hover:bg-zinc-800 border-x border-zinc-800 transition-colors cursor-pointer">
                            Hoy
                        </button>
                        <button onClick={handleNext} className="p-2 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer">
                            <ChevronRight size={20} />
                        </button>
                    </div>
                    <h2 className="text-md font-bold text-white capitalize w-48">
                        {headerDateText}
                    </h2>
                </div>

                {/* 2. Filtros y Vistas */}
                <div className="flex flex-wrap items-center gap-4 font-unbounded w-full xl:w-auto">
                    
                    {/* Selector de Staff (Solo visible para Admins) */}
                    {isAdmin && initialStaff.length > 0 && (
                        <div className="flex items-center gap-2 bg-zinc-950 border border-zinc-800 px-3 py-2 rounded-xl flex-1 sm:flex-none min-w-[200px] cursor-pointer">
                            <Users size={16} className="text-zinc-500 shrink-0" />
                            <select 
                                value={selectedStaffId}
                                onChange={(e) => setSelectedStaffId(e.target.value)}
                                className="bg-transparent text-xs text-zinc-300 font-medium outline-none w-full cursor-pointer appearance-none"
                            >
                                <option value="all" className="bg-zinc-900">Equipo completo</option>
                                {initialStaff.map(staff => (
                                    <option key={staff.id} value={staff.id} className="bg-zinc-900">
                                        {staff.full_name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    {/* Selector de Vista (Mes / Semana / Día) */}
                    <div className="flex bg-zinc-950 border border-zinc-800 rounded-xl p-1 w-full sm:w-auto">
                        <button 
                            onClick={() => setViewType('month')}
                            className={`flex-1 sm:flex-none px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${viewType === 'month' ? 'bg-yellow-500 text-zinc-950 shadow-md' : 'text-zinc-500 hover:text-zinc-300'} cursor-pointer`}
                        >
                            Mes
                        </button>
                        <button 
                            onClick={() => setViewType('week')}
                            className={`flex-1 sm:flex-none px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${viewType === 'week' ? 'bg-yellow-500 text-zinc-950 shadow-md' : 'text-zinc-500 hover:text-zinc-300'} cursor-pointer`}
                        >
                            Semana
                        </button>
                        <button 
                            onClick={() => setViewType('day')}
                            className={`flex-1 sm:flex-none px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${viewType === 'day' ? 'bg-yellow-500 text-zinc-950 shadow-md' : 'text-zinc-500 hover:text-zinc-300'} cursor-pointer`}
                        >
                            Día
                        </button>
                    </div>
                </div>
            </div>

            {/* --- CONTENEDOR DE LA VISTA ACTIVA --- */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl min-h-[600px] overflow-hidden relative">
                
                {viewType === 'month' && (
                    <div className="p-2 lg:p-4 flex flex-col items-center justify-center text-zinc-500 h-full min-h-[500px]">
                        <MonthView 
                            currentDate={currentDate}
                            selectedStaffId={selectedStaffId}
                            bookings={filteredBookings}
                            onDayClick={handleDayClick}
                        />
                    </div>
                )}

                {viewType === 'week' && (
                    <div className="p-2 lg:p-4 flex flex-col items-center justify-center text-zinc-500 h-full min-h-[500px]">
                        <WeekView 
                            bookings={filteredBookings}
                            currentDate={currentDate}
                            businessHours={businessHours}
                        />
                    </div>
                )}

                {viewType === 'day' && (
                    <div className="p-2 lg:p-4 flex flex-col items-center justify-center text-zinc-500 h-full min-h-[500px]">
                        <DayView 
                            bookings={filteredBookings}
                            businessHours={businessHours}
                            currentDate={currentDate}
                        />
                    </div>
                )}
            </div>

            {
                isDayModalOpen && selectedDay && (
                    <DaySummaryModal 
                        date={selectedDay}
                        bookings={filteredBookings}
                        onClose={() => setIsDayModalOpen(false)}
                    />
                )
            }

        </div>
    )
}