'use client'

import Link from "next/link"
import { ArrowLeft, Store, User, Mail, Phone, Loader2, Sparkles, AlertCircle, CheckCircle2 } from "lucide-react"
import { useActionState, useEffect, useState } from "react"
import { useFormStatus } from "react-dom"
// Importaremos la acción en el siguiente paso
// import { submitOnboardingRequest } from "./actions" 
import { sileo } from "sileo"
import { newBusinessImplementation } from "./actions"

// TODO: En el siguiente paso crearemos la acción real. Por ahora usamos un mock.
async function mockAction(prevState: any, formData: FormData) {
    return { success: false, error: 'Acción pendiente de conectar' }
}

export default function RegisterPage() {
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [result, setResult] = useState<boolean>(false)
    const [newBusiness, setNewBusiness] = useState<{
        name: string | null
        business_name: string | null
        email: string | null
        phone: string | null
    }>({
        name: null,
        business_name: null,
        email: null,
        phone: null
    })


    return (
        <div className="min-h-screen grid place-items-center bg-zinc-950 relative overflow-hidden p-4 selection:bg-yellow-500/30">

            {/* Fondo decorativo */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,#27272a,transparent)] -z-10" />
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-yellow-500/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/3 -z-10" />

            <div className="w-full max-w-[500px] animate-in fade-in slide-in-from-bottom-4 duration-700">

                {/* Botón para volver */}
                <div className="mb-4">
                    <Link href="/login" className="inline-flex items-center text-sm font-medium text-zinc-500 hover:text-zinc-200 transition-colors group">
                        <div className="p-2 mr-2 rounded-lg bg-zinc-900/50 border border-white/5 group-hover:border-white/10 transition-colors">
                            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                        </div>
                        Volver al inicio de sesión
                    </Link>
                </div>

                <div className="relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-b from-white/10 to-transparent rounded-[2.1rem] blur opacity-20 transition duration-500" />

                    <div className="relative bg-zinc-900/80 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-8 md:p-10 shadow-3xl">

                        {result ? (
                            // ESTADO DE ÉXITO
                            <div className="text-center py-8 animate-in fade-in zoom-in duration-500">
                                <div className="relative w-24 h-24 mx-auto mb-8">
                                    <div className="absolute inset-0 bg-yellow-500/20 rounded-full blur-2xl animate-pulse" />
                                    <div className="relative w-24 h-24 bg-zinc-950 border border-yellow-500/30 rounded-full flex items-center justify-center">
                                        <CheckCircle2 className="w-12 h-12 text-yellow-500" />
                                    </div>
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-3 tracking-tight">¡Petición recibida!</h3>
                                <p className="text-zinc-400 leading-relaxed mb-10">
                                    Gracias por confiar en KUPO. Un experto de nuestro equipo te contactará en breve para configurar tu sistema a medida.
                                </p>
                                <Link href="/login" className="flex w-full items-center justify-center px-6 py-4 font-bold text-zinc-950 bg-white rounded-xl hover:bg-zinc-200 active:scale-[0.98] transition-all">
                                    Entendido
                                </Link>
                            </div>
                        ) : (
                            // FORMULARIO DE SOLICITUD
                            <>
                                <div className="mb-6 text-left">
                                    <h1 className="text-2xl font-bold text-yellow-500 mb-3 tracking-tight">Da el salto digital</h1>
                                    <p className="text-zinc-400 text-md leading-relaxed">
                                        Déjanos tus datos. Nos encargamos de preparar todo el sistema para que tú solo te preocupes de atender a tus clientes.
                                    </p>
                                </div>

                                <div className="space-y-4">
                                    {/* Nombre Completo */}
                                    <div className="space-y-1">
                                        <label className="block text-[10px] font-bold text-zinc-500 ml-1 uppercase tracking-[0.15em]">Tu Nombre</label>
                                        <div className="relative group/input">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <User className="h-5 w-5 text-zinc-600 group-focus-within/input:text-yellow-500 transition-colors" />
                                            </div>
                                            <input
                                                type="text"
                                                required
                                                className="w-full pl-12 pr-4 py-2 bg-zinc-950/50 border border-zinc-800 rounded-xl focus:border-yellow-500/50 focus:ring-4 focus:ring-yellow-500/5 outline-none transition-all text-white placeholder:text-zinc-600"
                                                placeholder="Ej. Carlos Martínez"
                                                onChange={(e) => setNewBusiness({ ...newBusiness, name: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    {/* Nombre del Negocio */}
                                    <div className="space-y-1">
                                        <label className="block text-[10px] font-bold text-zinc-500 ml-1 uppercase tracking-[0.15em]">Nombre del Negocio</label>
                                        <div className="relative group/input">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <Store className="h-5 w-5 text-zinc-600 group-focus-within/input:text-yellow-500 transition-colors" />
                                            </div>
                                            <input
                                                type="text"
                                                required
                                                className="w-full pl-12 pr-4 py-2 bg-zinc-950/50 border border-zinc-800 rounded-xl focus:border-yellow-500/50 focus:ring-4 focus:ring-yellow-500/5 outline-none transition-all text-white placeholder:text-zinc-600"
                                                placeholder="Ej. Barbería Elegance"
                                                onChange={(e) => setNewBusiness({ ...newBusiness, business_name: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    {/* Email */}
                                    <div className="space-y-1">
                                        <label className="block text-[10px] font-bold text-zinc-500 ml-1 uppercase tracking-[0.15em]">Correo Electrónico</label>
                                        <div className="relative group/input">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <Mail className="h-5 w-5 text-zinc-600 group-focus-within/input:text-yellow-500 transition-colors" />
                                            </div>
                                            <input
                                                type="email"
                                                required
                                                className="w-full pl-12 pr-4 py-2 bg-zinc-950/50 border border-zinc-800 rounded-xl focus:border-yellow-500/50 focus:ring-4 focus:ring-yellow-500/5 outline-none transition-all text-white placeholder:text-zinc-600"
                                                placeholder="correo@ejemplo.com"
                                                onChange={(e) => setNewBusiness({ ...newBusiness, email: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    {/* Teléfono */}
                                    <div className="space-y-1">
                                        <label className="block text-[10px] font-bold text-zinc-500 ml-1 uppercase tracking-[0.15em]">Teléfono (WhatsApp)</label>
                                        <div className="relative group/input">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <Phone className="h-5 w-5 text-zinc-600 group-focus-within/input:text-yellow-500 transition-colors" />
                                            </div>
                                            <input
                                                type="tel"
                                                required
                                                className="w-full pl-12 pr-4 py-2 bg-zinc-950/50 border border-zinc-800 rounded-xl focus:border-yellow-500/50 focus:ring-4 focus:ring-yellow-500/5 outline-none transition-all text-white placeholder:text-zinc-600"
                                                placeholder="+34 600 000 000"
                                                onChange={(e) => setNewBusiness({ ...newBusiness, phone: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full group relative flex items-center justify-center px-4 py-4 font-bold text-zinc-950 bg-yellow-500 rounded-2xl hover:bg-yellow-400 disabled:opacity-50 transition-all shadow-[0_10px_20px_-10px_rgba(234,179,8,0.3)] active:scale-[0.98] overflow-hidden"
                                        onClick={async () => {
                                            try {
                                                const response = await newBusinessImplementation(newBusiness)

                                                if (response.error) {
                                                    sileo.error({
                                                        title: response.error
                                                    })
                                                    setIsLoading(false)
                                                    setResult(false)
                                                    return
                                                }
                                                if (response.success) {
                                                    sileo.success({
                                                        title: 'Solicitud enviada con éxito',
                                                        description: '¡Enseguida nos pondremos en contacto comtigo!'
                                                    })
                                                    setIsLoading(false)
                                                    setResult(true)
                                                    return
                                                }
                                            } catch {
                                                sileo.error({
                                                    title: 'Error interno, vuelve a intentarlo'
                                                }) 
                                                setIsLoading(false)
                                            }
                                        }}
                                    >
                                        {isLoading ? (
                                            <div className="flex items-center gap-2">
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                                <span>Enviando solicitud...</span>
                                            </div>
                                        ) : (
                                            <span className="relative z-10">Solicitar mi sistema</span>
                                        )}
                                        <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] transition-transform" />
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}