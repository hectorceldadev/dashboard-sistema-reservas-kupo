'use client'

import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { Calendar, Clock, User, Scissors, MapPin, Wallet } from 'lucide-react'
import { Booking } from './BookingModal'

interface StepSummaryProps {
  booking: Booking
  setBooking: (booking: Booking) => void
}

export default function StepSummary({ booking }: StepSummaryProps) {

  // Calculamos el total
  const totalDuration = booking.services.reduce((acc, s) => acc + s.duration, 0)
  const totalPrice = booking.services.reduce((acc, s) => acc + s.price, 0)

  // Formateamos fecha para mostrarla bonita
  const formattedDate = booking.date 
    ? format(booking.date, "EEEE d 'de' MMMM", { locale: es }) 
    : ''

    if (!booking.time) return null

    const timeToMins = (time: string) => {
        const [h, m] = time.split(':').map(Number)
        return h * 60 + m
    } 

    const startMins = timeToMins(booking.time)
    const endMins = startMins + totalDuration
    const getEndTime = (endMins: number) => {
        const hours = Math.floor(endMins / 60)
        const minutes = endMins % 60
        return `${hours.toString().length === 1 ? `0${hours}` : hours}:${minutes.toString().padStart(2, '0')}` 
    } 
    const endTime = getEndTime(endMins)

  return (
    <div className="h-full overflow-hidden flex flex-col gap-4 animate-in fade-in slide-in-from-right-8 duration-500 p-8 stagger-container">
      
      <div className="flex flex-col items-start mb-2">
        <h3 className="text-white font-bold text-md font-unbounded">Resumen de la cita</h3>
        <p className="text-zinc-400 text-sm">Revisa los datos antes de confirmar.</p>
      </div>

      {/* Tarjeta de Resumen */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 flex flex-col gap-4 shadow-sm relative overflow-hidden stagger-container">
        

        {/* Cliente */}
        <div className="flex flex-col gap-1 pb-3 border-b border-zinc-800/80">
            <span className="flex items-center gap-1.5 text-xs text-zinc-500 font-bold font-unbounded">
                <User size={14} className="text-yellow-500"/> Cliente
            </span>
            <span className="text-sm font-semibold text-white capitalize">
                {booking.client?.name || 'Sin nombre'}
            </span>
            {booking.client?.phone && (
                <span className="text-sm font-semibold text-white">{booking.client.phone}</span>
            )}
        </div>

        {/* Servicios */}
        <div className="flex flex-col gap-3 pb-3 border-b border-zinc-800/80">
            <div className="flex items-center gap-2 text-zinc-500 font-bold text-xs font-unbounded">
                <Scissors size={14} className="text-yellow-500" />
                <span>Servicios</span>
            </div>
            {booking.services.map((s) => (
                <div key={s.id} className="flex justify-between items-center text-sm">
                    <span className="text-white font-semibold">{s.title}</span>
                    <span className="text-zinc-400 font-bold">{s.price}€</span>
                </div>
            ))}
        </div>

        {/* Detalles Cita */}
        <div className="grid grid-cols-2 gap-4 pb-4 border-b border-zinc-800/80">
            <div className="flex flex-col gap-1">
                <span className="flex items-center gap-1.5 text-xs text-zinc-500 font-bold font-unbounded">
                    <Calendar size={12} className="text-yellow-500" /> Fecha
                </span>
                <span className="text-sm font-semibold capitalize text-white">
                    {formattedDate}
                </span>
            </div>
            <div className="flex flex-col gap-1">
                <span className="flex items-center gap-1.5 text-xs text-zinc-500 font-bold font-unbounded">
                    <Clock size={12} className="text-yellow-500" /> Hora
                </span>
                <span className="text-sm font-semibold text-white">
                    {booking.time} - {endTime}
                </span>
            </div>
            <div className="flex flex-col gap-1 col-span-2">
                <span className="flex items-center gap-1.5 text-xs text-zinc-500 font-bold font-unbounded">
                    <User size={12} className="text-yellow-500" /> Profesional Asignado
                </span>
                <span className="text-sm font-semibold text-white">
                    {booking.staff?.full_name || 'Cualquiera'}
                </span>
            </div>
        </div>

        {/* Método de Pago (Fijo: Local) */}
        <div className="bg-yellow-500/5 rounded-xl p-3 flex items-center justify-between border border-yellow-500/20">
            <div className="flex items-center gap-3">
                <div className="bg-yellow-500 p-2 rounded-lg text-zinc-950 shadow-sm">
                    <MapPin size={18} />
                </div>
                <div className="flex flex-col">
                    <span className="text-xs font-bold font-unbounded text-yellow-500">Pago en el local</span>
                    <span className="text-xs text-yellow-500/70">La cita quedará confirmada</span>
                </div>
            </div>
            <div className="text-yellow-500">
                <Wallet size={18} />
            </div>
        </div>

        {/* Total Final */}
        <div className="flex justify-between items-center pt-2">
            <span className="text-lg font-bold text-white font-unbounded">Total</span>
            <span className="text-xl font-bold text-yellow-500">{totalPrice}€</span>
        </div>

      </div>
    </div>
  )
}