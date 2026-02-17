'use client'

import Link from "next/link"
import { usePathname } from "next/navigation"
import { CalendarDays, Users, Scissors, Settings, LogOut, Store, Briefcase, LayoutDashboard } from "lucide-react"
import { signOut } from "@/app/login/actions"

const menuItems = [
    { href: "/dashboard", label: "Dahsboard", icon: LayoutDashboard },
  { href: "/dashboard/agenda", label: "Agenda", icon: CalendarDays },
  { href: "/dashboard/clientes", label: "Clientes", icon: Users },
  { href: "/dashboard/servicios", label: "Servicios", icon: Scissors },
  { href: "/dashboard/equipo", label: "Equipo", icon: Briefcase },
  { href: "/dashboard/negocio", label: "Mi Negocio", icon: Store },
  { href: "/dashboard/ajustes", label: "Configuración", icon: Settings },
]

export function Sidebar({ businessName }: { businessName: string }) {
  const pathname = usePathname()

  return (
    <aside className="hidden md:flex flex-col w-64 bg-zinc-950 border-r border-white/5 h-screen fixed left-0 top-0 z-40 shadow-2xl shadow-black/50">
      
      {/* Header del Sidebar */}
      <div className="h-24 flex items-center px-8 border-b border-white/5">
        <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-500 rounded-xl flex items-center justify-center text-zinc-950 font-black text-xl shadow-lg shadow-yellow-500/20">
            {businessName.charAt(0).toUpperCase()}
            </div>
            <div className="flex flex-col overflow-hidden">
                <span className="font-bold text-white truncate text-base leading-tight">{businessName}</span>
                <span className="text-xs text-zinc-500 font-medium">Panel de control</span>
            </div>
        </div>
      </div>

      {/* Navegación */}
      <nav className="flex-1 px-4 py-8 space-y-1 overflow-y-auto">
        <p className="px-4 text-xs font-bold text-zinc-600 uppercase tracking-widest mb-4">Menu Principal</p>
        
        {menuItems.map((item) => {
          const isActive = pathname === item.href
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`group flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-medium transition-all duration-200 relative overflow-hidden ${
                isActive 
                  ? "bg-yellow-500/10 text-yellow-500 shadow-lg shadow-yellow-500/5" 
                  : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100"
              }`}
            >
              {/* Glow background on hover for non-active items */}
              {!isActive && <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />}
              
              <div className="flex items-center gap-3 relative z-10">
                <item.icon className={`w-5 h-5 transition-colors ${isActive ? "text-yellow-500" : "text-zinc-500 group-hover:text-zinc-300"}`} />
                {item.label}
              </div>

              {/* Indicador activo sutil */}
              {isActive && (
                 <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.8)]" />
              )}
            </Link>
          )
        })}
      </nav>

      {/* Footer del Sidebar (Perfil + Logout) */}
      <div className="p-4">
        <form action={async () => {
            // Server Action inline para cerrar sesión
            // Importante: Esto debe estar conectado a tu lógica de logout real
            // Por ahora llamaremos a una función que crearemos en el siguiente paso
             await signOut()
        }}>
          <button 
            type="submit"
            className="flex w-full items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium bg-red-600/10 text-red-600 hover:bg-red-600/20 transition-colors shadow-lg shadow-red-600/10"
          >
            <LogOut className="w-5 h-5" />
            Cerrar Sesión
          </button>
        </form>
      </div>
    </aside>
  )
}


