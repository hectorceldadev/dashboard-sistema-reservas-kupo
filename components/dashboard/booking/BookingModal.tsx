'use client';

import { useState, useEffect, useRef } from 'react';
import { X, ChevronLeft, ArrowRight, CheckCircle, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns'

// IMPORTS DE LOS PASOS (Corregidos)
import StepService from './StepService';
import StepStaff from './StepStaff';
import StepDate from './StepDate';
import StepForm from './StepForm';
import StepSuccess from './StepSuccess';
import StepSummary from './StepSummary'

import { useAdminBooking } from '@/context/AdminBookingContext'; 
import { clientFormSchema } from '@/lib/schemas';

// IMPORTS DE SERVER ACTIONS
import { getStaff } from '@/components/dashboard/booking/actions/staff-actions'; // Asumo que pusiste getServices aquí
import { getServices } from '@/components/dashboard/booking/actions/services-actions'; // Asumo que pusiste getServices aquí

import { createManualBookingAction } from '@/components/dashboard/booking/actions/create-action';
import { sileo } from 'sileo';

// --- INTERFACES ---
export interface Booking {
  services: Service[];
  staff: Profile | null;
  date: Date | undefined;
  time: string | null;
  client: { name: string; phone: string; email: string; comment: string } | null;
  paymentMethod: 'venue' | 'card' | null; 
}

export interface Service {
  id: string;
  title: string;
  price: number;
  duration: number;
  short_desc?: string;
}

export interface Profile {
  id: string;
  full_name: string;
  role: string;
  avatar_url?: string;
}

export default function BookingModal() {
  const [ step, setStep ] = useState(1)
  const [ isLoading, setIsLoading ] = useState<boolean>(false)
  const [ availableServices, setAvailableServices ] = useState<Service[]>([])
  const [ staff, setStaff ] = useState<Profile[]>([])

  const { isOpen, openModal, closeModal } = useAdminBooking()
  const scrollRef = useRef<HTMLDivElement>(null)
  
  const TOTAL_STEPS = 5

  const [booking, setBooking] = useState<Booking>({
    services: [],
    staff: null,
    date: undefined,
    time: null,
    client: null,
    paymentMethod: 'venue',
  });

  const [isClosing, setIsClosing] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      setIsClosing(false);
    } else {
      setIsClosing(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
        setIsClosing(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleClose = () => {
    closeModal(); 
    setTimeout(() => {
        setStep(1);
        setBooking({
            services: [],
            staff: null,
            date: undefined,
            time: null,
            client: null,
            paymentMethod: 'venue',
        });
    }, 300); 
  };

  // --- CARGAR DATOS ---
  useEffect(() => {
    const fetchInitialData = async () => {
      if (!isOpen) return
      try {
        setIsLoading(true)
        
        // Ejecutamos ambas consultas en paralelo
        const [staffRes, servicesRes] = await Promise.all([
             getStaff(),
             getServices() // <-- ASEGURATE DE TENER ESTA ACCION EXPORTADA
        ])
        
        if (servicesRes?.success) setAvailableServices(servicesRes.services || []);
        
        if (staffRes?.success) {
            const staffData = staffRes.profiles || []
            if (staffData.length === 1) {
              setStaff(staffData)
              setBooking(prev => ({ ...prev, staff: staffData[0] }))
            } else {
              const anyStaff: Profile = { id: 'any', full_name: 'Cualquiera', role: 'Primer hueco libre' }
              setStaff([ anyStaff, ...staffData ])
            }
        }
      } catch (err) {
          console.error(err);
          sileo.error({ title: 'Error cargando datos' });
      } finally {
        setIsLoading(false)
      }
    }
    fetchInitialData()
  }, [isOpen])

  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
  }, [step]);

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  // --- VALIDACIÓN CORREGIDA ---
  const canContinue = () => {
    if (step === 1) return booking.services.length > 0;
    if (step === 2) return !!booking.staff;
    if (step === 3) return !!booking.date && !!booking.time;
    if (step === 4) {
      if (!booking.client) return false;
      const result = clientFormSchema.safeParse(booking.client);
      return result.success;
    }
    if (step === 5) return true; // El resumen no requiere validación extra, solo darle a continuar
    return false;
  };

  const totalPrice = booking.services.reduce((total, s) => total + s.price, 0);

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      if (!booking.client || !booking.date || !booking.time || !booking.staff || booking.services.length === 0) {
        throw new Error("Faltan datos para completar la reserva");
      }

      const dateString = format(booking.date, 'yyyy-MM-dd')
      
      const response = await createManualBookingAction({
        bookingDate: dateString,
        bookingTime: booking.time,
        staffId: booking.staff.id,
        services: booking.services as any, // Cast temporal si hay discordancia de tipos con DB
        client: {
            name: booking.client.name,
            email: booking.client.email,
            phone: booking.client.phone
        }
      })

      if (response.error) {
          throw new Error(response.error)
      }

      sileo.success({ title: '¡Reserva agendada correctamente!' })
      setStep(6) 
      
    } catch (error: any) {
      console.error(error)
      sileo.error({ title: 'Error al procesar la reserva', description: error.message })
    } finally {
      setIsLoading(false)
    } 
  }

  if (!isOpen && !isVisible) return null;

  return (
    <div className="fixed inset-0 z-[9000] flex items-center justify-center px-4 sm:px-6 stagger-container">
      <div
        onClick={handleClose}
        className={cn(
            "absolute inset-0 bg-black/80 backdrop-blur-sm touch-none transition-opacity duration-300 ease-out cursor-pointer",
            isClosing ? "opacity-0" : "animate-in fade-in"
        )}
      />

      <div 
        className={cn(
            "relative bg-zinc-950 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90dvh] h-auto border border-zinc-800 transition-all duration-300 ease-out",
            isClosing && "opacity-0 scale-95 translate-y-8 duration-300" 
        )}
      >
        {step < 5 && (
          <div className="p-4 border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-md sticky top-0 z-10 flex justify-between items-center shrink-0">
            <div className="flex items-center gap-3">
              {step > 1 && (
                <button onClick={prevStep} className="p-2 -ml-2 rounded-full hover:bg-white/10 text-zinc-400 hover:text-white transition-colors cursor-pointer">
                  <ChevronLeft size={22} />
                </button>
              )}
              <div className="flex flex-col">
                <h3 className='text-lg text-white font-bold leading-tight'>Agendar Cita</h3>
                <div className="flex items-center gap-2">
                  <div className="h-1 w-16 bg-zinc-800 rounded-full overflow-hidden mt-0.5">
                    <div className="h-full bg-yellow-500 transition-all duration-500" style={{ width: `${(step / TOTAL_STEPS) * 100}%` }} />
                  </div>
                  <span className="text-[10px] text-zinc-500 font-medium">Paso {step}/{TOTAL_STEPS}</span>
                </div>
              </div>
            </div>
            <button onClick={handleClose} className='p-2 rounded-full hover:bg-white/10 text-zinc-500 hover:text-white transition-colors cursor-pointer'>
              <X size={22} />
            </button>
          </div>
        )}

        {/* BODY CON SCROLL (CORREGIDO PARA 4 PASOS) */}
        <div
          ref={scrollRef}
          className="overflow-y-auto flex-1 custom-scrollbar relative overscroll-contain"
        >
          <div className={step === 5 ? "h-full" : "p-6"}>
            {step === 1 && <StepService booking={booking} setBooking={setBooking} servicesList={availableServices as any} isLoading={isLoading} />}
            {step === 2 && <StepStaff booking={booking} setBooking={setBooking} staffList={staff} isLoading={isLoading} />}
            {step === 3 && <StepDate booking={booking} setBooking={setBooking} />}
            {step === 4 && <StepForm booking={booking} setBooking={setBooking} />}
            {step === 5 && <StepSummary booking={booking} setBooking={setBooking} />}
            {step === 6 && <StepSuccess booking={booking} onClose={handleClose} />}
          </div>
        </div>

        {step < 6 && (
          <div className="p-4 border-t border-zinc-800 bg-zinc-950 sticky bottom-0 z-10 shrink-0">
            <div className="flex items-center justify-between gap-4">

              <div className="flex flex-col">
                <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold">Total estimado</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold text-white animate-in slide-in-from-bottom-2">
                    {totalPrice}€
                  </span>
                </div>
              </div>

              <button
                onClick={step === TOTAL_STEPS ? handleConfirm : nextStep}
                disabled={!canContinue() || isLoading}
                className={cn(
                  "flex-1 max-w-[200px] py-3.5 px-6 rounded-xl font-bold text-base flex items-center justify-center gap-2 transition-all duration-300",
                  canContinue() && !isLoading
                    ? "bg-yellow-500 text-zinc-950 shadow-lg shadow-yellow-500/20 hover:scale-[1.02] active:scale-95 cursor-pointer"
                    : "bg-zinc-800 text-zinc-500 cursor-not-allowed opacity-50"
                )}
              >
                {isLoading ? (
                  <Loader2 size={24} className="animate-spin" />
                ) : (
                  step === TOTAL_STEPS ? (
                    <>Confirmar <CheckCircle size={18} /></>
                  ) : (
                    <>Continuar <ArrowRight size={18} /></>
                  )
                )}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}