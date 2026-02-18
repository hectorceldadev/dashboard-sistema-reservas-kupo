'use client'

import { updateSettings } from "@/app/dashboard/ajustes/actions"
import { useActionState, useEffect } from "react"
import { useFormStatus } from 'react-dom'
import { Store, MapPin, Phone, Save, Loader2,  AlertCircle } from 'lucide-react'
import { sileo } from "sileo"
// import { sileo } from "sileo" // Si usas toast

export function SettingsForm({ initialData }: { initialData: any }) {
    const [state, action] = useActionState(updateSettings, null)

    // Opcional: Mostrar Toast/Alerta al terminar
    useEffect(() => {
        if (state?.success) {
            // sileo.success("Guardado correctamente")
            sileo.success({
                title: 'Datos actualizados correctamente.',
                fill: "black",
                styles: {
                    title: 'text-white font-bold'
                }
            }) 
        }
    }, [state])

    return (
        <form action={action} className="space-y-8">
             {/* Mensajes de Feedback visual en el propio form */}
             {state?.error && (
                <div className="p-4 bg-red-900/20 border border-red-800 rounded-xl text-red-200 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5" /> {state.error}
                </div>
            )}
            
            <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 space-y-8 shadow-xl shadow-black/20">
                
                {/* 1. Nombre */}
                <div className="space-y-3">
                    <label className="flex items-center gap-2 text-xs font-bold text-zinc-500 uppercase tracking-wider">
                        <Store className="w-4 h-4" /> Nombre del Negocio
                    </label>
                    <input 
                        name="business_name" // Coincide con actions.ts
                        type="text" 
                        defaultValue={initialData.name} 
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-5 py-4 text-lg text-white focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 outline-none transition-all placeholder:text-zinc-700"
                        placeholder="Ej. Barbería Elite"
                    />
                </div>

                {/* 2. Dirección */}
                <div className="space-y-3">
                    <label className="flex items-center gap-2 text-xs font-bold text-zinc-500 uppercase tracking-wider">
                        <MapPin className="w-4 h-4" /> Dirección Física
                    </label>
                    <input 
                        name="address"
                        type="text" 
                        defaultValue={initialData.address}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-5 py-4 text-white focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 outline-none transition-all placeholder:text-zinc-700"
                        placeholder="Calle, Número, Ciudad..."
                    />
                </div>

                {/* 3. Teléfono */}
                <div className="space-y-3">
                    <label className="flex items-center gap-2 text-xs font-bold text-zinc-500 uppercase tracking-wider">
                        <Phone className="w-4 h-4" /> Teléfono de Contacto
                    </label>
                    <input 
                        name="phone"
                        type="tel" 
                        defaultValue={initialData.phone}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-5 py-4 text-white focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 outline-none transition-all placeholder:text-zinc-700 font-mono"
                        placeholder="+34 600 000 000"
                    />
                </div>

            </div>

            <div className="flex justify-end pt-2">
                <SubmitButton />
            </div>

        </form>
    )
}

function SubmitButton() {
    const { pending } = useFormStatus()

    return (
        <button 
            type="submit" 
            disabled={pending}
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-yellow-500 hover:bg-yellow-400 text-zinc-950 font-bold transition-all flex items-center justify-center gap-3 shadow-lg shadow-yellow-500/20 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
        >
            {pending ? (
                <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Guardando...</span>
                </>
            ) : (
                <>
                    <Save className="w-5 h-5" />
                    <span>Guardar Cambios</span>
                </>
            )}
        </button>
    )
}