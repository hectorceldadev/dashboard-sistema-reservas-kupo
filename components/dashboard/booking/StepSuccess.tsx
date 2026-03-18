'use client';

import { Check, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Booking } from './BookingModal';
import Link from 'next/link';

interface StepSuccessProps {
  booking: Booking;
  onClose: () => void;
}

export default function StepSuccess({ booking, onClose }: StepSuccessProps) {

  return (
    <div className="flex flex-col h-full overflow-hidden stagger-container pb-6">
      
      {/* 1. HEADER */}
      <div className="text-center pt-2 pb-2 shrink-0 mb-4">
        <div className="flex justify-center mb-6">
           <div className="h-16 w-16 bg-yellow-500 text-zinc-950 rounded-full flex items-center justify-center shadow-lg shadow-yellow-500/20 animate-in zoom-in duration-300">
             <Check size={30} strokeWidth={3} />
           </div>
        </div>
        <h2 className="text-2xl font-bold font-unbounded text-white leading-none mb-3">Confirmada</h2>
        <p className="text-zinc-400 text-sm px-6">
          La reserva se ha guardado correctamente en la agenda.
        </p>
      </div>

      {/* 2. TICKET RESUMEN */}
      <div className="mx-5 my-auto bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shrink-0 shadow-sm relative overflow-hidden">
        {/* Decoración del ticket (los círculos laterales que hacen efecto troquelado) */}
        <div className="absolute top-1/2 -translate-y-1/2 -left-3 w-6 h-6 bg-zinc-950 rounded-full border-r border-zinc-800" />
        <div className="absolute top-1/2 -translate-y-1/2 -right-3 w-6 h-6 bg-zinc-950 rounded-full border-l border-zinc-800" />

        <div className="flex justify-between items-center pb-5 mb-5 border-b border-dashed border-zinc-700">
           <div className="text-left">
              <p className="text-[11px] text-zinc-500 font-bold font-unbounded mb-1">Fecha</p>
              <p className="font-semibold text-white text-sm capitalize">
                 {booking.date && format(booking.date, 'EEEE d MMM.', { locale: es })}
              </p>
           </div>
           <div className="text-right">
              <p className="text-[11px] text-zinc-500 font-bold font-unbounded mb-1">Hora</p>
              <p className="font-semibold text-white text-sm">{booking.time}</p>
           </div>
        </div>
        
        <div className="flex justify-between items-end gap-4">
            <div className="text-left overflow-hidden flex-1">
               <p className="text-[11px] text-zinc-500 font-bold font-unbounded mb-1">Cliente</p>
               <p className="font-medium text-white text-sm truncate capitalize">
                   {booking.client?.name || 'Sin nombre'}
               </p>
               <p className="text-xs text-zinc-500 truncate mt-0.5">
                   {booking.services[0]?.title} {booking.services.length > 1 && `+ ${booking.services.length - 1}`}
               </p>
            </div>
            <div className="text-right shrink-0">
               <p className="font-bold text-yellow-500 text-xs bg-yellow-500/10 px-3 py-1.5 rounded-md border border-yellow-500/20">
                 {booking.staff?.full_name}
               </p>
            </div>
        </div>
      </div>

      {/* 3. BOTÓN CERRAR */}
      <div className="mt-8 px-5">
        <Link
          href='/dashboard/agenda'
          onClick={onClose}
          className="w-full group bg-yellow-500 text-zinc-950 py-3.5 rounded-xl font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-md text-sm font-unbounded"
        >
          Cerrar e ir a la Agenda
          <ArrowRight className='group-hover:translate-x-1 transition-transform duration-150' size={18} />
        </Link>
      </div>

    </div>
  );
}