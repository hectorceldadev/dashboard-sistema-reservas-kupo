'use client';

import { Users, Check, Sparkles, Loader2, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { Booking, Profile } from './BookingModal';

interface StepStaffProps {
  booking: Booking;
  setBooking: (data: Booking) => void;
  staffList: Profile[];
  isLoading: boolean;
}

const ROLE_MAP: Record<string, string> = {
  admin: 'Gerente / Top Barber',
  worker: 'Estilista Profesional',
  any: 'Primer hueco libre'
};

export default function StepStaff({ booking, setBooking, staffList, isLoading }: StepStaffProps) {
  
  const handleSelect = (member: Profile) => {
    setBooking({ ...booking, staff: member });
  };

  if (isLoading) {
    return (
        <div className="flex justify-center p-8">
            <Loader2 className='animate-spin text-zinc-500'/>
        </div>
    )
  }

  return (
    <div className="space-y-6 animate-in slide-in-from-right-8 fade-in duration-500 pb-4 stagger-container">
      
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-white">
            Escoge un profesional
        </h3>
      </div>

      <div className="grid grid-cols-2 gap-4 stagger-container">
        {staffList.map((member: Profile) => {
          const isSelected = booking.staff?.id === member.id;
          const isAny = member.id === 'any';

          return (
            <button
              key={member.id}
              onClick={() => handleSelect(member)}
              className={cn(
                "relative flex flex-col items-center p-4 rounded-3xl border transition-all duration-300 text-center group overflow-hidden",
                "bg-zinc-900",
                "hover:scale-[1.02] hover:bg-zinc-800/80",
                isSelected 
                  ? "border-yellow-500 bg-yellow-500/5 shadow-[0_0_15px_rgba(234,179,8,0.1)] ring-1 ring-yellow-500/20" 
                  : "border-zinc-800 hover:border-zinc-700"
              )}
            >
              <div className={cn(
                  "absolute top-3 right-3 z-10 bg-yellow-500 text-zinc-950 rounded-full p-1.5 transition-all duration-300 shadow-sm",
                  isSelected ? "scale-100 opacity-100" : "scale-0 opacity-0"
              )}>
                  <Check size={14} strokeWidth={4} />
              </div>

              <div className={cn(
                "relative w-24 h-24 mb-4 rounded-full overflow-hidden transition-all duration-300 shadow-sm border-2",
                isSelected 
                    ? "border-yellow-500 shadow-md scale-105" 
                    : "border-transparent grayscale-[0.5] group-hover:grayscale-0 group-hover:scale-105"
              )}>
                  {isAny || !member.avatar_url ? (
                      <div className={cn(
                          "w-full h-full flex items-center justify-center transition-colors",
                          isSelected ? "bg-yellow-500 text-zinc-950" : "bg-zinc-800 text-zinc-400 group-hover:bg-zinc-700 group-hover:text-white"
                      )}>
                          {isAny ? (
                              isSelected ? <Sparkles size={32} /> : <Users size={32} />
                          ) : (
                              <User size={32} />
                          )}
                      </div>
                  ) : (
                      <Image 
                        src={member.avatar_url} 
                        alt={member.full_name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                  )}
              </div>

              <div className="space-y-1 z-10">
                  <span className={cn(
                      "font-bold text-lg block transition-colors capitalize",
                      isSelected ? "text-yellow-500" : "text-white"
                  )}>
                      {member.full_name}
                  </span>
                  <span className={cn(
                      "text-xs font-medium block transition-colors capitalize",
                      isSelected ? "text-yellow-500/80" : "text-zinc-500"
                  )}>
                      {isAny ? ROLE_MAP['any'] : (ROLE_MAP[member.role] || member.role)}
                  </span>
              </div>
              
              {isSelected && (
                  <div className="absolute inset-0 bg-yellow-500/5 z-0 pointer-events-none" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}