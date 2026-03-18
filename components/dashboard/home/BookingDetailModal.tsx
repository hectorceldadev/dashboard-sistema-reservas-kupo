'use client'

import { formatInTimeZone } from 'date-fns-tz'
import { es } from 'date-fns/locale'
import { X, Calendar, User, Scissors, AlertTriangle, Clock, CreditCard, Loader, Phone } from 'lucide-react'
import Image from 'next/image'
import { useEffect } from 'react'

interface BookingDetailsModalProps {
    booking: any
    onClose: () => void
    onCancel: (id: string) => void
    isLoading: boolean
}

const TIMEZONE = 'Europe/Madrid'

export default function BookingDetailsModal({ booking, onClose, onCancel, isLoading }: BookingDetailsModalProps) {
    const isCancellable = booking.status !== 'cancelled' && booking.status !== 'completed'

    const statusConfig: Record<string, { label: string, color: string }> = {
        confirmed: { label: 'Confirmada', color: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' },
        pending_payment: { label: 'Pendiente de Pago', color: 'bg-orange-500/10 text-orange-500 border-orange-500/20' },
        cancelled: { label: 'Cancelada', color: 'bg-red-500/10 text-red-500 border-red-500/20' },
        completed: { label: 'Completada', color: 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20' }
    }

    const currentStatus = statusConfig[booking.status] || { label: booking.status, color: 'bg-zinc-800 text-zinc-400 border-zinc-700' }

    // Calcular totales de forma segura
    const itemsList = Array.isArray(booking.booking_items) ? booking.booking_items : []

    // Usamos el total_price de la reserva principal si existe, si no, sumamos los items
    const totalPrice = booking.total_price || itemsList.reduce((acc: number, item: any) => acc + (item.price || 0), 0)

    // Formatear la hora
    const formattedTime = booking.start_time
        ? formatInTimeZone(booking.start_time, TIMEZONE, 'HH:mm')
        : '--:--'
    const formattedEndTime = booking.end_time
        ? formatInTimeZone(booking.end_time, TIMEZONE, 'HH:mm')
        : '--:--'

    useEffect(() => {
        document.body.style.overflow = 'hidden'
        return () => {
            document.body.style.overflow = 'unset'
        }
    }, [])

    // Intentar parsear la fecha de forma segura
    let dateObj = new Date()
    try {
        if (booking.start_time) {
            dateObj = new Date(booking.start_time)
        } else if (booking.date) {
            dateObj = new Date(`${booking.date}T00:00:00`)
        }
    } catch (e) {
        console.error("Error parseando fecha", e)
        dateObj = new Date()
    }

    return (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 stagger-container">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity" onClick={onClose} />

            {/* Contenedor Modal */}
            <div className="bg-zinc-900 border border-zinc-800 w-full max-w-sm rounded-[2rem] shadow-2xl relative z-10 overflow-hidden flex flex-col max-h-[90vh] stagger-container">

                {/* Header Modal (Centrado en el cliente) */}
                <div className="py-4 px-6 relative flex flex-col items-center justify-center shrink-0 border-b border-zinc-800 bg-zinc-950/50">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-yellow-500/5 blur-2xl pointer-events-none" />

                    <div className="w-10 h-10 bg-zinc-900 border border-zinc-800 rounded-full flex items-center justify-center shadow-inner z-10 text-yellow-500 mb-4">
                        <User size={22} />
                    </div>

                    <div className="text-center z-10 space-y-2">
                        <h2 className="font-bold text-md font-unbounded text-white leading-tight">{booking.customer_name}</h2>
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold border font-unbounded tracking-wider ${currentStatus.color}`}>
                            {currentStatus.label}
                        </span>
                    </div>

                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2.5 bg-zinc-900 border border-zinc-800 rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors z-20 cursor-pointer"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Body (Scrollable) */}
                <div className="p-6 overflow-y-auto custom-scrollbar space-y-4">

                    <div className="flex justify-between items-center text-xs text-zinc-500 font-mono bg-zinc-950/50 px-3 py-2 rounded-lg border border-zinc-800/50">
                        <span className='flex items-center gap-2'><Phone size={10}/> {booking.customer_phone}</span>
                        <span>{formatInTimeZone(dateObj, TIMEZONE, 'dd/MM/yyyy')}</span>
                    </div>

                    <div className="space-y-4">
                        {/* Fecha y Hora */}
                        <div className="flex items-start gap-4 p-4 bg-zinc-950 border border-zinc-800/80 rounded-2xl">
                            <div className="mt-0.5 w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center shrink-0">
                                <Calendar size={16} className="text-yellow-500" />
                            </div>
                            <div>
                                <p className="text-xs text-zinc-500 font-bold font-unbounded mb-0.5">Cuándo</p>
                                <p className="font-bold font-unbounded text-sm text-zinc-200 capitalize">
                                    {formatInTimeZone(dateObj, TIMEZONE, 'EEEE d MMMM, yyyy', { locale: es })}
                                </p>
                                <p className="text-sm text-zinc-400 mt-0.5 flex items-center gap-1.5">
                                    <Clock size={12} /> {formattedTime} - {formattedEndTime}
                                </p>
                            </div>
                        </div>

                        {/* Staff */}
                        <div className="flex items-start gap-4 p-4 bg-zinc-950 border border-zinc-800/80 rounded-2xl">
                            <div className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center shrink-0 relative overflow-hidden">
                                {booking.staff?.avatar_url ? (
                                    <Image
                                        src={booking.staff.avatar_url}
                                        alt={booking.staff?.full_name || 'Staff'}
                                        fill
                                        // 2. Cambiamos a 'object-cover' para que llene el círculo
                                        className='w-full h-full object-cover'
                                    />
                                ) : (
                                    // Fallback por si el staff no tiene foto de perfil
                                    <User size={16} className="text-yellow-500" />
                                )}
                            </div>
                            <div>
                                <p className="text-xs text-zinc-500 font-bold font-unbounded mb-0.5">Profesional</p>
                                <p className="font-bold text-sm font-unbounded text-zinc-200">
                                    {booking.staff?.full_name || 'Staff asignado'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* LISTA DE SERVICIOS */}
                    <div className="p-5 bg-zinc-950 border border-zinc-800/80 rounded-2xl">
                        <div className="flex items-center gap-2 mb-4">
                            <Scissors size={16} className="text-zinc-500" />
                            <p className="text-xs text-zinc-400 font-bold font-unbounded">Servicios Contratados</p>
                        </div>

                        <div className="space-y-3">
                            {itemsList.map((item: any, idx: number) => (
                                <div key={idx} className="flex justify-between items-center text-sm border-b border-zinc-800/50 last:border-0 pb-3 last:pb-0">
                                    <div>
                                        <p className="font-bold font-unbounded text-sm text-zinc-200">{item.service_name || 'Servicio'}</p>
                                        <p className="text-xs text-zinc-500">{item.duration} min</p>
                                    </div>
                                    <p className="font-bold text-white">{item.price}€</p>
                                </div>
                            ))}
                        </div>

                        <div className="flex justify-between items-center mt-4 pt-4 border-t border-zinc-800">
                            <p className="font-bold text-zinc-400 text-sm flex font-unbounded items-center gap-1.5">
                                <CreditCard size={16} /> Total a pagar
                            </p>
                            <p className="font-black text-lg text-yellow-500">{totalPrice}€</p>
                        </div>
                    </div>
                </div>

                {/* Botón Cancelar (Fijado abajo) */}
                <div className="p-4 border-t border-zinc-800 bg-zinc-900 shrink-0">

                    {isCancellable ? (
                        <button
                            onClick={() => onCancel(booking.id)}
                            disabled={isLoading}
                            className={`
                                w-full py-3.5 rounded-xl font-bold transition-all font-unbounded text-sm flex items-center justify-center gap-2 cursor-pointer
                                ${isLoading
                                    ? 'bg-red-500/5 text-red-500/50 border border-red-500/10 cursor-not-allowed'
                                    : 'text-red-500 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30'
                                }
                            `}
                        >
                            {isLoading ? (
                                <>
                                    <Loader size={16} className="animate-spin" />
                                    <span>Cancelando...</span>
                                </>
                            ) : (
                                <>
                                    <AlertTriangle size={16} />
                                    <span>Cancelar Reserva</span>
                                </>
                            )}
                        </button>
                    ) : (
                        <button
                            onClick={onClose}
                            className="w-full py-3.5 rounded-xl font-bold text-zinc-900 bg-white hover:bg-zinc-200 transition-colors cursor-pointer"
                        >
                            Cerrar
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}