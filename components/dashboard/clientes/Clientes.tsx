'use client'

import { useState, useEffect, useMemo } from 'react'
import { Search, Plus, MoreHorizontal, Mail, Phone, User, Calendar, Scissors, Clock, X, CreditCard, AlertTriangle, Loader, LoaderCircle } from 'lucide-react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { getCustomerData } from '@/app/dashboard/clientes/actions'
import { formatInTimeZone } from 'date-fns-tz'
import BookingDetailsModal from './BookingDetailModal'
import { cancelBookingAction } from '@/app/dashboard/agenda/actions'
import { sileo } from 'sileo'

// --- TIPOS DE DATOS ---
export type Customer = {
    id: string
    full_name: string
    email?: string | null
    phone?: string | null
    created_at: string
}

const TIMEZONE = 'Europe/Madrid'

// Helper para iniciales
const getInitials = (name?: string) => {
    if (!name) return 'CL'
    const parts = name.trim().split(' ')
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase()
    return name.substring(0, 2).toUpperCase()
}

// Helper para extraer nombre del servicio de la reserva de forma segura
const getServiceName = (booking: any) => {
    if (!booking.booking_items || !Array.isArray(booking.booking_items) || booking.booking_items.length === 0) return 'Servicio'
    const service = booking.booking_items[0]
    return service?.service_name || 'Servicio'
}

// --- COMPONENTE PRINCIPAL ---
export function Clientes({ customers }: { customers: Customer[] }) {
    const [searchTerm, setSearchTerm] = useState('')

    // Estados para los modales
    const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null)
    const [bookings, setBookings] = useState<any[] | null>(null)
    const [activeCustomer, setActiveCustomer] = useState<Customer | null>(null)
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const [selectedBooking, setSelectedBooking] = useState<any | null>(null)


    // ==========================================
    // BLOQUEAR SCROLL CUANDO HAY MODALES
    // ==========================================
    useEffect(() => {
        if (selectedCustomerId) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = ''
        }
        return () => { document.body.style.overflow = '' }
    }, [selectedCustomerId])

    useEffect(() => {

        const fecthData = async () => {
            if (!selectedCustomerId) {
                setActiveCustomer(null)
                setBookings(null)
                return
            }

            setIsLoading(true)

            const response = await getCustomerData(selectedCustomerId)
            if (response.activeCustomer && response.bookings) {
                setBookings(response.bookings)
                setActiveCustomer(response.activeCustomer)
            }

            setIsLoading(false)
        }

        fecthData()

    }, [selectedCustomerId])

    const citas = bookings ? bookings.filter(b => b.status !== 'cancelled').length : 0
    const citasCanceladas = bookings ? bookings.filter(b => b.status === 'cancelled').length : 0
    const ingresos = bookings ? bookings.filter(b => b.status === 'completed').reduce((acc, b) => acc + b.total_price, 0) : 0

    const filteredCustomers = customers.filter(customer =>
        customer.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.phone?.includes(searchTerm)
    )

    return (
        <div className="space-y-8 animate-fade-in pb-10 stagger-container">

            {/* HEADER & ACTIONS */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Directorio de Clientes</h1>
                    <p className="text-zinc-400 mt-1 text-sm sm:text-base">Gestiona tu base de datos y fideliza a tus clientes.</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                    <div className="relative group flex-1 sm:min-w-[320px]">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-yellow-500 transition-colors" />
                        <input
                            type="text"
                            placeholder="Buscar por nombre, email o teléfono..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-11 pr-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-sm text-white focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 outline-none transition-all placeholder:text-zinc-500 shadow-sm"
                        />
                    </div>
                </div>
            </div>
            <div className='h-[1px] w-full bg-zinc-700/30 rounded-full'></div>


            {/* CONTENEDOR PRINCIPAL */}
            {filteredCustomers.length === 0 ? (
                <div className="bg-zinc-900/50 border border-dashed border-zinc-800 rounded-3xl p-12 text-center flex flex-col items-center justify-center">
                    <div className="w-16 h-16 bg-zinc-950 rounded-full flex items-center justify-center mb-4 border border-zinc-800">
                        <User size={32} className="text-zinc-600" />
                    </div>
                    <p className="font-bold text-zinc-300 text-lg">No se encontraron clientes</p>
                    <p className="text-zinc-500 text-sm mt-1">Prueba con otra búsqueda o añade un cliente nuevo.</p>
                </div>
            ) : (
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-xl shadow-black/20">

                    {/* --- VISTA MÓVIL (Tarjetas) --- */}
                    <div className="block lg:hidden divide-y divide-zinc-800/50 stagger-container">
                        {filteredCustomers.map((customer) => (
                            <div
                                key={customer.id}
                                onClick={() => setSelectedCustomerId(customer.id)}
                                className="p-5 hover:bg-zinc-800/30 transition-colors cursor-pointer active:bg-zinc-800/50"
                            >
                                <div className="flex items-center gap-4 mb-3">
                                    <div className="w-12 h-12 rounded-full bg-zinc-950 border border-zinc-700 flex items-center justify-center font-bold text-yellow-500 shrink-0 shadow-inner">
                                        {getInitials(customer.full_name)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="font-bold text-white text-base truncate">{customer.full_name}</div>
                                        <div className="text-zinc-500 text-[10px] font-mono mt-0.5">ID: {customer.id.slice(0, 8)}</div>
                                    </div>
                                </div>

                                <div className="flex flex-col items-start gap-3 text-sm bg-zinc-950/50 p-3.5 rounded-lg border border-zinc-800/50">
                                    <div className="flex flex-col gap-1.5 text-zinc-400 min-w-0">
                                        {customer.phone && <span className="flex items-center gap-2 truncate text-xs"><Phone size={14} className="text-zinc-500 shrink-0" /> <span className="truncate">{customer.phone}</span></span>}
                                        {customer.email && <span className="flex items-center gap-2 truncate text-xs"><Mail size={14} className="text-zinc-500 shrink-0" /> <span className="truncate">{customer.email}</span></span>}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* --- VISTA ESCRITORIO (Tabla Clásica) --- */}
                    <div className="hidden lg:block overflow-x-auto">
                        <table className="w-full text-left border-collapse whitespace-nowrap">
                            <thead>
                                <tr className="border-b border-zinc-800 bg-zinc-950/50 text-[12px] font-bold text-yellow-500 uppercase tracking-wider stagger-container">
                                    <th className="px-6 py-4 rounded-tl-2xl">Cliente</th>
                                    <th className="px-6 py-4">Teléfono</th>
                                    <th className="pr-30 py-4 text-center">Email</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-800/50 text-sm stagger-container">
                                {filteredCustomers.map((customer) => (
                                    <tr
                                        key={customer.id}
                                        onClick={() => setSelectedCustomerId(customer.id)}
                                        className="group hover:bg-zinc-800/30 transition-colors cursor-pointer"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-full bg-zinc-950 border border-zinc-700 group-hover:border-yellow-500/50 flex items-center justify-center font-bold text-yellow-500 shrink-0 transition-colors shadow-inner text-xs">
                                                    {getInitials(customer.full_name)}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-zinc-200 group-hover:text-yellow-500 transition-colors">{customer.full_name}</div>
                                                    <div className="text-zinc-600 text-[10px] font-mono mt-0.5">ID: {customer.id.slice(0, 8)}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-1.5 text-zinc-400 text-sm group-hover:text-yellow-500">
                                                {customer.phone && <div className="flex items-center gap-2"><Phone size={14} className="text-zinc-500" /> <span>{customer.phone}</span></div>}

                                            </div>
                                        </td>
                                        <td className="pl-26 py-4 text-center">
                                            <span className="flex flex-col gap-1.5 text-zinc-400 text-sm group-hover:text-yellow-500">
                                                {customer.email && <div className="flex items-center gap-2"><Mail size={14} className="text-zinc-500" /> <span>{customer.email}</span></div>}
                                            </span>
                                        </td>

                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* ========================================================= */}
            {/* MODAL 1: FICHA DEL CLIENTE (CRM)                            */}
            {/* ========================================================= */}
            {selectedCustomerId && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setSelectedCustomerId(null)} />

                    <div className="bg-zinc-950 border border-zinc-800 w-full max-w-md rounded-[2rem] shadow-2xl relative z-10 flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-300">

                        {/* Cabecera */}
                        {/* Cabecera */}
                        <div className="relative px-6 py-4 border-b border-zinc-800 overflow-hidden shrink-0">
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-yellow-500/5 blur-3xl pointer-events-none" />

                            <button onClick={() => setSelectedCustomerId(null)} className="absolute top-4 right-4 p-2 bg-zinc-900 border border-zinc-800 rounded-full text-zinc-400 hover:text-white transition-colors z-20 cursor-pointer">
                                <X size={16} />
                            </button>

                            <div className="flex flex-col items-center gap-4 relative z-10 text-center">
                                <div className="w-16 h-16 rounded-full bg-zinc-900 border border-zinc-700 flex items-center justify-center font-black text-xl text-yellow-500 shadow-inner">
                                    {getInitials(activeCustomer?.full_name)}
                                </div>
                                
                                <div className="w-full flex flex-col items-center">
                                    {/* SKELETON O NOMBRE */}
                                    {isLoading ? (
                                        <div className="h-7 w-48 bg-zinc-800 rounded-md animate-pulse"></div>
                                    ) : (
                                        <h2 className="text-xl font-bold text-white leading-tight">{activeCustomer?.full_name}</h2>
                                    )}

                                    <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mt-1"></p>
                                    
                                    {/* SKELETON O EMAIL/TELÉFONO */}
                                    {isLoading ? (
                                        <div className="flex justify-center flex-col items-center lg:flex-row gap-3 mt-3">
                                            <div className="h-4 w-40 bg-zinc-800 rounded-md animate-pulse"></div>
                                            <div className="h-4 w-28 bg-zinc-800 rounded-md animate-pulse"></div>
                                        </div>
                                    ) : (
                                        <div className="flex justify-center flex-col items-center lg:flex-row gap-3 text-xs text-zinc-400 mt-3">
                                            {activeCustomer?.email && (
                                                <span className="flex items-center gap-1.5"><Mail size={14} className="text-zinc-500" /> {activeCustomer.email}</span>
                                            )}
                                            {activeCustomer?.phone && (
                                                <span className="flex items-center gap-1.5"><Phone size={14} className="text-zinc-500" /> {activeCustomer.phone}</span>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Body scrollable */}
                        <div className="overflow-y-auto custom-scrollbar flex-1 bg-zinc-900/40 p-6 space-y-8 relative">

                            {/* Estadísticas */}
                            <div>
                                <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-3">Rendimiento</h4>
                                <div className="grid grid-cols-3 gap-3">
                                    <div className="bg-yellow-500/10 border border-yellow-800 p-3 rounded-2xl flex flex-col items-center justify-center text-center">
                                        <span className="text-yellow-500/80 text-[10px] font-bold uppercase mb-1">Citas</span>
                                        <span className={`text-xl font-black text-yellow-500 ${isLoading && 'animate-spin'}`}>{isLoading ? <LoaderCircle size={16} /> : citas}</span>
                                    </div>
                                    <div className="bg-red-500/10 border border-red-800 p-3 rounded-2xl flex flex-col items-center justify-center text-center">
                                        <span className="text-red-500 text-[10px] font-bold uppercase mb-1">Anuladas</span>
                                        <span className={`text-xl font-black text-red-500 ${isLoading && 'animate-spin'}`}>{isLoading ? <LoaderCircle size={16} /> : citasCanceladas}</span>
                                    </div>
                                    <div className="bg-emerald-500/10 border border-emerald-500/20 p-3 rounded-2xl flex flex-col items-center justify-center text-center relative overflow-hidden">
                                        <span className="text-emerald-500/80 text-[10px] font-bold uppercase mb-1 relative z-10">Ingresos</span>
                                        <span className={`text-xl font-black text-emerald-500 relative z-10 ${isLoading && 'animate-spin'}`}>{isLoading ? <LoaderCircle size={16} /> : `${ingresos}€`}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Historial de Citas */}
                            <div>
                                <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-3">Historial de Reservas</h4>

                                {isLoading ? (
                                    /* SKELETON DE LOS TICKETS DE RESERVA */
                                    <div className="space-y-3">
                                        {[1].map((i) => (
                                            <div key={`skeleton-booking-${i}`} className="w-full relative bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden flex text-left shadow-sm">
                                                {/* Lado izquierdo (Fecha y Hora) */}
                                                <div className="w-20 shrink-0 flex flex-col items-center justify-center py-4 border-r border-dashed border-zinc-800 bg-zinc-950/50">
                                                    <div className="h-2.5 w-10 bg-zinc-800 rounded mb-1.5 animate-pulse" />
                                                    <div className="h-4 w-12 bg-zinc-800 rounded animate-pulse" />
                                                </div>
                                                {/* Lado derecho (Servicio, Precio, Empleado) */}
                                                <div className="flex-1 p-3 flex flex-col justify-center">
                                                    <div className="flex justify-between items-start mb-2 gap-2">
                                                        <div className="h-4 w-32 bg-zinc-800 rounded animate-pulse" />
                                                        <div className="h-4 w-10 bg-zinc-800 rounded animate-pulse" />
                                                    </div>
                                                    <div className="flex items-center justify-between mt-1">
                                                        <div className="h-3 w-20 bg-zinc-800 rounded animate-pulse" />
                                                        <div className="h-4 w-16 bg-zinc-800 rounded animate-pulse" />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : bookings?.length === 0 ? (
                                    <div className="text-center p-6 border border-dashed border-zinc-800 rounded-2xl text-zinc-500 text-sm">
                                        Este cliente aún no tiene citas.
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {bookings?.map((booking: any) => {
                                            const serviceName = getServiceName(booking)
                                            const time = formatInTimeZone(new Date(booking.start_time), TIMEZONE, 'HH:mm')

                                            return (
                                                <button
                                                    key={booking.id}
                                                    onClick={() => setSelectedBooking(booking)}
                                                    className="w-full group relative bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden flex text-left transition-all hover:border-yellow-500/50 shadow-sm hover:shadow-md focus:outline-none focus:ring-1 focus:ring-yellow-500 cursor-pointer"
                                                >
                                                    <div className="w-20 shrink-0 flex flex-col items-center justify-center py-3 border-r border-dashed border-zinc-800 bg-zinc-950/50 relative">
                                                        <div className={`absolute left-0 top-0 bottom-0 w-1 ${booking.status === 'completed' ? 'bg-emerald-500' : booking.status === 'cancelled' ? 'bg-red-500' : 'bg-yellow-500'}`} />
                                                        <span className="text-[10px] font-bold text-zinc-500 mb-0.5 capitalize">{format(new Date(booking.date), "d MMM", { locale: es })}</span>
                                                        <span className="text-sm font-black text-white">{time}</span>
                                                    </div>
                                                    <div className="flex-1 p-3 flex flex-col justify-center min-w-0">
                                                        <div className="flex justify-between items-start mb-1.5 gap-2">
                                                            <h5 className="font-bold text-sm text-zinc-100 group-hover:text-yellow-500 transition-colors truncate">
                                                                {serviceName}
                                                            </h5>
                                                            <span className="font-bold text-white text-sm shrink-0">{booking.total_price}€</span>
                                                        </div>
                                                        <div className="flex items-center justify-between text-[10px] font-medium">
                                                            <span className="flex items-center gap-1 text-zinc-400 truncate">
                                                                <User size={10} className="shrink-0" /> <span className="truncate">{booking.staff?.full_name || 'Staff'}</span>
                                                            </span>
                                                            <span className={`px-1.5 py-0.5 rounded border shrink-0 ml-2 ${booking.status === 'completed' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
                                                                    booking.status === 'cancelled' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                                                                        'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
                                                                }`}>
                                                                {booking.status === 'completed' ? 'Completada' : booking.status === 'cancelled' ? 'Cancelada' : 'Pendiente'}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </button>
                                            )
                                        })}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
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

