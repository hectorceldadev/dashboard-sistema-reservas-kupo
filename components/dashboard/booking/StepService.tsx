'use client';

import { Check, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Booking, Service } from './BookingModal';
import { ServiceDB } from '@/lib/types/databaseTypes';

interface StepServiceProps {
  booking: Booking;
  setBooking: (data: Booking) => void;
  servicesList: ServiceDB[];
  isLoading: boolean;
}

export default function StepService({ booking, setBooking, isLoading, servicesList }: StepServiceProps) {
  
  const handleToggle = (service: Service) => {
    const currentServices = booking.services || [];
    const exists = currentServices.find((s: Service) => s.id === service.id);

    let newServices;
    if (exists) {
      newServices = currentServices.filter((s: Service) => s.id !== service.id);
    } else {
      newServices = [...currentServices, service];
    }
    setBooking({ ...booking, services: newServices });
  };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4 animate-in fade-in duration-500">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-white">Selecciona servicios</h3>
        </div>
        {/* Skeletons */}
        {[1, 2, 3, 4].map((i) => (
          <div 
            key={i} 
            className="w-full p-5 rounded-2xl border border-zinc-800 bg-zinc-900/50 flex items-start gap-4"
          >
            <div className="mt-1 w-5 h-5 rounded-full bg-zinc-800 animate-pulse shrink-0" />
            <div className="flex-1 space-y-3">
              <div className="flex justify-between items-start w-full">
                <div className="h-5 w-3/4 bg-zinc-800 animate-pulse rounded-md" />
                <div className="h-5 w-12 bg-zinc-800 animate-pulse rounded-md" />
              </div>
              <div className="h-3 w-1/2 bg-zinc-800/50 animate-pulse rounded-md" />
              <div className="flex items-center gap-1 pt-1">
                <div className="w-3 h-3 rounded-full bg-zinc-800/50 animate-pulse" />
                <div className="h-3 w-16 bg-zinc-800/50 animate-pulse rounded-md" />
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 fade-in duration-500 pb-4 stagger-container">
      
      {/* CABECERA */}
      <div className="flex items-center justify-between stagger-container">
        <h3 className="text-xl font-bold font-unbounded text-white">
            Selecciona servicios
        </h3>
        <span className={`text-xs font-bold px-3 py-1 ${booking.services.length === 0 ? 'bg-zinc-900 text-zinc-400 border border-zinc-800' : 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/70'} rounded-full `}>
            {booking.services.length} Seleccionados
        </span>
      </div>
      
      {/* GRID DE SERVICIOS */}
      <div className="grid grid-cols-1 gap-3 stagger-container">
        {servicesList.map((service) => {
          const isSelected = booking.services?.some((s: Service) => s.id === service.id);
          
          return (
            <div
              key={service.id}
              onClick={() => handleToggle(service as Service)}
              className={cn(
                "group relative p-5 rounded-2xl border cursor-pointer transition-all duration-200 ease-out",
                isSelected 
                  ? "bg-yellow-500/5 border-yellow-500/50 shadow-[0_0_15px_rgba(234,179,8,0.05)]" 
                  : "bg-zinc-900 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800/50"
              )}
            >
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1 space-y-1.5">
                  <h4 className={cn(
                      "font-bold font-unbounded text-md transition-colors",
                      isSelected ? "text-yellow-500" : "text-white group-hover:text-yellow-500/80"
                  )}>
                    {service.title}
                  </h4>
                  <p className="text-sm text-zinc-500 leading-relaxed line-clamp-2">
                    {service.short_desc}
                  </p>
                  <div className="inline-flex items-center gap-1.5 text-xs font-bold px-2 py-1 mt-2 rounded-md bg-zinc-950 text-zinc-400 border border-zinc-800/50">
                    <Clock size={13} className={isSelected ? "text-yellow-500/70" : ""} />
                    <span>{service.duration} min</span>
                  </div>
                </div>

                <div className="flex flex-col items-end justify-between self-stretch min-h-[5rem]">
                    <span className="text-lg font-bold font-unbounded text-white">
                        {service.price}€
                    </span>
                    <div className={cn(
                        "w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300",
                        isSelected 
                            ? "bg-yellow-500 text-zinc-950 scale-100 opacity-100" 
                            : "border-2 border-zinc-700 text-transparent scale-95"
                    )}>
                        {isSelected && <Check size={14} strokeWidth={4} />}
                    </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}