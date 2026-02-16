'use client'

import Link from "next/link"
import { ArrowLeft, CheckCircle2, Loader2, Mail, AlertCircle, KeyRound } from "lucide-react"
import { useActionState, useEffect } from "react"
import { useFormStatus } from "react-dom"
import { sendResetEmail } from "./actions"
import { sileo } from "sileo"

export default function ForgotPasswordPage() {
    // El hook para conectar con el servidor.
    const [state, action] = useActionState(sendResetEmail, null)

    // Efecto para lanzar Sileo Toasts
    useEffect(() => {
        if (state?.success) {
            sileo.success({
                title: '¡Enviado!',
                description: 'Revisa tu bandeja de entrada.',
                fill: "black",
                styles: {
                    title: 'text-white font-bold',
                    description: 'text-zinc-400',
                },
            })
        }
        if (state?.error) {
            sileo.error({
                title: 'Error',
                description: state.error,
                fill: "black",
                styles: {
                    title: 'text-white font-bold',
                    description: 'text-zinc-400',
                },
            })
        }
    }, [state])

    return (
        <div className="min-h-screen grid place-items-center bg-zinc-950 relative overflow-hidden px-4">
            
            {/* Fondo con texturas y luces (Igual que el Login) */}
            <div className="absolute inset-0 bg-radial-gradient(ellipse_at_top,_var(--tw-gradient-stops)) from-zinc-900 via-zinc-950 to-zinc-950 -z-10" />
            <div className="absolute top-0 right-0 w-500px h-500px bg-yellow-500/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 -z-10" />

            <div className="w-full max-w-480px">
                
                {/* Botón flotante para volver */}
                <div className="mb-6">
                    <Link 
                        href="/login" 
                        className="inline-flex items-center text-sm font-medium text-zinc-500 hover:text-white transition-colors group"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                        Volver al inicio de sesión
                    </Link>
                </div>

                {/* Tarjeta Principal */}
                <div className="bg-zinc-900/60 backdrop-blur-xl border border-white/5 rounded-3xl p-8 md:p-10 shadow-2xl shadow-black/50">
                    
                    {/* ESTADO DE ÉXITO (Vista de Confirmación) */}
                    {state?.success ? (
                        <div className="text-center py-8 animate-fade-in">
                            <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-500/20 shadow-[0_0_30px_-10px_rgba(16,185,129,0.3)]">
                                <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-3">¡Correo enviado!</h3>
                            <p className="text-zinc-400 leading-relaxed mb-8">
                                Hemos enviado un enlace mágico a <br/>
                                <span className="text-white font-medium">{state.success}</span>
                            </p>
                            
                            <Link 
                                href="/login"
                                className="inline-flex w-full items-center justify-center px-4 py-4 font-bold text-zinc-950 bg-white rounded-xl hover:bg-zinc-200 transition-all"
                            >
                                Volver al Login
                            </Link>
                        </div>
                    ) : (
                        /* ESTADO NORMAL (Formulario) */
                        <>
                            <div className="mb-10 text-center sm:text-left">
                                <div className="w-14 h-14 bg-zinc-950 border border-white/10 rounded-2xl flex items-center justify-center text-yellow-500 mb-6 shadow-lg">
                                    <KeyRound className="w-7 h-7" />
                                </div>
                                <h1 className="text-3xl font-bold text-white mb-2">Recuperar acceso</h1>
                                <p className="text-zinc-400 text-lg">
                                    Introduce tu correo y te enviaremos las instrucciones.
                                </p>
                            </div>

                            <form action={action} className="space-y-8">
                                <div className="space-y-2">
                                    <label htmlFor="email" className="block text-sm font-semibold text-zinc-400 ml-1 uppercase tracking-wider">
                                        Correo electrónico
                                    </label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <Mail className="h-5 w-5 text-zinc-500 group-focus-within:text-yellow-500 transition-colors" />
                                        </div>
                                        <input
                                            id="email"
                                            name="email"
                                            type="email"
                                            required
                                            className="w-full pl-12 pr-4 py-4 bg-zinc-950/50 border border-zinc-800 rounded-xl focus:border-yellow-500 focus:ring-4 focus:ring-yellow-500/10 outline-none transition-all text-white placeholder:text-zinc-600 text-base font-medium"
                                            placeholder="nombre@negocio.com"
                                        />
                                    </div>
                                </div>

                                {/* Mensaje de Error Inline (además del Sileo toast) */}
                                {state?.error && (
                                    <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-200 text-sm rounded-xl flex items-start gap-3">
                                        <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                                        <span>{state.error}</span>
                                    </div>
                                )}

                                <SubmitButton />
                            </form>
                        </>
                    )}
                </div>
                
                {/* Footer simple */}
                <p className="text-center text-zinc-600 text-sm mt-8">
                    ¿Necesitas ayuda? <a href="#" className="text-zinc-400 hover:text-white transition-colors">Contacta con soporte</a>
                </p>
            </div>
        </div>
    )
}

// Botón que muestra "Enviando..." mientras carga
function SubmitButton() {
    const { pending } = useFormStatus()

    return (
        <button
            type="submit"
            disabled={pending}
            className="w-full relative overflow-hidden flex items-center justify-center px-4 py-4 font-bold text-zinc-950 bg-yellow-500 rounded-xl hover:bg-yellow-400 focus:outline-none focus:ring-4 focus:ring-yellow-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-yellow-500/10 active:scale-[0.98]"
        >
            {pending ? (
                <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin text-zinc-900" />
                    <span className="opacity-80">Enviando enlace...</span>
                </>
            ) : (
                'Enviar enlace mágico'
            )}
        </button>
    )
}