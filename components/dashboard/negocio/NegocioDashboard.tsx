'use client'

import { useState, useEffect } from 'react'
import { 
    DollarSign, CalendarCheck, Ban, TrendingUp, TrendingDown, 
    CreditCard, Scissors, Users, Crown, CalendarDays, User,
    Phone,
    Euro
} from 'lucide-react'
import { 
    LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, 
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts'
import Image from 'next/image'
import { getDashboardData } from '@/app/dashboard/negocio/actions' 

const COLORS = ['#eab308', '#10b981', '#3b82f6', '#8b5cf6', '#f43f5e'] 

export default function NegocioDashboard() {
    const [timeRange, setTimeRange] = useState('1_semana')
    const [isLoading, setIsLoading] = useState(true)
    const [data, setData] = useState<any>(null)

    useEffect(() => {
        let isMounted = true
        setIsLoading(true)
        
        getDashboardData(timeRange).then(res => {
            if (isMounted && res.success && res.data) {
                setData(res.data)
            }
            if (isMounted) setIsLoading(false)
        })

        return () => { isMounted = false }
    }, [timeRange])

    // ==========================================
    // 💀 SKELETON UI (PANTALLA DE CARGA)
    // ==========================================
    if (isLoading || !data) {
        return (
            <div className="space-y-6 animate-in fade-in duration-300 pb-10">
                {/* Cabecera Skeleton */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-zinc-800 pb-6">
                    <div>
                        <div className="h-8 w-48 bg-zinc-800/50 rounded-lg animate-pulse" />
                        <div className="h-4 w-64 bg-zinc-800/50 rounded-md animate-pulse mt-3" />
                    </div>
                    <div className="h-10 w-full sm:w-48 bg-zinc-800/50 rounded-xl animate-pulse" />
                </div>

                {/* KPIs Skeleton */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="bg-zinc-900 border border-zinc-800 p-4 sm:p-5 rounded-2xl flex flex-col h-full min-h-[130px] sm:min-h-[140px]">
                            <div className="flex justify-between items-start">
                                <div>
                                    <div className="h-3 w-16 sm:w-24 bg-zinc-800/50 rounded-md animate-pulse mb-3" />
                                    <div className="h-6 sm:h-8 w-20 sm:w-32 bg-zinc-800/50 rounded-lg animate-pulse" />
                                </div>
                                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-zinc-800/50 rounded-xl animate-pulse" />
                            </div>
                            <div className="mt-auto h-5 sm:h-6 w-20 sm:w-28 bg-zinc-800/50 rounded-md animate-pulse" />
                        </div>
                    ))}
                </div>

                {/* Gráfico Principal Skeleton */}
                <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl w-full">
                    <div className="mb-6 flex justify-between items-center">
                        <div>
                            <div className="h-6 w-48 bg-zinc-800/50 rounded-lg animate-pulse mb-2" />
                            <div className="h-4 w-64 bg-zinc-800/50 rounded-md animate-pulse" />
                        </div>
                        <div className="w-10 h-10 bg-zinc-800/50 rounded-lg animate-pulse" />
                    </div>
                    <div className="h-[300px] w-full bg-zinc-800/30 rounded-xl animate-pulse" />
                </div>

                {/* Distribución Skeleton */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl lg:col-span-1">
                        <div className="h-6 w-32 bg-zinc-800/50 rounded-lg animate-pulse mb-2" />
                        <div className="h-4 w-40 bg-zinc-800/50 rounded-md animate-pulse mb-6" />
                        <div className="h-[200px] w-full bg-zinc-800/30 rounded-xl animate-pulse" />
                    </div>
                    <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl lg:col-span-2">
                        <div className="h-6 w-40 bg-zinc-800/50 rounded-lg animate-pulse mb-2" />
                        <div className="h-4 w-48 bg-zinc-800/50 rounded-md animate-pulse mb-6" />
                        <div className="flex flex-col sm:flex-row items-center gap-6 h-[200px]">
                            <div className="w-[200px] h-[200px] bg-zinc-800/30 rounded-full animate-pulse shrink-0" />
                            <div className="w-full flex flex-col justify-center gap-3">
                                {[1, 2, 3, 4].map(i => <div key={i} className="h-10 w-full bg-zinc-800/50 rounded-lg animate-pulse" />)}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    // ==========================================
    // 📊 DATOS REALES (COMPONENTE PRINCIPAL)
    // ==========================================
    const { kpis, ingresosGrafico, serviciosEstrella, rendimientoEquipo, diasFuertes, topClientes } = data

    const maxIngresosEquipo = rendimientoEquipo.length > 0 
        ? Math.max(...rendimientoEquipo.map((s: any) => s.ingresos)) 
        : 0;

    return (
        <div className="space-y-6 animate-in fade-in duration-300 pb-10">
            
            {/* --- CABECERA --- */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-zinc-800 pb-6">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Mi Negocio</h1>
                    <p className="text-zinc-400 mt-1">Métricas calculadas en tiempo real.</p>
                </div>
                
                <div className="flex items-center gap-3 bg-zinc-900 border border-zinc-800 p-2 rounded-xl w-full sm:w-auto shadow-sm hover:border-zinc-700 transition-colors focus-within:border-yellow-500">
                    <CalendarDays size={18} className="text-zinc-400 ml-2 shrink-0" />
                    <select 
                        value={timeRange}
                        onChange={(e) => setTimeRange(e.target.value)}
                        className="bg-transparent text-sm font-bold text-white outline-none w-full sm:w-48 cursor-pointer appearance-none"
                    >
                        <option value="1_dia" className="bg-zinc-900">Último Día (Hoy)</option>
                        <option value="3_dias" className="bg-zinc-900">Últimos 3 Días</option>
                        <option value="1_semana" className="bg-zinc-900">Última Semana</option>
                        <option value="1_mes" className="bg-zinc-900">Último Mes</option>
                        <option value="3_meses" className="bg-zinc-900">Últimos 3 Meses</option>
                        <option value="6_meses" className="bg-zinc-900">Últimos 6 Meses</option>
                        <option value="1_ano" className="bg-zinc-900">Último Año</option>
                    </select>
                </div>
            </div>

            {/* --- BLOQUE 1: KPIs (2x2 en móvil) --- */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                {/* 1. Ingresos */}
                <div className="bg-zinc-900 border border-zinc-800 p-4 sm:p-5 rounded-2xl relative overflow-hidden group hover:border-zinc-700 transition-colors flex flex-col h-full min-h-[130px] sm:min-h-[140px]">
                    <div className="flex justify-between items-start relative z-10">
                        <div>
                            <p className="text-zinc-500 text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-1 line-clamp-1">Ingresos</p>
                            <h3 className="text-2xl sm:text-3xl font-black text-yellow-500">{kpis.ingresos.toFixed(2)}€</h3>
                        </div>
                        <div className="p-1.5 sm:p-2 bg-yellow-500/10 rounded-xl text-yellow-500 group-hover:scale-110 transition-transform"><Euro size={18} className="sm:w-5 sm:h-5" /></div>
                    </div>
                    <div className={`mt-auto flex items-center text-[10px] sm:text-xs font-bold gap-1 w-fit px-1.5 py-1 sm:px-2 sm:py-1 rounded-md ${kpis.ingresosCrecimiento >= 0 ? 'text-emerald-500 bg-emerald-500/10' : 'text-red-500 bg-red-500/10'}`}>
                        {kpis.ingresosCrecimiento >= 0 ? <TrendingUp size={12} className="sm:w-3.5 sm:h-3.5" /> : <TrendingDown size={12} className="sm:w-3.5 sm:h-3.5" />} 
                        {kpis.ingresosCrecimiento > 0 ? '+' : ''}{kpis.ingresosCrecimiento.toFixed(1)}%
                    </div>
                </div>

                {/* 2. Citas Completadas */}
                <div className="bg-zinc-900 border border-zinc-800 p-4 sm:p-5 rounded-2xl relative overflow-hidden group hover:border-zinc-700 transition-colors flex flex-col h-full min-h-[130px] sm:min-h-[140px]">
                    <div className="flex justify-between items-start relative z-10">
                        <div>
                            <p className="text-zinc-500 text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-1 line-clamp-1">Completadas</p>
                            <h3 className="text-2xl sm:text-3xl font-black text-white">{kpis.completadas}</h3>
                        </div>
                        <div className="p-1.5 sm:p-2 bg-emerald-500/10 rounded-xl text-emerald-500 group-hover:scale-110 transition-transform"><CalendarCheck size={18} className="sm:w-5 sm:h-5" /></div>
                    </div>
                    <div className={`mt-auto flex items-center text-[10px] sm:text-xs font-bold gap-1 w-fit px-1.5 py-1 sm:px-2 sm:py-1 rounded-md ${kpis.completadasCrecimiento >= 0 ? 'text-emerald-500 bg-emerald-500/10' : 'text-red-500 bg-red-500/10'}`}>
                        {kpis.completadasCrecimiento >= 0 ? <TrendingUp size={12} className="sm:w-3.5 sm:h-3.5" /> : <TrendingDown size={12} className="sm:w-3.5 sm:h-3.5" />} 
                        {kpis.completadasCrecimiento > 0 ? '+' : ''}{kpis.completadasCrecimiento.toFixed(1)}%
                    </div>
                </div>

                {/* 3. Tasa Cancelación */}
                <div className="bg-zinc-900 border border-zinc-800 p-4 sm:p-5 rounded-2xl relative overflow-hidden group hover:border-zinc-700 transition-colors flex flex-col h-full min-h-[130px] sm:min-h-[140px]">
                    <div className="flex justify-between items-start relative z-10">
                        <div>
                            <p className="text-zinc-500 text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-1 line-clamp-1">Canceladas</p>
                            <h3 className="text-2xl sm:text-3xl font-black text-white">{kpis.tasaCancelacion.toFixed(1)}%</h3>
                        </div>
                        <div className="p-1.5 sm:p-2 bg-red-500/10 rounded-xl text-red-500 group-hover:scale-110 transition-transform"><Ban size={18} className="sm:w-5 sm:h-5" /></div>
                    </div>
                    <div className={`mt-auto flex items-center text-[10px] sm:text-xs font-bold gap-1 w-fit px-1.5 py-1 sm:px-2 sm:py-1 rounded-md ${kpis.tasaCancelacionCrecimiento <= 0 ? 'text-emerald-500 bg-emerald-500/10' : 'text-red-500 bg-red-500/10'}`}>
                        {kpis.tasaCancelacionCrecimiento <= 0 ? <TrendingDown size={12} className="sm:w-3.5 sm:h-3.5" /> : <TrendingUp size={12} className="sm:w-3.5 sm:h-3.5" />} 
                        {kpis.tasaCancelacionCrecimiento > 0 ? '+' : ''}{kpis.tasaCancelacionCrecimiento.toFixed(1)}%
                    </div>
                </div>

                {/* 4. Ticket Medio */}
                <div className="bg-zinc-900 border border-zinc-800 p-4 sm:p-5 rounded-2xl relative overflow-hidden group hover:border-zinc-700 transition-colors flex flex-col h-full min-h-[130px] sm:min-h-[140px]">
                    <div className="flex justify-between items-start relative z-10">
                        <div>
                            <p className="text-zinc-500 text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-1 line-clamp-1">Ticket Medio</p>
                            <h3 className="text-2xl sm:text-3xl font-black text-white">{kpis.ticketMedio.toFixed(2)}€</h3>
                        </div>
                        <div className="p-1.5 sm:p-2 bg-blue-500/10 rounded-xl text-blue-500 group-hover:scale-110 transition-transform"><CreditCard size={18} className="sm:w-5 sm:h-5" /></div>
                    </div>
                    <div className={`mt-auto flex items-center text-[10px] sm:text-xs font-bold gap-1 w-fit px-1.5 py-1 sm:px-2 sm:py-1 rounded-md ${kpis.ticketMedioCrecimiento >= 0 ? 'text-emerald-500 bg-emerald-500/10' : 'text-red-500 bg-red-500/10'}`}>
                        {kpis.ticketMedioCrecimiento >= 0 ? <TrendingUp size={12} className="sm:w-3.5 sm:h-3.5" /> : <TrendingDown size={12} className="sm:w-3.5 sm:h-3.5" />} 
                        {kpis.ticketMedioCrecimiento > 0 ? '+' : ''}{kpis.ticketMedioCrecimiento.toFixed(1)}%
                    </div>
                </div>
            </div>

            {/* --- BLOQUE 2: GRÁFICO PRINCIPAL 100% WIDTH --- */}
            <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl w-full">
                <div className="mb-6 flex justify-between items-center">
                    <div>
                        <h3 className="text-lg font-bold text-white">Evolución de Ingresos</h3>
                        <p className="text-sm text-zinc-500">Curva de facturación confirmada en este periodo.</p>
                    </div>
                    <div className="p-2 bg-zinc-950 rounded-lg"><TrendingUp size={20} className="text-zinc-500" /></div>
                </div>
                <div className="h-[300px] w-full">
                    {ingresosGrafico && ingresosGrafico.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={ingresosGrafico} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                                <XAxis dataKey="name" stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `${val}€`} />
                                <Tooltip cursor={{ stroke: '#27272a', strokeWidth: 1 }} contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', borderRadius: '12px' }} />
                                <Line type="monotone" dataKey="actual" name="Actual" stroke="#eab308" strokeWidth={3} dot={{ r: 3 }} activeDot={{ r: 6 }} />
                                <Line type="monotone" dataKey="pasado" name="Anterior" stroke="#3f3f46" strokeWidth={2} dot={false} strokeDasharray="5 5" />
                            </LineChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="h-full flex items-center justify-center text-zinc-600 border border-dashed border-zinc-800 rounded-xl">Sin datos de ingresos completados</div>
                    )}
                </div>
            </div>

            {/* --- BLOQUE 3: DISTRIBUCIÓN --- */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Días Fuertes */}
                <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl flex flex-col lg:col-span-1">
                    <div className="mb-6">
                        <h3 className="text-lg font-bold text-white">Días Fuertes</h3>
                        <p className="text-sm text-zinc-500">Volumen por día.</p>
                    </div>
                    <div className="flex-1 min-h-[200px] w-full">
                        {diasFuertes && diasFuertes.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={diasFuertes} margin={{ top: 0, right: 0, left: -25, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                                    <XAxis dataKey="name" stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} className='capitalize' />
                                    <YAxis stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
                                    <Tooltip cursor={{ fill: '#27272a' }} contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', borderRadius: '12px' }} />
                                    <Bar dataKey="citas" name="Citas" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={20} />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex items-center justify-center text-zinc-600 border border-dashed border-zinc-800 rounded-xl">Sin datos</div>
                        )}
                    </div>
                </div>

                {/* Servicios Estrella */}
                <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl flex flex-col lg:col-span-2">
                    <div className="mb-4">
                        <h3 className="text-lg font-bold text-white">Servicios Estrella</h3>
                        <p className="text-sm text-zinc-500">¿Qué compran tus clientes?</p>
                    </div>
                    <div className="flex-1 min-h-[200px] w-full relative flex flex-col sm:flex-row items-center gap-6">
                        {serviciosEstrella && serviciosEstrella.length > 0 ? (
                            <>
                                <div className="w-full sm:w-1/2 h-[200px] relative">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie data={serviciosEstrella} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value" stroke="none">
                                                {serviciosEstrella.map((_: any, index: number) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                                            </Pie>
                                            <Tooltip 
                                                itemStyle={{ color: '#ffffff' }}
                                                contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', borderRadius: '12px' }} 
                                            />
                                        </PieChart>
                                    </ResponsiveContainer>
                                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                        <Scissors className="text-zinc-600" size={28} />
                                    </div>
                                </div>
                                <div className="w-full sm:w-1/2 flex flex-col gap-3 justify-center">
                                    {serviciosEstrella.map((service: any, idx: number) => (
                                        <div key={idx} className="flex justify-between items-center text-sm bg-zinc-950 p-2.5 rounded-lg border border-zinc-800/50">
                                            <div className="flex items-center gap-2">
                                                <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                                                <span className="text-zinc-200 font-bold truncate max-w-[150px]">{service.name}</span>
                                            </div>
                                            <span className="text-zinc-500 font-medium">{service.value} res.</span>
                                        </div>
                                    ))}
                                </div>
                            </>
                        ) : (
                            <div className="h-full w-full flex items-center justify-center text-zinc-600 border border-dashed border-zinc-800 rounded-xl">Sin datos</div>
                        )}
                    </div>
                </div>
            </div>

            {/* --- BLOQUE 4: EQUIPO Y VIPs --- */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Rendimiento Equipo */}
                <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl flex flex-col">
                    <div className="mb-6 flex justify-between items-center border-b border-zinc-800/50 pb-4">
                        <div>
                            <h3 className="text-lg font-bold text-white">Rendimiento Equipo</h3>
                            <p className="text-sm text-zinc-500">Facturación generada por empleado.</p>
                        </div>
                        <div className="p-2 bg-zinc-950 rounded-lg"><Users size={20} className="text-zinc-500" /></div>
                    </div>
                    
                    <div className="flex-1 space-y-5">
                        {rendimientoEquipo && rendimientoEquipo.length > 0 ? (
                            rendimientoEquipo.map((staff: any, idx: number) => {
                                const percentage = maxIngresosEquipo > 0 ? (staff.ingresos / maxIngresosEquipo) * 100 : 0;
                                return (
                                    <div key={idx} className="flex items-center gap-4 group">
                                        {/* Avatar */}
                                        <div className="relative w-12 h-12 rounded-full overflow-hidden bg-zinc-950 border border-zinc-700 shrink-0 flex items-center justify-center">
                                            {staff.avatar ? (
                                                <Image src={staff.avatar} alt={staff.name} fill className="object-cover" />
                                            ) : (
                                                <User className="text-zinc-600" size={20} />
                                            )}
                                        </div>
                                        
                                        {/* Barras de progreso e Info */}
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start sm:items-end mb-1.5 gap-2">
                                                <span className="font-bold text-zinc-200 text-sm sm:text-base truncate">{staff.name}</span>
                                                <div className="flex flex-col items-end sm:flex-row sm:items-baseline sm:gap-1.5 shrink-0">
                                                    <span className="font-black text-yellow-500 text-sm sm:text-base leading-none">
                                                        {staff.ingresos.toFixed(2)}€
                                                    </span>
                                                    <span className="text-zinc-500 text-[10px] sm:text-xs font-medium leading-none mt-1 sm:mt-0">
                                                        ({staff.citas} res)
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="h-2.5 w-full bg-zinc-950 rounded-full overflow-hidden border border-zinc-800/50">
                                                <div 
                                                    className="h-full bg-yellow-500 rounded-full transition-all duration-1000 ease-out" 
                                                    style={{ width: `${percentage}%` }} 
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )
                            })
                        ) : (
                            <div className="h-full min-h-[200px] flex items-center justify-center text-zinc-600 border border-dashed border-zinc-800 rounded-xl">Sin facturación confirmada</div>
                        )}
                    </div>
                </div>

                {/* Top Clientes VIP */}
                <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl flex flex-col">
                    <div className="mb-6 flex justify-between items-center border-b border-zinc-800/50 pb-4">
                        <div>
                            <h3 className="text-lg font-bold text-white">Top Clientes</h3>
                            <p className="text-sm text-zinc-500">Los clientes más rentables.</p>
                        </div>
                        <Crown className="text-yellow-500" />
                    </div>
                    
                    <div className="flex-1 overflow-x-auto">
                        {topClientes && topClientes.length > 0 ? (
                            <table className="w-full text-left border-collapse whitespace-nowrap">
                                <thead>
                                    <tr className="border-b border-zinc-800/50 text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                                        <th className="pb-3 px-2 font-medium">Cliente</th>
                                        <th className="hidden sm:table-cell pb-3 px-2 font-medium text-center">Citas</th>
                                        <th className="pb-3 px-2 font-medium text-right">Gasto</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-zinc-800/50 text-sm">
                                    {topClientes.map((cliente: any, idx: number) => (
                                        <tr key={cliente.id} className="hover:bg-zinc-800/30 transition-colors">
                                            <td className="py-3 px-2">
                                                <div className="flex items-center gap-3">
                                                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${idx === 0 ? 'bg-yellow-500 text-zinc-900' : idx === 1 ? 'bg-zinc-300 text-zinc-900' : idx === 2 ? 'bg-amber-700 text-white' : 'bg-zinc-800 text-zinc-400'}`}>
                                                        {idx + 1}
                                                    </span>
                                                    <div>
                                                        <p className="font-bold text-zinc-200 leading-tight">{cliente.name}</p>
                                                        {cliente.phone ? (
                                                            <p className="text-[11px] text-zinc-400 mt-0.5 items-center flex gap-1"> <Phone className='w-2.5 h-2.5'/> {cliente.phone}</p>
                                                        ) : (
                                                            <p className="text-[10px] text-zinc-600 mt-0.5">Sin teléfono</p>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            {/* Ocultamos esta columna en móvil */}
                                            <td className="hidden sm:table-cell py-3 px-2 text-center align-middle">
                                                <span className="bg-zinc-950 border border-zinc-800 px-2.5 py-1 rounded-md text-zinc-300 font-medium">
                                                    {cliente.visits}
                                                </span>
                                            </td>
                                            <td className="py-3 px-2 text-right align-middle">
                                                <div className="flex flex-col items-end">
                                                    <span className="font-black text-emerald-500">{cliente.spent.toFixed(2)}€</span>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <div className="h-full flex items-center justify-center text-zinc-600 border border-dashed border-zinc-800 rounded-xl min-h-[200px]">No hay clientes en este periodo</div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    )
}