'use client'

import Link from "next/link"
import { usePathname } from "next/navigation"
import { CalendarDays, Users, Scissors, Settings, LogOut, Store, Briefcase, LayoutDashboard, Menu, Download, BellRing, PlusSquare, Share, X, ChevronDown } from "lucide-react"
import { signOut } from "@/app/login/actions"
import Image from "next/image"
import { useEffect, useState } from "react"
import { getRole } from "./actions"
import { usePWA } from "@/hooks/usePWA"

// 1. Dividimos el menú en principal (barra inferior) y secundario (panel "Más")
const MAIN_MENU = [
    { href: "/dashboard", label: "Inicio", icon: LayoutDashboard },
    { href: "/dashboard/agenda", label: "Agenda", icon: CalendarDays },
    { href: "/dashboard/equipo", label: "Equipo", icon: Briefcase },
]

const MORE_MENU = [
    { href: "/dashboard/clientes", label: "Clientes", icon: Users },
    { href: "/dashboard/servicios", label: "Servicios", icon: Scissors },
    { href: "/dashboard/negocio", label: "Negocio", icon: Store },
    { href: "/dashboard/ajustes", label: "Ajustes", icon: Settings },
]

// Rutas restringidas a Admins
const ADMIN_ONLY_ROUTES = [
    "/dashboard/negocio",
    "/dashboard/ajustes",
    "/dashboard/servicios"
]

export function Sidebar({ businessName }: { businessName: string }) {
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [role, setRole] = useState<string | null>(null)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false) // Estado para el panel "Más"
    const [appleModal, setAppleModal] = useState<boolean>(false)

    const pathname = usePathname()

    const { isInstallable, installPWA, isIOS, isStandalone } = usePWA()

    useEffect(() => {
        const fetchRole = async () => {
            try {
                setIsLoading(true)
                const response = await getRole()
                if (response.success && response.role) {
                    setRole(response.role)
                }
            } catch (error) {
                console.error('Error: ', error)
            } finally {
                setIsLoading(false)
            }
        }
        fetchRole()
    }, [])

    // Función auxiliar para saber si el usuario puede ver un item
    const canView = (href: string) => {
        if (role !== 'admin' && ADMIN_ONLY_ROUTES.includes(href)) return false;
        return true;
    }

    // Unimos todos para la vista de PC (Desktop)
    const ALL_MENU = [...MAIN_MENU, ...MORE_MENU]

    return (
        <>
            {/* ========================================== */}
            {/* 💻 VISTA ESCRITORIO (Sidebar Izquierdo) */}
            {/* ========================================== */}
            <aside className="hidden lg:flex flex-col w-64 bg-zinc-950 border-r border-white/5 h-screen fixed left-0 top-0 z-40 shadow-2xl shadow-black/50">

                {/* Header del Sidebar */}
                <div className="h-24 flex items-center px-8 border-b border-white/5">
                    <div className="flex items-center gap-3">
                        <Image src='/icon.png' alt="KUPO LOGO" height={40} width={40} />
                        <div className="flex flex-col overflow-hidden">
                            <span className="font-bold text-white truncate text-base leading-tight">{businessName}</span>
                            <span className="text-xs text-zinc-500 font-medium">Panel de control</span>
                        </div>
                    </div>
                </div>

                {/* Navegación Desktop */}
                <nav className="flex-1 px-4 py-8 space-y-1 overflow-y-auto">
                    <p className="px-4 text-xs font-bold text-zinc-600 uppercase tracking-widest mb-4">Menu Principal</p>

                    {isLoading ? (
                        <div className="space-y-2 px-4 animate-pulse">
                            {[1, 2, 3, 4, 5].map(i => <div key={i} className="h-10 w-full bg-zinc-900 rounded-xl" />)}
                        </div>
                    ) : (
                        ALL_MENU.map((item) => {
                            if (!canView(item.href)) return null
                            const isActive = pathname === item.href

                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`group flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-medium transition-all duration-200 relative overflow-hidden ${isActive ? "bg-yellow-500/10 text-yellow-500 shadow-lg shadow-yellow-500/5 border border-yellow-500/20" : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100"
                                        }`}
                                >
                                    {!isActive && <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />}
                                    <div className="flex items-center gap-3 relative z-10">
                                        <item.icon className={`w-5 h-5 transition-colors ${isActive ? "text-yellow-500" : "text-zinc-500 group-hover:text-zinc-300"}`} />
                                        {item.label}
                                    </div>
                                    {isActive && <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.8)]" />}
                                </Link>
                            )
                        })
                    )}
                </nav>

                {/* Footer del Sidebar (Perfil + Logout) */}
                <div className="p-4 flex flex-col gap-2 border-t border-white/5">
                    {isInstallable && (
                        <button onClick={installPWA} className="flex w-full items-center gap-3 px-4 py-2 rounded-xl text-sm font-medium bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20 border border-yellow-500/20 transition-colors cursor-pointer">
                            <Download className="w-5 h-5" />Instalar App
                        </button>
                    )}
                    <form action={async () => { await signOut() }}>
                        <button type="submit" className="flex w-full items-center gap-3 px-4 py-2 rounded-xl text-sm font-medium bg-red-600/10 text-red-600 hover:bg-red-600/20 border border-red-500/20 transition-colors cursor-pointer">
                            <LogOut className="w-5 h-5" /> Cerrar Sesión
                        </button>
                    </form>
                </div>
            </aside>


            {/* ========================================== */}
            {/* 📱 VISTA MÓVIL (Bottom Navigation Bar) */}
            {/* ========================================== */}
            <nav className="lg:hidden fixed bottom-0 left-0 w-full bg-zinc-950/95 backdrop-blur-xl border-t border-zinc-800 z-40 pb-safe">
                <div className="flex items-center justify-around px-2 py-2">

                    {/* Items Principales */}
                    {MAIN_MENU.map(item => {
                        if (!canView(item.href)) return null
                        const isActive = pathname === item.href
                        return (
                            <Link key={item.href} href={item.href} className="flex flex-col items-center gap-1 p-2 w-16 group relative">
                                <item.icon className={`w-6 h-6 transition-colors ${isActive ? "text-yellow-500" : "text-zinc-500 group-hover:text-zinc-300"}`} />
                                <span className={`text-[10px] font-medium transition-colors ${isActive ? "text-yellow-500" : "text-zinc-500 group-hover:text-zinc-300"}`}>
                                    {item.label}
                                </span>
                                {isActive && <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-1 bg-yellow-500 rounded-b-full shadow-[0_0_8px_rgba(234,179,8,0.8)]" />}
                            </Link>
                        )
                    })}

                    {/* Botón "Más" (Hamburguesa) */}
                    <button onClick={() => setIsMobileMenuOpen(true)} className="flex flex-col items-center gap-1 p-2 w-16 text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer">
                        <Menu className="w-6 h-6" />
                        <span className="text-[10px] font-medium">Más</span>
                    </button>

                </div>
            </nav>

            {/* ========================================== */}
            {/* 📱 PANEL "MÁS" MÓVIL (Bottom Sheet) */}
            {/* ========================================== */}
            {isMobileMenuOpen && (
                <div className="lg:hidden fixed inset-0 z-50 flex flex-col justify-end">
                    {/* Fondo oscuro desenfocado */}
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={() => setIsMobileMenuOpen(false)} />

                    {/* Panel Blanco/Oscuro deslizable */}
                    <div className="relative bg-zinc-900 border-t border-zinc-800 rounded-t-3xl p-6 pb-10 animate-in slide-in-from-bottom-full duration-300 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">

                        <div className="space-y-2">
                            {MORE_MENU.map(item => {
                                if (!canView(item.href)) return null
                                const isActive = pathname === item.href
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        onClick={() => setIsMobileMenuOpen(false)} // Cerrar al hacer clic
                                        className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all ${isActive ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20' : 'bg-zinc-950 border border-zinc-800/50 text-zinc-300 hover:border-zinc-700'
                                            }`}
                                    >
                                        <item.icon className="w-5 h-5" />
                                        {item.label}
                                    </Link>
                                )
                            })}
                        </div>

                        {/* Botón de Logout Móvil */}
                        <div className="mt-6 grid grid-cols-2 gap-2 pt-6 border-t border-zinc-800">
                            {isInstallable && (
                                <button onClick={installPWA} className="flex w-full justify-center items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 hover:bg-yellow-500/20 transition-colors cursor-pointer">
                                    <Download className="w-5 h-5" /> Instalar App
                                </button>
                            )}
                            {isIOS && !isStandalone && (
                                <button onClick={() => setAppleModal(true)} className="flex w-full justify-center items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 hover:bg-yellow-500/20 transition-colors cursor-pointer">
                                    <Download className="w-5 h-5" /> Instalar App
                                </button>
                            )}
                            <form action={async () => { await signOut() }}>
                                <button type="submit" className={"w-full flex justify-center items-center gap-2 px-4 py-3.5 rounded-2xl text-sm font-bold bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/20 transition-colors cursor-pointer"}>
                                    <LogOut className="w-5 h-5" /> Cerrar Sesión
                                </button>
                            </form>
                        </div>

                    </div>
                </div>
            )}
            {
                appleModal &&
                <div className="fixed inset-0 z-[99999] flex items-end justify-center sm:items-center p-4 bg-black/60 backdrop-blur-sm stagger-container text-left">
                    <div className="bg-zinc-900 w-full max-w-sm rounded-3xl shadow-2xl relative overflow-hidden border border-white/10 flex flex-col animate-in slide-in-from-bottom-10 sm:zoom-in-95 duration-300 p-6 stagger-container">

                        <button
                            onClick={() => setAppleModal(false)}
                            className="absolute top-4 right-4 p-2 bg-zinc-800 rounded-full text-zinc-400 hover:text-white transition-colors cursor-pointer"
                        >
                            <X size={18} />
                        </button>

                        <div className="flex flex-col items-center text-center mt-2">
                            <h3 className="text-2xl font-bold text-white mb-2">Instala la App</h3>
                            <p className="text-sm text-zinc-400 mb-6">
                                Para recibir recordatorios en tu iPhone, necesitas añadir esta página a tu pantalla de inicio.
                            </p>

                            <div className="w-full bg-zinc-950 p-4 rounded-2xl border border-white/5 space-y-4 text-left">
                                <div className="flex items-center gap-3 text-sm text-zinc-200 font-medium">
                                    <div className="bg-zinc-900 p-2 rounded-lg shadow-sm border border-white/5 text-yellow-500">
                                        <Share size={18} />
                                    </div>
                                    <span>1. Toca en el icono de <b>Compartir.</b></span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-zinc-200 font-medium">
                                    <div className="bg-zinc-900 p-2 rounded-lg shadow-sm border border-white/5 text-yellow-500">
                                        <ChevronDown size={18} />
                                    </div>
                                    <span>2. Toca en el icono de <b>Ver más.</b></span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-zinc-200 font-medium">
                                    <div className="bg-zinc-900 p-2 rounded-lg shadow-sm border border-white/5 text-yellow-500">
                                        <PlusSquare size={18} />
                                    </div>
                                    <span>3. Dale a <b>Añadir a inicio</b>.</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-zinc-200 font-medium">
                                    <div className="bg-zinc-900 p-2 rounded-lg shadow-sm border border-white/5 text-yellow-500">
                                        <BellRing size={18} />
                                    </div>
                                    <span>4. Abre la App, <b>pulsa el botón de notificaciones</b> y coloca el indicador en activo.</span>
                                </div>
                            </div>

                            <button
                                onClick={() => setAppleModal(false)}
                                className="mt-6 w-full py-3.5 rounded-xl font-bold text-zinc-950 bg-yellow-500 hover:bg-yellow-400 transition-colors cursor-pointer"
                            >
                                Entendido
                            </button>
                        </div>
                    </div>
                </div>
            }

        </>
    )
}