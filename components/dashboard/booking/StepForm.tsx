'use client';

import { useState } from 'react';
import { User, Phone, Mail, AlertCircle } from 'lucide-react';
import { Booking } from './BookingModal';
import { clientFormSchema } from '@/lib/schemas';

interface StepFormProps {
  booking: Booking;
  setBooking: React.Dispatch<React.SetStateAction<Booking>>;
}

export default function StepForm({ booking, setBooking }: StepFormProps) {
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { name = '', phone = '', email = '', comment = '' } = booking.client || {};

  const validateField = (field: 'name' | 'email' | 'phone' | 'comment', value: string) => {
    // Si el email está vacío y es desde el dashboard, no lo validamos estrictamente aquí
    if (field === 'email' && value.trim() === '') {
        setErrors(prev => {
            const newErrors = { ...prev };
            delete newErrors[field];
            return newErrors;
        });
        return;
    }

    const fieldSchema = clientFormSchema.pick({ [field]: true } as any);
    const result = fieldSchema.safeParse({ [field]: value });
    
    if (!result.success) {
      const errorMessage = result.error.issues[0].message;
      setErrors(prev => ({ ...prev, [field]: errorMessage }));
    } else {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name: fieldName, value } = e.target;
    
    setBooking({
      ...booking,
      client: {
        ...(booking.client || { name: '', phone: '', email: '', comment: '' }),
        [fieldName]: value
      }
    });
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name: fieldName, value } = e.target;
      validateField(fieldName as any, value);
  }

  return (
    <div className="space-y-6 animate-in slide-in-from-right-8 fade-in duration-500 pb-4">
      
      <div className="flex flex-col items-start">
        <h3 className="text-white font-bold text-xl">Datos del cliente</h3>
        <p className="text-zinc-400 text-md">Ingresa los datos para registrar la cita.</p>
      </div>

      <div className="space-y-4">
        
        {/* NOMBRE */}
        <div className="space-y-1.5">
            <label className="text-sm font-bold text-zinc-300 ml-1">Nombre completo *</label>
            <div className="relative group">
                <User size={18} className={`absolute left-3 top-1/2 -translate-y-1/2 transition-colors ${errors.name ? 'text-red-400' : 'text-zinc-500 group-focus-within:text-yellow-500'}`} />
                <input 
                    type="text" 
                    name="name"
                    value={name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Ej: Alex García"
                    className={`w-full bg-zinc-900 border rounded-xl py-3 pl-10 pr-4 outline-none transition-all text-white placeholder:text-zinc-600 
                        ${errors.name 
                            ? 'border-red-400/50 focus:ring-2 focus:ring-red-400/20' 
                            : 'border-zinc-800 focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500/50'
                        }`}
                />
            </div>
            {errors.name && <p className="text-xs text-red-400 flex items-center gap-1 ml-1 animate-in slide-in-from-left-2"><AlertCircle size={10}/> {errors.name}</p>}
        </div>

        {/* TELÉFONO */}
        <div className="space-y-1.5">
            <label className="text-sm font-bold text-zinc-300 ml-1">Teléfono móvil *</label>
            <div className="relative group">
                <Phone size={18} className={`absolute left-3 top-1/2 -translate-y-1/2 transition-colors ${errors.phone ? 'text-red-400' : 'text-zinc-500 group-focus-within:text-yellow-500'}`} />
                <input 
                    type="tel" 
                    name="phone"
                    value={phone}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Ej: 600 123 456"
                    className={`w-full bg-zinc-900 border rounded-xl py-3 pl-10 pr-4 outline-none transition-all text-white placeholder:text-zinc-600 
                        ${errors.phone 
                            ? 'border-red-400/50 focus:ring-2 focus:ring-red-400/20' 
                            : 'border-zinc-800 focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500/50'
                        }`}
                />
            </div>
            {errors.phone && <p className="text-xs text-red-400 flex items-center gap-1 ml-1 animate-in slide-in-from-left-2"><AlertCircle size={10}/> {errors.phone}</p>}
        </div>

        {/* EMAIL (Opcional en el dashboard) */}
        <div className="space-y-1.5">
            <label className="text-sm font-bold text-zinc-300 ml-1">Email <span className="text-zinc-500 font-normal text-xs">(Opcional)</span></label>
            <div className="relative group">
                <Mail size={18} className={`absolute left-3 top-1/2 -translate-y-1/2 transition-colors ${errors.email ? 'text-red-400' : 'text-zinc-500 group-focus-within:text-yellow-500'}`} />
                <input 
                    type="email" 
                    name="email"
                    value={email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Para enviar confirmación"
                    className={`w-full bg-zinc-900 border rounded-xl py-3 pl-10 pr-4 outline-none transition-all text-white placeholder:text-zinc-600 
                        ${errors.email 
                            ? 'border-red-400/50 focus:ring-2 focus:ring-red-400/20' 
                            : 'border-zinc-800 focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500/50'
                        }`}
                />
            </div>
            {errors.email && <p className="text-xs text-red-400 flex items-center gap-1 ml-1 animate-in slide-in-from-left-2"><AlertCircle size={10}/> {errors.email}</p>}
        </div>

      </div>

      {/* Espaciador para teclado móvil */}
      <div className="h-20 w-full md:hidden"></div> 

    </div>
  );
}