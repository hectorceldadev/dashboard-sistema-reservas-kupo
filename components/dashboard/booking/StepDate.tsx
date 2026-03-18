'use client'

import { DayPicker } from "react-day-picker"
import { format, startOfDay } from "date-fns"
import { es } from "date-fns/locale" 
import "react-day-picker/dist/style.css"
import { cn } from "@/lib/utils"
import { AlertCircle, Clock, Loader2 } from "lucide-react"
import { useRef, useEffect, useState } from "react"
import { Booking } from "./BookingModal"

// IMPORT DE LA SERVER ACTION
import { getBookingAvailabilityAction } from "@/components/dashboard/booking/actions/availability-action"
import { sileo } from "sileo"

interface StepDateProps {
    booking: Booking;
    setBooking: (data: Booking) => void;
}

const StepDate = ({ booking, setBooking }: StepDateProps) => {
    
    const [ slots, setSlots ] = useState<string[]>([])
    const [ isLoading, setIsLoading ] = useState<boolean>(false)
    const [ error, setError ] = useState<string | null>(null)

    const timeSectionRef = useRef<HTMLDivElement>(null);
    
    useEffect(() => {
        const fetchSlots = async () => {
            if (!booking.date || !booking.staff) return

            setIsLoading(true)
            setError(null)
            setSlots([])

            try {
                const dateString = format(booking.date, 'yyyy-MM-dd')
                const staffId = booking.staff.id
                const duration = booking.services.reduce((acc, s) => acc + s.duration, 0)

                // LLAMADA DIRECTA A LA SERVER ACTION (Sin fetch)
                const response = await getBookingAvailabilityAction(dateString, staffId, duration)

                if (response.error) {
                    throw new Error(response.error)
                }

                setSlots(response.slots || [])

                setTimeout(() => {
                    timeSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                }, 100)
            } catch (error: any) {
                console.error(error)
                setError(error.message || 'No pudimos cargar los horarios. Inténtalo de nuevo.')
                sileo.error({
                    title: 'Error al buscar la disponibilidad'
                })
            } finally {
                setIsLoading(false)
            }
        }
        fetchSlots()
    }, [booking.date, booking.staff, booking.services])
    

    const handleDaySelect = (date: Date | undefined) => {
        setBooking({ ...booking, date: date, time: null });
    }

    const handleTimeSelect = (timeSlot: string) => {
        setBooking({ ...booking, time: timeSlot });
    }

    let footer = <p className="mt-4 text-zinc-500 font-bold text-center text-xs font-unbounded">Escoge una fecha</p>

    if (booking.date && !booking.time) {
        footer = <p className="mt-4 text-white font-bold text-center text-xs font-unbounded">Ahora escoge una hora</p>
    } else if (booking.date && booking.time) {
        footer = (
            <p className="mt-4 text-white font-bold text-center text-sm">
                Cita para el <span className="text-yellow-500 capitalize">{format(booking.date, 'EEEE d', { locale: es })}</span> a las <span className="text-yellow-500">{booking.time}</span>
            </p>
        )
    }

    return (
        <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20 stagger-container">
            
            <div className="flex flex-col items-start">
                <h3 className="text-white font-unbounded font-bold text-md">¿Cuándo nos vemos?</h3>
                <p className="text-zinc-400 text-sm">Selecciona el día y la hora de la cita.</p>
            </div>

            <div className="bg-zinc-900 p-2 rounded-xl shadow-lg border border-zinc-800 flex justify-center">
                <DayPicker
                    mode="single"
                    selected={booking.date}
                    onSelect={handleDaySelect}
                    footer={footer}
                    showOutsideDays
                    locale={es} 
                    disabled={{ before: startOfDay(new Date()) }}
                    modifiersClassNames={{
                        selected: 'bg-yellow-500 text-zinc-950 hover:bg-yellow-500/90 font-bold rounded-md', 
                        today: 'text-yellow-500 font-bold ring ring-yellow-500/50 rounded-lg', 
                    }}
                    classNames={{
                        chevron: 'fill-yellow-500',
                        day: "hover:bg-zinc-800 rounded-md transition-colors text-zinc-300",
                        day_disabled: "text-zinc-700 opacity-50 hover:bg-transparent cursor-not-allowed", 
                        month: 'text-white font-bold capitalize',
                        caption: 'flex justify-center pt-1 relative items-center mb-2',
                        button_next: 'text-yellow-500 hover:bg-zinc-800 rounded-md p-1',
                        button_previous: 'text-yellow-500 hover:bg-zinc-800 rounded-md p-1',
                    }}
                />
            </div>

            {booking.date && (
                <div 
                    ref={timeSectionRef} 
                    className="animate-in slide-in-from-top-2 fade-in duration-300 scroll-mt-32"
                >
                    <div className="flex items-center gap-2 mb-3 text-zinc-300">
                        <Clock size={18} className="text-yellow-500" />
                        <span className="font-bold text-xs font-unbounded">Horas disponibles</span>
                    </div>
                    
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-8 gap-2">
                            <Loader2 size={32} className="animate-spin text-yellow-500" />
                            <span className="text-xs text-zinc-500">Buscando huecos libres...</span>
                        </div>
                    ) : error ? (
                        <div className="flex flex-col items-center justify-center py-6 gap-2 text-red-400 bg-red-400/10 rounded-xl border border-red-500/20">
                            <AlertCircle size={24} />
                            <p className="text-sm font-medium">{error}</p>
                        </div>
                    ) : (
                        slots.length > 0 ? (
                            <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                                {slots.map((slot) => {
                                    const isSelected = booking.time === slot;
                                    return (
                                        <button
                                            key={slot}
                                            onClick={() => handleTimeSelect(slot)}
                                            className={cn(
                                                "py-2.5 px-1 rounded-xl text-sm font-bold border transition-all duration-200",
                                                "hover:scale-105 active:scale-95",
                                                isSelected 
                                                    ? "bg-yellow-500 border-yellow-500 text-zinc-950 shadow-lg shadow-yellow-500/20 scale-105" 
                                                    : "bg-zinc-900 border-zinc-800 text-white hover:border-yellow-500/50 hover:bg-zinc-800"
                                            )}
                                        >
                                            {slot}
                                        </button>
                                    )
                                })}
                            </div>
                        ) : (
                            <div className="p-6 bg-zinc-900 border border-dashed border-zinc-700 rounded-xl text-center">
                                <p className="text-sm font-medium text-zinc-400">
                                    No quedan huecos disponibles para este día. <br/> Por favor, prueba otra fecha.
                                </p>
                            </div>
                        )
                    )}
                </div>
            )}
        </div>
    )
}

export default StepDate