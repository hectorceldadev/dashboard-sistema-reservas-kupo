'use client'

import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { X, User, Scissors, ArrowRight, Calendar, Clock, Plus } from 'lucide-react'
import { useState, useEffect } from 'react' // Añadido useEffect
import { createPortal } from 'react-dom' // Añadido createPortal
import BookingDetailsModal from './BookingDetailModal'
import { formatInTimeZone } from 'date-fns-tz'
import { cancelBookingAction } from '@/app/dashboard/agenda/actions'
import { sileo } from 'sileo'
import { useAdminBooking } from '@/context/AdminBookingContext'

interface DaySummaryModalProps {
    date: Date
    bookings: any[]
    onClose: () => void
}

const TIMEZONE = 'Europe/Madrid'

export default function DaySummaryModal({ date, bookings, onClose }: DaySummaryModalProps) {

    const [ selectedBooking, setSelectedBooking ] = useState<any>(null)
    const [ isLoading, setIsLoading ] = useState<boolean>(false)
    const [ mounted, setMounted ] = useState(false) // Nuevo estado para el portal
    
    const { openModal } = useAdminBooking()

    // Configuración del Portal: Solo en el cliente y bloqueando scroll
    useEffect(() => {
        setMounted(true)
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'unset';
        }
    }, [])

    // Filtrar citas solo para este día y ordenarlas por hora
    const dateString = format(date, 'yyyy-MM-dd')
    const dayBookings = bookings
        .filter(b => b.date === dateString)
        .sort((a, b) => a.start_time.localeCompare(b.start_time))

    // Si no estamos en el navegador aún, no renderizamos el portal
    if (!mounted) return null

    // Guardamos todo tu diseño en una variable
    const modalContent = (
        <div className="fixed inset-0 z-[8998] flex items-center justify-center p-4 sm:p-6 stagger-container">
            {/* Backdrop oscuro */}
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity" onClick={onClose} />
            
            {/* Contenedor Modal - Añadida animación de entrada */}
            <div className="bg-zinc-900 border border-zinc-800 w-full max-w-lg rounded-3xl shadow-2xl relative z-10 flex flex-col max-h-[85vh] overflow-hidden duration-200 stagger-container">
                
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-zinc-800 bg-zinc-950/80 shrink-0 relative overflow-hidden">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-yellow-500/5 blur-2xl pointer-events-none" />
                    <div className="relative z-10">
                        <h3 className="text-md font-bold font-unbounded text-white capitalize leading-none mb-1.5">
                            {format(date, "EEEE, d 'de' MMMM", { locale: es })}
                        </h3>
                        <p className="text-sm font-medium text-zinc-400 flex items-center gap-1.5">
                            {dayBookings.length > 0 && <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />}
                            {dayBookings.length} {dayBookings.length === 1 ? 'cita' : 'citas'} hoy
                        </p>
                    </div>
                    <button 
                        onClick={onClose} 
                        className="relative z-10 p-2.5 bg-zinc-800/50 rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Lista de Citas (Scrollable) */}
                <div className="p-6 overflow-y-auto custom-scrollbar flex-1 bg-zinc-950/50">
                    
                    {dayBookings.length === 0 ? (
                        <div className="flex flex-col items-center justify-center text-center py-10 px-4 bg-zinc-900/50 border border-dashed border-zinc-800 rounded-3xl">
                            <div className="w-14 h-14 bg-zinc-950 rounded-full flex items-center justify-center mb-4 border border-zinc-800/80 shadow-sm">
                                <Calendar className="text-zinc-600" size={28} />
                            </div>
                            <h4 className="text-zinc-300 font-bold font-unbounded text-md mb-1">Agenda libre</h4>
                            <p className="text-zinc-500 text-sm max-w-[250px]">No hay ninguna cita programada para este día.</p>
                            <button 
                                onClick={openModal}
                                className="group flex items-center font-unbounded text-sm mt-4 gap-2 bg-yellow-500 text-zinc-950 px-6 py-2.5 rounded-xl font-bold shadow-[0_0_20px_rgba(234,179,8,0.15)] hover:shadow-[0_0_25px_rgba(234,179,8,0.3)] hover:bg-yellow-400 hover:-translate-y-0.5 transition-all duration-200 active:scale-95 cursor-pointer"
                            >
                                <Plus size={18} strokeWidth={3} className="group-hover:rotate-90 transition-transform duration-300" />
                                Nueva cita
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {dayBookings.map((booking) => {
                                const itemsList = Array.isArray(booking.booking_items) ? booking.booking_items : []
                                const firstServiceTitle = itemsList[0]?.service_name || 'Servicio'
                                const extraServicesCount = itemsList.length > 1 ? itemsList.length - 1 : 0
                                
                                const formattedTime = booking.start_time 
                                    ? formatInTimeZone(booking.start_time, TIMEZONE, 'HH:mm') 
                                    : '--:--' 
                                const formattedEndTime = booking.end_time 
                                    ? formatInTimeZone(booking.end_time, TIMEZONE, 'HH:mm') 
                                    : '--:--'

                                return (
                                    <button 
                                        key={booking.id}
                                        onClick={() => setSelectedBooking(booking)}
                                        className="w-full group relative bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden flex text-left transition-all duration-300 ease-out cursor-pointer hover:border-yellow-500/50 shadow-sm hover:shadow-lg hover:-translate-y-0.5"
                                    >
                                        {/* Lado Izquierdo (Hora) */}
                                        <div className="w-20 shrink-0 flex flex-col items-center justify-center gap-0.5 py-4 border-r border-dashed border-zinc-800 bg-zinc-950/50 relative">
                                            <div className={`absolute left-0 top-0 bottom-0 w-1 bg-yellow-500`} />
                                            <span className="text-lg font-black text-white leading-none group-hover:text-yellow-500 transition-colors">
                                                {formattedTime}
                                            </span>
                                            <span className="text-[10px] font-bold text-zinc-500 uppercase mt-1">Hora</span>
                                        </div>

                                        {/* Lado Derecho (Info) */}
                                        <div className="flex-1 p-4 flex flex-col justify-center min-w-0 bg-zinc-900">
                                            
                                            <div className="flex justify-between items-start mb-1.5 gap-2">
                                                <h3 className="font-bold font-unbounded text-sm md:text-md text-zinc-100 leading-tight truncate group-hover:text-white transition-colors">
                                                    {booking.customer_name}
                                                </h3>
                                                
                                                {booking.status === 'pending_payment' ? (
                                                    <span className="shrink-0 text-[10px] font-bold bg-orange-500/10 text-orange-500 px-1.5 py-0.5 rounded-md border border-orange-500/20">
                                                        Debe {booking.total_price}€
                                                    </span>
                                                ) : extraServicesCount > 0 ? (
                                                    <span className="shrink-0 text-[10px] font-bold bg-yellow-500/10 text-yellow-500 px-1.5 py-0.5 rounded-md border border-yellow-500/20">
                                                        Pack
                                                    </span>
                                                ) : null}
                                            </div>

                                            <div className="flex items-center gap-3 text-xs text-zinc-400 mb-3">
                                                <span className="flex items-center gap-1 truncate">
                                                    <Scissors size={12} className="text-zinc-600" />
                                                    <span className="truncate">{firstServiceTitle}</span>
                                                    {extraServicesCount > 0 && (
                                                        <span className="text-[9px] font-bold bg-zinc-800 text-zinc-300 px-1.5 py-0.5 rounded-md ml-0.5">
                                                            +{extraServicesCount}
                                                        </span>
                                                    )}
                                                </span>
                                                <span className="flex items-center gap-1 shrink-0 border-l border-zinc-800 pl-3">
                                                    <User size={12} className="text-zinc-600" />
                                                    <span className="truncate">{booking.staff?.full_name || 'Staff'}</span>
                                                </span>
                                            </div>

                                            {/* Bottom Info & Action */}
                                            <div className="flex items-center justify-between mt-auto pt-3 border-t border-zinc-800/60 w-full">
                                                <div className="flex items-center gap-1 text-[12px] text-zinc-500 font-medium">
                                                    <Clock width={14} />{formattedTime} - {formattedEndTime}
                                                </div>
                                                <span className="text-[10px] font-bold text-yellow-500 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                                                    Ver Detalles <ArrowRight size={10} />
                                                </span>
                                            </div>

                                        </div>
                                    </button>
                                )
                            })}
                            <div className='flex justify-center items-center'>
                                <button 
                                    onClick={openModal}
                                    className="group flex items-center font-unbounded text-sm gap-2 mt-4 bg-yellow-500 text-zinc-950 px-6 py-2.5 rounded-xl font-bold shadow-[0_0_20px_rgba(234,179,8,0.15)] hover:shadow-[0_0_25px_rgba(234,179,8,0.3)] hover:bg-yellow-400 hover:-translate-y-0.5 transition-all duration-200 active:scale-95 cursor-pointer"
                                >
                                    <Plus size={18} strokeWidth={3} className="group-hover:rotate-90 transition-transform duration-300" />
                                    Nueva cita
                                </button>
                            </div>
                        </div>
                    )}
                    {
                        selectedBooking && 
                            <BookingDetailsModal 
                                booking={selectedBooking}
                                onClose={() => setSelectedBooking(null)}
                                isLoading={isLoading}
                                onCancel={async (id) => {
                                    setIsLoading(true)
                                    const result = await cancelBookingAction(id)

                                    if (result.error) {
                                        setIsLoading(false)
                                        sileo.error({
                                            title: 'Error al cancelar la reserva.',
                                            description: result.error
                                        })
                                    } else if (result.warning) {
                                        setIsLoading(false)
                                        sileo.warning({
                                            title: 'Reserva cancelada.',
                                            description: result.warning
                                        })
                                    } else if (result.success) {
                                        setIsLoading(false)
                                        sileo.success({
                                            title: 'Reserva cancelada con éxito.',
                                            description: 'El cliente recibirá un correo con la cancelación.'
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
                    }
                </div>
            </div>
        </div>
    )

    // Aquí enviamos el HTML al final de la página web
    return createPortal(modalContent, document.body)
}