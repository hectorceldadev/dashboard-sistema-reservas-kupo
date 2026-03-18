'use client'

import Link from "next/link"
import { ArrowLeft, Store, User, Mail, Phone, Loader2, CheckCircle2, TrendingUp } from "lucide-react"
import { useState } from "react"
import { sileo } from "sileo"
import { newBusinessImplementation } from "@/app/register/actions"

export function Register() {
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
        // h-[100dvh] asegura que ocupe exactamente el 100% de la pantalla visible (incluso en móviles con barras de navegación)
        <div className="h-[100dvh] w-full grid lg:grid-cols-2 bg-zinc-950 relative overflow-hidden selection:bg-yellow-500/30">

            {/* Fondo decorativo base */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,#27272a,transparent)] -z-10" />

            {/* COLUMNA IZQUIERDA */}
            <div className="relative flex flex-col justify-center items-center px-4 sm:px-8 h-full w-full">
                
                {/* Botón para volver (Absoluto arriba a la izquierda) */}
                <div className="absolute top-6 left-6 z-20">
                    <Link href="/" className="inline-flex items-center text-sm font-medium text-zinc-500 hover:text-zinc-200 transition-colors group">
                        <div className="p-2 mr-2 rounded-lg bg-zinc-900/50 border border-white/5 group-hover:border-white/10 transition-colors">
                            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                        </div>
                        <span className="hidden sm:inline">Volver al home</span>
                    </Link>
                </div>

                {/* Contenedor del Formulario - Tamaño optimizado para no hacer scroll */}
                <div className="w-full max-w-[540px] animate-in fade-in slide-in-from-bottom-4 duration-700 mt-8 sm:mt-0">
                    <div className="relative group">
                        {/* Brillo detrás de la tarjeta */}
                        <div className="absolute -inset-0.5 bg-gradient-to-b from-white/10 to-transparent rounded-[2.1rem] blur opacity-20 transition duration-500" />

                        <div className="relative bg-zinc-900/80 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-6 sm:p-8 shadow-3xl">
                            {result ? (
                                // ESTADO DE ÉXITO
                                <div className="text-center py-4 animate-in fade-in zoom-in duration-500">
                                    <div className="relative w-20 h-20 mx-auto mb-6">
                                        <div className="absolute inset-0 bg-yellow-500/20 rounded-full blur-2xl animate-pulse" />
                                        <div className="relative w-20 h-20 bg-zinc-950 border border-yellow-500/30 rounded-full flex items-center justify-center">
                                            <CheckCircle2 className="w-10 h-10 text-yellow-500" />
                                        </div>
                                    </div>
                                    <h3 className="text-2xl font-bold text-white mb-2 tracking-tight">¡Petición recibida!</h3>
                                    <p className="text-zinc-400 text-sm leading-relaxed mb-8">
                                        Gracias por confiar en KUPO. Un experto de nuestro equipo te contactará en breve para configurar tu sistema a medida.
                                    </p>
                                    <Link href="/login" className="flex w-full items-center justify-center px-6 py-3.5 font-bold text-zinc-950 bg-white rounded-xl hover:bg-zinc-200 active:scale-[0.98] transition-all">
                                        Entendido
                                    </Link>
                                </div>
                            ) : (
                                // FORMULARIO DE SOLICITUD
                                <>
                                    <div className="mb-5 text-left">
                                        <h1 className="text-2xl sm:text-3xl font-unbounded font-bold text-yellow-500 mb-2 tracking-tight">Da el salto digital</h1>
                                        <p className="text-zinc-400 text-sm leading-relaxed">
                                            Déjanos tus datos. Nos encargamos de preparar todo el sistema.
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 w-full">
                                        {/* Nombre Completo */}
                                        <div className="space-y-1">
                                            <label className="block font-unbounded text-xs font-bold text-zinc-500 ml-1 ">Tu Nombre</label>
                                            <div className="relative group/input">
                                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                                    <User className="h-4 w-4 text-zinc-600 group-focus-within/input:text-yellow-500 transition-colors" />
                                                </div>
                                                <input
                                                    type="text"
                                                    required
                                                    className="w-full pl-10 pr-4 py-3 text-sm bg-zinc-950/50 border border-zinc-800 rounded-xl focus:border-yellow-500/50 focus:ring-4 focus:ring-yellow-500/5 outline-none transition-all text-white placeholder:text-zinc-600"
                                                    placeholder="Carlos Martínez"
                                                    onChange={(e) => setNewBusiness({ ...newBusiness, name: e.target.value })}
                                                />
                                            </div>
                                        </div>

                                        {/* Nombre del Negocio */}
                                        <div className="space-y-1">
                                            <label className="block font-unbounded text-xs font-bold text-zinc-500 ml-1 ">Negocio</label>
                                            <div className="relative group/input">
                                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                                    <Store className="h-4 w-4 text-zinc-600 group-focus-within/input:text-yellow-500 transition-colors" />
                                                </div>
                                                <input
                                                    type="text"
                                                    required
                                                    className="w-full pl-10 pr-4 py-3 text-sm bg-zinc-950/50 border border-zinc-800 rounded-xl focus:border-yellow-500/50 focus:ring-4 focus:ring-yellow-500/5 outline-none transition-all text-white placeholder:text-zinc-600"
                                                    placeholder="Barbería Elegance"
                                                    onChange={(e) => setNewBusiness({ ...newBusiness, business_name: e.target.value })}
                                                />
                                            </div>
                                        </div>

                                        {/* Email */}
                                        <div className="space-y-1">
                                            <label className="block font-unbounded text-xs font-bold text-zinc-500 ml-1 ">Email</label>
                                            <div className="relative group/input">
                                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                                    <Mail className="h-4 w-4 text-zinc-600 group-focus-within/input:text-yellow-500 transition-colors" />
                                                </div>
                                                <input
                                                    type="email"
                                                    required
                                                    className="w-full pl-10 pr-4 py-3 text-sm bg-zinc-950/50 border border-zinc-800 rounded-xl focus:border-yellow-500/50 focus:ring-4 focus:ring-yellow-500/5 outline-none transition-all text-white placeholder:text-zinc-600"
                                                    placeholder="correo@ejemplo.com"
                                                    onChange={(e) => setNewBusiness({ ...newBusiness, email: e.target.value })}
                                                />
                                            </div>
                                        </div>

                                        {/* Teléfono */}
                                        <div className="space-y-1">
                                            <label className="block font-unbounded text-xs font-bold text-zinc-500 ml-1 ">Teléfono</label>
                                            <div className="relative group/input">
                                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                                    <Phone className="h-4 w-4 text-zinc-600 group-focus-within/input:text-yellow-500 transition-colors" />
                                                </div>
                                                <input
                                                    type="tel"
                                                    required
                                                    className="w-full pl-10 pr-4 py-3 text-sm bg-zinc-950/50 border border-zinc-800 rounded-xl focus:border-yellow-500/50 focus:ring-4 focus:ring-yellow-500/5 outline-none transition-all text-white placeholder:text-zinc-600"
                                                    placeholder="+34 600 000 000"
                                                    onChange={(e) => setNewBusiness({ ...newBusiness, phone: e.target.value })}
                                                />
                                            </div>
                                        </div>

                                        <button
                                            type="button"
                                            disabled={isLoading}
                                            className="w-full sm:col-span-2 group relative flex items-center justify-center px-4 py-3.5 font-bold text-zinc-950 bg-yellow-500 rounded-xl hover:bg-yellow-400 disabled:opacity-50 transition-all shadow-[0_10px_20px_-10px_rgba(234,179,8,0.3)] active:scale-[0.98] overflow-hidden mt-2 sm:mt-4"
                                            onClick={async () => {
                                                try {
                                                    setIsLoading(true)
                                                    const response = await newBusinessImplementation(newBusiness)

                                                    if (response.error) {
                                                        sileo.error({ title: response.error })
                                                        setIsLoading(false)
                                                        setResult(false)
                                                        return
                                                    }
                                                    if (response.success) {
                                                        sileo.success({
                                                            title: 'Solicitud enviada con éxito',
                                                            description: '¡Enseguida nos pondremos en contacto contigo!'
                                                        })
                                                        setIsLoading(false)
                                                        setResult(true)
                                                        return
                                                    }
                                                } catch {
                                                    sileo.error({ title: 'Error interno, vuelve a intentarlo' })
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

            {/* COLUMNA DERECHA: Completamente vacía (solo ocupa el espacio en el grid en pantallas grandes) */}
            {/* COLUMNA DERECHA: REDISEÑO TOTAL (Cinematic Dark) */}
            <div className="hidden lg:flex relative h-full w-full flex-col justify-center items-center  bg-linear-to-r from-zinc-950 to-yellow-500/30 overflow-hidden p-12">

                {/* 1. Iluminación de fondo (Spotlight Effect) */}
                <div className="absolute top-0 right-0 w-500px h-500px bg-yellow-500/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 right-0 w-500px h-500px bg-yellow-600/10 rounded-full blur-[120px] translate-y-1/2 translate-x-1/2" />

                {/* 3. Contenedor Central Flotante */}
                <div className="relative z-10 w-full max-w-md stagger-container animate-float">

                    {/* Tarjeta Visual Abstracta (Simulación de Dashboard) */}
                    <div className="bg-zinc-900/60 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl shadow-black/50 relative overflow-hidden group hover:scale-[1.02] transition-transform duration-500">
                        {/* Glow interno al hacer hover */}
                        <div className="absolute inset-0 bg-linear-to-tr from-yellow-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                        <div className="space-y-6 relative z-10">
                            {/* Icono flotante */}
                            <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-yellow-400 to-yellow-600 flex items-center justify-center shadow-lg shadow-yellow-500/20">
                                <TrendingUp className="text-zinc-900 w-6 h-6" strokeWidth={3} />
                            </div>

                            <div className="space-y-2">
                                <h3 className="text-2xl font-unbounded font-semibold text-white leading-tight">
                                    Maximiza tu <br />
                                    <span className="text-yellow-500">eficiencia operativa</span>
                                </h3>
                                <p className="text-zinc-400 text-sm leading-relaxed">
                                    Gestiona reservas y clientes en tiempo real con <strong className="text-yellow-500 font-unbounded">KUPO</strong>, el sistema diseñado para negocios de alto rendimiento.
                                </p>
                            </div>

                            {/* Mini Stats (Decoración visual) */}
                            <div className="grid grid-cols-2 gap-3 pt-2">
                                <div className="bg-zinc-950/50 rounded-xl p-3 border border-white/5">
                                    <div className="text-zinc-500 text-xs mb-1">Clientes hoy</div>
                                    <div className="text-emerald-500 font-mono font-bold text-lg flex items-center gap-2">
                                        +42 <span className="text-emerald-500 text-[10px] bg-emerald-500/10 px-1.5 py-0.5 rounded-full">▲ 12%</span>
                                    </div>
                                </div>
                                <div className="bg-zinc-950/50 rounded-xl p-3 border border-white/5">
                                    <div className="text-zinc-500 text-xs mb-1">Ingresos</div>
                                    <div className="font-mono text-emerald-500 flex items-center gap-2 font-bold text-lg">
                                        2400€ <span className="text-emerald-500 text-[10px] bg-emerald-500/10 px-1.5 py-0.5 rounded-full">▲ 46%</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Testimonio sutil debajo */}
                    

                </div>
            </div>
            <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes float {
          0%, 100% { transform: translateY(0) translateZ(50px); }
          50% { transform: translateY(-10px) translateZ(50px); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}} />

        </div>
    )
}