'use client'

import Link from "next/link"
import { ArrowLeft, CheckCircle2, Loader2, Mail, AlertCircle, KeyRound } from "lucide-react"
import { useActionState, useEffect } from "react"
import { useFormStatus } from "react-dom"
import { sendResetEmail } from "@/app/login/forgot-password/actions"
import { sileo } from "sileo"

export function ForgotPasswordPage() {
    const [state, action] = useActionState(sendResetEmail, null)

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
        <div className="min-h-screen grid place-items-center bg-zinc-950 relative overflow-hidden px-4 selection:bg-yellow-500/30">
            
            {/* Background Decor */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,#27272a,transparent)] -z-10" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1000px] h-[400px] bg-yellow-500/5 blur-[120px] rounded-full -z-10" />

            <div className="w-full max-w-[440px] animate-in fade-in slide-in-from-bottom-4 duration-700">
                
                {/* Back Link */}
                <div className="mb-8">
                    <Link 
                        href="/login" 
                        className="inline-flex items-center text-sm font-medium text-zinc-500 hover:text-zinc-200 transition-colors group"
                    >
                        <div className="p-2 mr-2 rounded-lg bg-zinc-900/50 border border-white/5 group-hover:border-white/10 transition-colors">
                            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                        </div>
                        Volver al inicio de sesión
                    </Link>
                </div>

                {/* Main Card */}
                <div className="relative group">
                    {/* Glow effect around card */}
                    <div className="absolute -inset-0.5 bg-gradient-to-b from-white/10 to-transparent rounded-[2.1rem] blur opacity-20 group-hover:opacity-30 transition duration-500" />
                    
                    <div className="relative bg-zinc-900/80 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-8 md:p-10 shadow-3xl">
                        
                        {state?.success ? (
                            <div className="text-center py-4 animate-in fade-in zoom-in duration-500">
                                <div className="relative w-24 h-24 mx-auto mb-8">
                                    <div className="absolute inset-0 bg-emerald-500/20 rounded-full blur-2xl animate-pulse" />
                                    <div className="relative w-24 h-24 bg-zinc-950 border border-emerald-500/30 rounded-full flex items-center justify-center">
                                        <CheckCircle2 className="w-12 h-12 text-emerald-500" />
                                    </div>
                                </div>
                                
                                <h3 className="text-2xl font-bold text-white mb-3 tracking-tight">¡Revisa tu correo!</h3>
                                <p className="text-zinc-400 leading-relaxed mb-10">
                                    Hemos enviado instrucciones de recuperación a <br/>
                                    <span className="text-zinc-100 font-semibold underline decoration-yellow-500/30">{state.success}</span>
                                </p>
                                
                                <Link 
                                    href="/login"
                                    className="flex w-full items-center justify-center px-6 py-4 font-bold text-zinc-950 bg-white rounded-xl hover:bg-zinc-200 active:scale-[0.98] transition-all"
                                >
                                    Entendido, ir al login
                                </Link>
                            </div>
                        ) : (
                            <>
                                <div className="mb-10 text-center sm:text-left">
                                    <div className="inline-flex items-center justify-center w-16 h-16 bg-zinc-950 border border-white/10 rounded-2xl text-yellow-500 mb-8 shadow-inner relative group-hover:border-yellow-500/30 transition-colors">
                                        <KeyRound className="w-8 h-8 relative z-10" />
                                        <div className="absolute inset-0 bg-yellow-500/5 rounded-2xl blur-sm" />
                                    </div>
                                    <h1 className="text-3xl font-bold text-white mb-3 tracking-tight">Recuperar acceso</h1>
                                    <p className="text-zinc-400 text-base leading-relaxed">
                                        No te preocupes, sucede. Introduce tu email para recibir un enlace de recuperación.
                                    </p>
                                </div>

                                <form action={action} className="space-y-6">
                                    <div className="space-y-2.5">
                                        <label htmlFor="email" className="block text-xs font-bold text-zinc-500 ml-1 uppercase tracking-[0.15em]">
                                            Correo electrónico
                                        </label>
                                        <div className="relative group/input">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <Mail className="h-5 w-5 text-zinc-600 group-focus-within/input:text-yellow-500 transition-colors" />
                                            </div>
                                            <input
                                                id="email"
                                                name="email"
                                                type="email"
                                                required
                                                className="w-full pl-12 pr-4 py-4 bg-zinc-950/50 border border-zinc-800 rounded-2xl focus:border-yellow-500/50 focus:ring-4 focus:ring-yellow-500/5 outline-none transition-all text-white placeholder:text-zinc-600 text-base"
                                                placeholder="ejemplo@correo.com"
                                            />
                                        </div>
                                    </div>

                                    {state?.error && (
                                        <div className="p-4 bg-red-500/5 border border-red-500/20 text-red-400 text-sm rounded-2xl flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
                                            <AlertCircle className="w-5 h-5 shrink-0" />
                                            <span className="font-medium">{state.error}</span>
                                        </div>
                                    )}

                                    <SubmitButton />
                                </form>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

function SubmitButton() {
    const { pending } = useFormStatus()

    return (
        <button
            type="submit"
            disabled={pending}
            className="w-full group relative flex items-center justify-center px-4 py-4 font-bold text-zinc-950 bg-yellow-500 rounded-2xl hover:bg-yellow-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-[0_10px_20px_-10px_rgba(234,179,8,0.3)] active:scale-[0.98] overflow-hidden"
        >
            {pending ? (
                <div className="flex items-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Procesando...</span>
                </div>
            ) : (
                <span className="relative z-10">Enviar enlace mágico</span>
            )}
            
            {/* Glossy effect on hover */}
            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] transition-transform" />
        </button>
    )
}