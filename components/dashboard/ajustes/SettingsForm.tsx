'use client'

import { useEffect, useState } from "react"
import { Store, MapPin, Phone, Save, Loader2, AlertCircle, Clock } from 'lucide-react'
import { sileo } from "sileo"
import { updateSettings } from "@/app/dashboard/ajustes/actions"
// import { sileo } from "sileo" // Si usas toast

export function SettingsForm({ initialData }: { initialData: any }) {
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const [businessData, setBusinessData] = useState<{
        name: string | null
        open_hour: string | null
        close_hour: string | null
        address: string | null
        phone: string | null
    }>({
        name: initialData.name,
        open_hour: initialData.open_hour,
        close_hour: initialData.close_hour,
        address: initialData.address,
        phone: initialData.phone
    })

    return (
        <div className="space-y-8">

            <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 space-y-8 shadow-xl shadow-black/20 stagger-container">

                {/* 1. Nombre */}
                <div className="space-y-3">
                    <label className="flex items-center gap-2 text-xs font-bold text-zinc-500 font-unbounded">
                        <Store className="w-4 h-4" /> Nombre del Negocio
                    </label>
                    <input
                        type="text"
                        value={businessData.name || ''}
                        onChange={(e) => setBusinessData({ ...businessData, name: e.target.value })}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 outline-none transition-all placeholder:text-zinc-700"
                        placeholder="Ej. Barbería Elite"
                    />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-3">
                        <label className="flex items-center gap-2 text-xs font-bold text-zinc-500 font-unbounded">
                            <Clock className="w-4 h-4" /> Hora de Apertura
                        </label>
                        <input
                            type="time"
                            value={businessData.open_hour || ''}
                            onChange={(e) => setBusinessData({ ...businessData, open_hour: e.target.value })}
                            className="w-[60%] md:w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:border-yellow-500 outline-none text-center font-mono"
                        />
                    </div>

                    <div className="space-y-3">
                        <label className="flex items-center gap-2 text-xs font-bold text-zinc-500 font-unbounded">
                            <Clock className="w-4 h-4" /> Hora de Cierre
                        </label>
                        <input
                            type="time"
                            defaultValue={businessData.close_hour || ''}
                            onChange={(e) => setBusinessData({ ...businessData, close_hour: e.target.value })}
                            className="w-[60%] md:w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:border-yellow-500 outline-none text-center font-mono"
                        />
                    </div>
                </div>

                {/* 2. Dirección */}
                <div className="space-y-3">
                    <label className="flex items-center gap-2 text-xs font-bold text-zinc-500 font-unbounded">
                        <MapPin className="w-4 h-4" /> Dirección Física
                    </label>
                    <input
                        type="text"
                        value={businessData.address || ''}
                        onChange={(e) => setBusinessData({ ...businessData, address: e.target.value })}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 outline-none transition-all placeholder:text-zinc-700"
                        placeholder="Calle, Número, Ciudad..."
                    />
                </div>

                {/* 3. Teléfono */}
                <div className="space-y-3">
                    <label className="flex items-center gap-2 text-xs font-bold text-zinc-500 font-unbounded">
                        <Phone className="w-4 h-4" /> Teléfono de Contacto
                    </label>
                    <input
                        type="tel"
                        value={businessData.phone || ''}
                        onChange={(e) => setBusinessData({ ...businessData, phone: e.target.value })}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 outline-none transition-all placeholder:text-zinc-700 font-mono"
                        placeholder="+34 600 000 000"
                    />
                </div>
                <div className="flex justify-end pt-2">
                    <button
                        type="submit"
                        onClick={async () => {
                            try {
                                setIsLoading(true)
                                const response = await updateSettings(businessData)
                                if (response.error) {
                                    sileo.error({
                                        title: 'Error actualizando los datos',
                                        description: response.error
                                    })
                                }
                                if (response.success) {
                                    sileo.success({
                                        title: 'Datos actualizados'
                                    })

                                }
                            } catch (error) {
                                console.error('Error interno: ', error)
                                sileo.error({ title: 'Error interno' })
                            } finally {
                                setIsLoading(false)
                            }
                        }}
                        disabled={isLoading}
                        className="w-full sm:w-auto px-4 py-3 text-sm rounded-xl font-unbounded bg-yellow-500 hover:bg-yellow-400 text-zinc-950 font-bold transition-all flex items-center justify-center gap-3 shadow-lg shadow-yellow-500/20 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
                    >
                        {isLoading ? (
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
                </div>
            </div>


        </div>
    )
}
