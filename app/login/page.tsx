'use client'

import Link from "next/link"
import { login } from "./actions"
import { ArrowRight, Loader2, Mail, KeyRound, TrendingUp, Star } from "lucide-react"
import { useFormStatus } from 'react-dom'
import { useActionState, useEffect } from "react"
import { sileo } from "sileo"
import Image from "next/image"

export default function LoginPage() {

    const [state, action] = useActionState(login, null)

    useEffect(() => {
        if (state?.error) {
            sileo.error({
                title: 'Credenciales inválidas',
                description: 'Por favor, verifica tu correo y contraseña.',
                fill: "black",
                styles: {
                    title: 'text-white font-bold',
                    description: 'text-white',
                },
            })
        }
    }, [state])

    return (
        // Usamos h-screen y overflow-hidden para garantizar que no haya scroll
        <div className="h-screen w-full grid lg:grid-cols-2 bg-zinc-950 overflow-hidden stagger-container">

            {/* COLUMNA IZQUIERDA: Formulario */}
            <div className="flex flex-col justify-center px-6 py-12 md:px-12 lg:px-24 relative h-full">
                {/* Fondo sutil izquierdo */}
                <div className="absolute top-0 left-0 w-full h-full bg-radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops)) from-zinc-900/40 via-zinc-950 to-zinc-950 -z-10" />

                {/* AUMENTADO: Ancho máximo de 400px a 480px y más espaciado vertical */}
                <div className="w-full max-w-480px mx-auto space-y-8 stagger-container">
                    
                    {/* Header: Tamaños aumentados */}
                    <div className="space-y-4">
                        <Link href="/" className="group inline-block">
                            {/* Logo más grande (w-12 h-12 -> w-14 h-14) */}
                            <div className="w-12 h-12 relative">
                                <Image 
                                    src='/icon.png'
                                    alt="Logo KUPO"
                                    fill
                                    className="object-cover rounded-xl "
                                />
                            </div>
                        </Link>
                        <div>
                            {/* Título más grande (text-3xl -> text-4xl) */}
                            <h1 className="text-3xl font-bold tracking-tight text-white">Bienvenido</h1>
                            {/* Subtítulo más grande (text-base -> text-lg) */}
                            <p className="text-zinc-400 text-lg mt-2">Accede a tu panel de control.</p>
                        </div>
                    </div>

                    {/* Formulario: Espaciado aumentado */}
                    <form className="space-y-6" action={action}>
                        <div className="space-y-6">
                            <div className="space-y-2">
                                {/* Label más grande (text-xs -> text-sm) */}
                                <label htmlFor="email" className="block text-sm font-semibold text-zinc-400 ml-1 uppercase tracking-wider">
                                    Correo electrónico
                                </label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        {/* Icono más grande (h-4 -> h-5) */}
                                        <Mail className="h-4 w-4 text-zinc-500 group-focus-within:text-yellow-500 transition-colors" />
                                    </div>
                                    {/* Input más grande (py-3 -> py-4, text-sm -> text-base, pl-11 -> pl-12) */}
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        autoComplete="email"
                                        required
                                        className="w-full pl-12 pr-4 py-3 bg-zinc-900/50 border border-zinc-800 rounded-xl focus:border-yellow-500 focus:ring-4 focus:ring-yellow-500/10 outline-none transition-all text-white placeholder:text-zinc-600 text-base font-medium"
                                        placeholder="nombre@negocio.com"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between ml-1">
                                    <label htmlFor="password" className="block text-sm font-semibold text-zinc-400 uppercase tracking-wider">
                                        Contraseña
                                    </label>
                                    <Link href="/login/forgot-password" className="text-sm font-medium text-yellow-500 hover:text-yellow-400 transition-colors">
                                        ¿Recuperar clave?
                                    </Link>
                                </div>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <KeyRound className="h-4 w-4 text-zinc-500 group-focus-within:text-yellow-500 transition-colors" />
                                    </div>
                                    <input
                                        id="password"
                                        name="password"
                                        type="password"
                                        autoComplete="current-password"
                                        required
                                        className="w-full pl-12 pr-4 py-3 bg-zinc-900/50 border border-zinc-800 rounded-xl focus:border-yellow-500 focus:ring-4 focus:ring-yellow-500/10 outline-none transition-all text-white placeholder:text-zinc-600 text-base font-medium"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>
                        </div>

                        <SubmitButton />
                    </form>

                    {/* Footer: Más separado y texto más grande */}
                    <div className="pt-6 border-t border-zinc-900">
                        <div className="flex items-center justify-between text-sm text-zinc-500">
                            <span>¿No tienes cuenta?</span>
                            <Link
                                href="/register"
                                className="font-bold text-zinc-300 hover:text-yellow-500 transition-colors flex items-center gap-2"
                            >
                                Solicitar mi sistema <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* COLUMNA DERECHA: REDISEÑO TOTAL (Cinematic Dark) */}
            <div className="hidden lg:flex relative h-full w-full flex-col justify-center items-center  bg-linear-to-r from-zinc-950 to-yellow-500/30 overflow-hidden p-12">

                {/* 1. Iluminación de fondo (Spotlight Effect) */}
                <div className="absolute top-0 right-0 w-500px h-500px bg-yellow-500/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 right-0 w-500px h-500px bg-yellow-600/10 rounded-full blur-[120px] translate-y-1/2 translate-x-1/2" />

                {/* 3. Contenedor Central Flotante */}
                <div className="relative z-10 w-full max-w-md stagger-container">

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
                                <h3 className="text-2xl font-bold text-white leading-tight">
                                    Maximiza tu <br />
                                    <span className="text-yellow-500">eficiencia operativa</span>
                                </h3>
                                <p className="text-zinc-400 text-sm leading-relaxed">
                                    Gestiona reservas y clientes en tiempo real con <strong className="text-yellow-500">KUPO</strong>, el sistema diseñado para negocios de alto rendimiento.
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
                    <div className="mt-8 flex items-center gap-4 px-2">
                        <div className="flex gap-2 text-left items-center">
                            <div className="flex text-primary-light mb-1">
                                {[1, 2, 3, 4, 5].map(s => <Star key={s} className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-yellow-500 fill-current" />)}
                            </div>
                            <div className="text-sm text-zinc-500 font-medium">
                                Confiado por  <strong className="text-yellow-500">+500 negocios</strong> en España
                            </div>
                        </div>

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
            className="w-full relative overflow-hidden flex items-center justify-center px-4 py-3.5 font-bold text-zinc-950 bg-yellow-500 rounded-xl hover:bg-yellow-400 focus:outline-none focus:ring-4 focus:ring-yellow-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-yellow-500/10 active:scale-[0.98] group"
        >
            {pending ? (
                <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin text-zinc-900" />
                </>
            ) : (
                <>
                    <span className="relative z-10 text-sm">Entrar al Panel</span>
                    <ArrowRight className="w-4 h-4 ml-2 relative z-10 group-hover:translate-x-1 transition-transform" />
                </>
            )}
        </button>
    )
}