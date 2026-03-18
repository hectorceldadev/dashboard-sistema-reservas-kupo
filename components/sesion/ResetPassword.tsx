'use client'

import { Lock, Loader2, AlertCircle, KeySquare } from "lucide-react"
import { useActionState, useEffect } from "react"
import { useFormStatus } from "react-dom"
import { updatePassword } from "@/app/login/reset-password/actions"
import { sileo } from "sileo"
import { useRouter } from "next/navigation"

export function UpdatePasswordPage() {
    // Conectaremos esto al servidor en el siguiente paso
    const [state, action] = useActionState(updatePassword, null)
    const router = useRouter()

    // Manejo de notificaciones Sileo
    useEffect(() => {
        if (state?.success) {
            sileo.success({
                title: '¡Contraseña actualizada!',
                description: 'Redirigiendo a tu panel...',
                fill: "black",
                styles: { title: 'text-white font-bold', description: 'text-zinc-400' },
            })
            // Tras cambiarla con éxito, le enviamos directo a su dashboard
            setTimeout(() => router.push('/dashboard'), 1500)
        }
        if (state?.error) {
            sileo.error({
                title: 'Error',
                description: state.error,
                fill: "black",
                styles: { title: 'text-white font-bold', description: 'text-zinc-400' },
            })
        }
    }, [state, router])

    return (
        <div className="min-h-screen grid place-items-center bg-zinc-950 relative overflow-hidden px-4 py-10">
            
            {/* Fondo con texturas y luces */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-900 via-zinc-950 to-zinc-950 -z-10" />
            <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-yellow-500/10 rounded-full blur-[120px] -translate-y-1/2 -translate-x-1/2 -z-10" />

            <div className="w-full max-w-[480px]">
                {/* Tarjeta Principal */}
                <div className="bg-zinc-900/60 backdrop-blur-xl border border-white/5 rounded-3xl p-8 md:p-10 shadow-2xl shadow-black/50 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    
                    <div className="mb-10 text-left">
                        <div className="w-14 h-14 bg-zinc-950 border border-white/10 rounded-2xl flex items-center justify-center text-yellow-500 mb-6 shadow-lg">
                            <KeySquare className="w-7 h-7" />
                        </div>
                        <h1 className="text-2xl font-bold text-white mb-2">Nueva contraseña</h1>
                        <p className="text-zinc-400 text-md">
                            Estás a un paso de recuperar tu cuenta. Crea una contraseña segura.
                        </p>
                    </div>

                    <form action={action} className="space-y-6">
                        {/* Campo: Nueva Contraseña */}
                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-zinc-400 ml-1 uppercase tracking-wider">
                                Contraseña nueva
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-zinc-500 group-focus-within:text-yellow-500 transition-colors" />
                                </div>
                                <input
                                    name="password"
                                    type="password"
                                    required
                                    minLength={6}
                                    className="w-full pl-12 pr-4 py-3 bg-zinc-950/50 border border-zinc-800 rounded-xl focus:border-yellow-500 focus:ring-4 focus:ring-yellow-500/10 outline-none transition-all text-white placeholder:text-zinc-600 text-base"
                                    placeholder="Mínimo 6 caracteres"
                                />
                            </div>
                        </div>

                        {/* Campo: Confirmar Contraseña */}
                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-zinc-400 ml-1 uppercase tracking-wider">
                                Repetir contraseña
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-zinc-500 group-focus-within:text-yellow-500 transition-colors" />
                                </div>
                                <input
                                    name="confirmPassword"
                                    type="password"
                                    required
                                    minLength={6}
                                    className="w-full pl-12 pr-4 py-3 bg-zinc-950/50 border border-zinc-800 rounded-xl focus:border-yellow-500 focus:ring-4 focus:ring-yellow-500/10 outline-none transition-all text-white placeholder:text-zinc-600 text-base"
                                    placeholder="Vuelve a escribirla"
                                />
                            </div>
                        </div>

                        {/* Mensaje de Error */}
                        {state?.error && (
                            <div className="px-4 py-2 bg-red-500/10 border border-red-500/20 text-red-200 text-sm rounded-xl flex items-start gap-3">
                                <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                                <span>{state.error}</span>
                            </div>
                        )}

                        <SubmitButton />
                    </form>
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
            className="w-full mt-4 relative overflow-hidden flex items-center justify-center px-4 py-4 font-bold text-white bg-yellow-500 rounded-xl hover:bg-yellow-400 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-yellow-500/20"
        >
            {pending ? (
                <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    <span className="opacity-90">Guardando...</span>
                </>
            ) : (
                'Guardar y acceder'
            )}
        </button>
    )
}