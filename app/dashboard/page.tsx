import { Calendar, User, TrendingUp, Clock } from "lucide-react"

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      
      {/* Header de la sección */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
            <h1 className="text-3xl font-bold text-white">Hola, Javier 👋</h1>
            <p className="text-zinc-400 mt-1">Aquí tienes el resumen de tu negocio hoy.</p>
        </div>
        <button className="bg-yellow-500 text-zinc-950 font-bold px-6 py-2.5 rounded-xl hover:bg-yellow-400 transition-colors shadow-lg shadow-yellow-500/20 active:scale-95">
            + Nueva Reserva
        </button>
      </div>

      {/* Stats Grid (Estilo Industrial Glass) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
            title="Citas Hoy" 
            value="12" 
            icon={Calendar} 
            trend="+2" 
            trendUp={true} 
        />
         <StatCard 
            title="Clientes Nuevos" 
            value="3" 
            icon={User} 
            trend="+15%" 
            trendUp={true} 
        />
         <StatCard 
            title="Ingresos Estimados" 
            value="450€" 
            icon={TrendingUp} 
            trend="+8%" 
            trendUp={true} 
        />
         <StatCard 
            title="Próxima Cita" 
            value="16:30" 
            subtitle="Alex M."
            icon={Clock} 
            type="neutral"
        />
      </div>

      {/* Área de contenido (Placeholder para la agenda o lista) */}
      <div className="bg-zinc-900/50 border border-white/5 rounded-3xl p-8 min-h-[400px] flex items-center justify-center text-zinc-500">
            <p>Aquí irá el componente de la Agenda Semanal</p>
      </div>

    </div>
  )
}

// Componente pequeño para las tarjetas de estadísticas
function StatCard({ title, value, subtitle, icon: Icon, trend, trendUp, type = "default" }: any) {
    return (
        <div className="bg-zinc-900/50 backdrop-blur-sm border border-white/5 p-6 rounded-2xl hover:border-yellow-500/20 transition-colors group">
            <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 rounded-lg bg-zinc-950 border border-white/5 flex items-center justify-center text-zinc-400 group-hover:text-yellow-500 transition-colors">
                    <Icon className="w-5 h-5" />
                </div>
                {trend && (
                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${trendUp ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
                        {trend}
                    </span>
                )}
            </div>
            <div>
                <p className="text-zinc-500 text-sm font-medium">{title}</p>
                <div className="flex items-baseline gap-2 mt-1">
                    <h3 className="text-2xl font-bold text-white">{value}</h3>
                    {subtitle && <span className="text-sm text-zinc-400">{subtitle}</span>}
                </div>
            </div>
        </div>
    )
}