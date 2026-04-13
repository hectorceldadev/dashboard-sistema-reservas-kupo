'use client'

import { useState, useEffect } from 'react'
import { Plus, Search, Scissors, Clock, Edit2, Trash2, X, Check, Sparkles, AlignLeft, LoaderCircle, Euro } from 'lucide-react'
import { sileo } from 'sileo'
import { createService, deleteService, updateService } from '@/app/dashboard/servicios/actions'

// --- TIPOS BASADOS EN TU TABLA DE SUPABASE ---
export type Service = {
    id: string
    title: string
    short_desc: string | null
    full_desc: string | null
    duration: number
    price: number
    icon: string | null
    is_active: boolean
    features: string[] | null
    image_url: string | null
    slug?: string | null
    business_id?: string
    created_at?: string
    metadata?: any // Cambiado de JSON a any para evitar errores de tipado en React
}


interface ServiciosProps {
    servicios: Service[]
    profile: any
}

export function Servicios({ servicios, profile }: ServiciosProps) {
    // Si la BD viene vacía, usamos los Mocks temporalmente para ver la UI
    const [services, setServices] = useState<Service[]>(servicios && servicios.length > 0 ? servicios : [])
    const [searchTerm, setSearchTerm] = useState('')
    
    // Estados de Modales
    const [selectedService, setSelectedService] = useState<Service | null>(null) // Modal 1: Vista Detalle
    const [isModalOpen, setIsModalOpen] = useState(false) // Modal 2: Crear/Editar
    const [editingService, setEditingService] = useState<Service | null>(null)
    
    // Estados del Formulario
    const [formData, setFormData] = useState<Partial<Service>>({})
    const [newFeature, setNewFeature] = useState('')

    const [isSaving, setIsSaving] = useState<boolean>(false)
    const [isLoading, setIsLoading] = useState<boolean>(false)

    // Bloquear scroll cuando hay CUALQUIER modal abierto
    useEffect(() => {
        if (typeof document !== 'undefined') {
            document.body.style.overflow = (isModalOpen || selectedService) ? 'hidden' : ''
        }
        return () => { document.body.style.overflow = '' }
    }, [isModalOpen, selectedService])

    // Filtrado
    const filteredServices = services.filter((s: Service) => 
        s.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        (s.short_desc && s.short_desc.toLowerCase().includes(searchTerm.toLowerCase()))
    )

    // --- MANEJADORES ---
    const handleAdd = () => {
        setEditingService(null)
        setFormData({ is_active: true, features: [], duration: 30, price: 0 })
        setIsModalOpen(true)
    }

    const handleEdit = (service: Service, e: React.MouseEvent) => {
        e.stopPropagation() // Evita que se abra el modal de detalles al hacer click en Editar
        setEditingService(service)
        setFormData({ ...service, features: service.features || [] })
        setIsModalOpen(true)
        setSelectedService(null) // Cierra el de detalles si estuviera abierto
    }

    const addFeature = () => {
        if (!newFeature.trim()) return
        setFormData(prev => ({
            ...prev,
            features: [...(prev.features || []), newFeature.trim()]
        }))
        setNewFeature('')
    }

    const removeFeature = (indexToRemove: number) => {
        setFormData(prev => ({
            ...prev,
            features: (prev.features || []).filter((_, index) => index !== indexToRemove)
        }))
    }

    const handleSave = async () => {
        if (!formData.title || !formData.price || !formData.duration) {
            sileo.error({
                title: 'Datos inválidos',
                description: 'Por favor, rellena el nombre, precio y duración.'
            })
            return
        }

        setIsSaving(true)

        if (editingService) {
            const result = await updateService(editingService.id, {
                title: formData.title,
                short_desc: formData.short_desc || '',
                full_desc: formData.full_desc || '',
                duration: formData.duration,
                price: formData.price,
                is_active: formData.is_active ?? true,
                features: formData.features || []
            })

            if (!result) {
                sileo.error({
                    title: 'Actualización fallida',
                    description: 'Error actualizando el servicio en la base de datos.'
                })
            } else if (result.success) {
                sileo.success({
                    title: 'Actualizado con éxito',
                    description: 'Servicio actualizado correctamente.'
                })
                setServices(prev => prev.map(s => s.id === editingService.id ? { ...s, ...formData } as Service : s))
                setIsModalOpen(false)
            }
        } else {
            const result = await createService({
                title: formData.title,
                short_desc: formData.short_desc || '',
                full_desc: formData.full_desc || '',
                duration: formData.duration,
                price: formData.price,
                is_active: formData.is_active ?? true,
                features: formData.features || []
            })

            if (result.error) {
                sileo.error({
                    title: 'Error creando el servicio',
                    description: result.error
                })
            } else if (result.success) {
                sileo.success({
                    title: 'Creado con éxito',
                    description: 'Servicio creado correctamente.'
                })
                setServices(prev => [result.service, ...prev])
                setIsModalOpen(false)
            } 
        }
        setIsSaving(false)
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-300 pb-10 stagger-container">
            
            {/* Cabecera */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 stagger-container">
                <div>
                    <h1 className="text-2xl font-bold font-unbounded text-white tracking-tight">Servicios</h1>
                    <p className="text-zinc-400 mt-1 text-base sm:text-base">Configura los servicios que ofreces, precios y duraciones.</p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                    <div className="relative group flex-1 lg:min-w-[300px]">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-yellow-500 transition-colors" />
                        <input 
                            type="text" 
                            placeholder="Buscar servicio..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-11 pr-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-sm text-white focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 outline-none transition-all placeholder:text-zinc-500 shadow-sm"
                        />
                    </div>
                    {profile.role === 'admin' && (
                        <button 
                            onClick={handleAdd}
                            className="flex items-center justify-center gap-2 bg-yellow-500 text-zinc-950 px-5 py-2.5 rounded-xl font-bold text-sm font-unbounded hover:bg-yellow-400 transition-all shadow-lg shadow-yellow-500/10 active:scale-95 shrink-0 cursor-pointer"
                        >
                            <Plus size={18} /> Nuevo Servicio
                        </button>
                    )}
                </div>
            </div>

            <div className='h-[1px] w-full bg-zinc-800/50 rounded-full'></div>

            {/* CONTENEDOR PRINCIPAL: VISTA LISTA */}
            {filteredServices.length === 0 ? (
                <div className="bg-zinc-900/50 border border-dashed border-zinc-800 rounded-3xl p-12 text-center flex flex-col items-center justify-center">
                    <div className="w-16 h-16 bg-zinc-950 rounded-full flex items-center justify-center mb-4 border border-zinc-800">
                        <Scissors size={32} className="text-zinc-600" />
                    </div>
                    <p className="font-bold font-unbounded text-zinc-300 text-lg">No hay servicios configurados</p>
                    <p className="text-zinc-500 text-sm mt-1">Añade tu primer servicio para empezar a recibir reservas.</p>
                </div>
            ) : (
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-xl shadow-black/20">
                    
                    {/* --- VISTA MÓVIL (Tarjetas en Fila) --- */}
                    <div className="block md:hidden divide-y divide-zinc-800/50 stagger-container">
                        {filteredServices.map((service) => (
                            <div 
                                key={service.id}
                                onClick={() => setSelectedService(service)}
                                className="p-5 hover:bg-zinc-800/30 transition-colors cursor-pointer active:bg-zinc-800/50"
                            >
                                <div className="flex items-start justify-between gap-4 mb-3">
                                    <div className="flex items-center gap-4 flex-1 min-w-0">
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-inner ${service.is_active ? 'bg-zinc-950 border border-zinc-800 text-yellow-500' : 'bg-zinc-950/50 border border-zinc-800/50 text-zinc-600'}`}>
                                            <Scissors size={20} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className={`font-bold text-base font-unbounded truncate ${service.is_active ? 'text-white' : 'text-zinc-400'}`}>{service.title}</div>
                                            <div className="text-zinc-500 text-sm mt-0.5 truncate">{service.short_desc || 'Sin descripción corta'}</div>
                                        </div>
                                    </div>
                                    {profile.role === 'admin' && (
                                        <button onClick={(e) => handleEdit(service, e)} className="p-2 text-zinc-500 hover:text-yellow-500 hover:bg-yellow-500/10 rounded-lg transition-colors shrink-0">
                                            <Edit2 size={18} />
                                        </button>
                                    )}
                                </div>
                                
                                <div className="flex items-center justify-between text-base bg-zinc-950/50 p-3.5 rounded-lg border border-zinc-800/50">
                                    <div className="flex items-center gap-4 text-zinc-400">
                                        <span className="flex items-center gap-1.5"><Clock size={14} className="text-zinc-500" /> {service.duration} min</span>
                                        <span className="flex items-center gap-1.5 font-bold text-yellow-500"><Euro size={14} /> {service.price}€</span>
                                    </div>
                                    <span className={`text-xs font-bold uppercase tracking-wider px-2 py-1 rounded-md ${service.is_active ? 'bg-emerald-500/10 text-emerald-500' : 'bg-zinc-800 text-zinc-500'}`}>
                                        {service.is_active ? 'Activo' : 'Inactivo'}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* --- VISTA ESCRITORIO (Tabla Clásica) --- */}
                    <div className="hidden md:block overflow-x-auto">
                        <table className="w-full text-left border-collapse whitespace-nowrap">
                            <thead>
                                <tr className="border-b font-unbounded border-zinc-800 bg-zinc-950/50 text-xs font-semibold text-yellow-500 stagger-container">
                                    <th className="px-6 py-4 rounded-tl-2xl">Servicio</th>
                                    <th className="px-6 py-4">Duración</th>
                                    <th className="px-6 py-4">Precio</th>
                                    <th className="px-6 py-4 text-center">Estado</th>
                                    {
                                        profile.role === 'admin' ? (
                                            <th className="px-6 py-4 rounded-tr-2xl text-right">Acciones</th>
                                        ) : (
                                            <th className="px-6 py-4 rounded-tr-2xl text-right"></th>
                                        )
                                    }
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-800/50 text-sm stagger-container">
                                {filteredServices.map((service) => (
                                    <tr 
                                        key={service.id} 
                                        onClick={() => setSelectedService(service)}
                                        className="group hover:bg-zinc-800/30 transition-colors cursor-pointer"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors shadow-inner ${service.is_active ? 'bg-zinc-950 border border-zinc-700 text-yellow-500 group-hover:border-yellow-500/50' : 'bg-zinc-950/50 border border-zinc-800/50 text-zinc-600'}`}>
                                                    <Scissors size={18} />
                                                </div>
                                                <div>
                                                    <div className={`font-bold transition-colors font-unbounded text-sm ${service.is_active ? 'text-zinc-200 group-hover:text-yellow-500' : 'text-zinc-500'}`}>{service.title}</div>
                                                    <div className="text-zinc-600 text-[11px] mt-0.5 truncate max-w-[250px] lg:max-w-[400px]">{service.short_desc || 'Sin descripción'}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 text-zinc-400">
                                                <Clock size={14} className="text-zinc-500" /> {service.duration} min
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-yellow-500">
                                                {service.price}€
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`inline-flex items-center justify-center px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md ${service.is_active ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-zinc-900 border border-zinc-800 text-zinc-500'}`}>
                                                {service.is_active ? 'Activo' : 'Inactivo'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            {profile.role === 'admin' && (
                                                <button 
                                                    onClick={(e) => handleEdit(service, e)} 
                                                    className="text-zinc-500 hover:text-yellow-500 p-2 hover:bg-yellow-500/10 rounded-lg transition-all inline-flex cursor-pointer"
                                                >
                                                    <Edit2 size={18} />
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}


            {/* ========================================================= */}
            {/* MODAL 1: VER DETALLES DEL SERVICIO (Sólo Lectura)         */}
            {/* ========================================================= */}
            {selectedService && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setSelectedService(null)} />
                    
                    <div className="bg-zinc-950 border border-zinc-800 w-full max-w-lg rounded-[2rem] shadow-2xl relative z-10 flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-300">
                        
                        {/* Cabecera */}
                        <div className="relative px-6 py-6 border-b border-zinc-800 overflow-hidden shrink-0">
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-yellow-500/5 blur-3xl pointer-events-none" />
                            
                            <button onClick={() => setSelectedService(null)} className="absolute top-4 right-4 p-2 bg-zinc-900 border border-zinc-800 rounded-full text-zinc-400 hover:text-white transition-colors z-20">
                                <X size={16} />
                            </button>

                            <div className="flex flex-col items-center gap-4 relative z-10 text-center">
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-inner ${selectedService.is_active ? 'bg-zinc-900 border border-zinc-700 text-yellow-500' : 'bg-zinc-900 border border-zinc-800 text-zinc-600'}`}>
                                    <Scissors size={22} />
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold font-unbounded text-white leading-tight">{selectedService.title}</h2>
                                    <span className={`inline-block font-unbounded mt-2 text-xs font-semibold px-2.5 py-0.5 rounded-full border ${selectedService.is_active ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-zinc-900 text-zinc-500 border-zinc-800'}`}>
                                        {selectedService.is_active ? 'Servicio Activo' : 'Servicio Inactivo'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Contenido Scrollable */}
                        <div className="overflow-y-auto custom-scrollbar flex-1 bg-zinc-900/40 p-6 space-y-6">
                            
                            {/* Grid Precio / Duración */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl flex flex-col items-center text-center">
                                    <span className="text-base font-bold font-unbounded text-white">{selectedService.duration}'</span>
                                    <span className="text-sm text-zinc-500 font-unbounded font-bold mt-1">Minutos</span>
                                </div>
                                <div className="bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-2xl flex flex-col items-center text-center relative overflow-hidden">
                                    <span className="text-base font-black font-unbounded text-yellow-500 relative z-10">{selectedService.price}€</span>
                                    <span className="text-sm text-yellow-500/80 font-unbounded font-bold mt-1 relative z-10">Precio Base</span>
                                </div>
                            </div>

                            {/* Descripciones */}
                            <div className="space-y-4">
                                <div>
                                    <h4 className="text-sm font-bold text-zinc-500 font-unbounded mb-2 flex items-center gap-2"><AlignLeft size={14}/> Resumen</h4>
                                    <p className="text-base text-zinc-300 bg-zinc-900/80 p-4 rounded-xl border border-zinc-800">
                                        {selectedService.short_desc || 'No hay descripción corta.'}
                                    </p>
                                </div>
                                
                                {selectedService.full_desc && (
                                    <div>
                                        <h4 className="text-sm font-bold text-zinc-500 font-unbounded flex items-center gap-2 mb-2"><AlignLeft size={14}/> Descripción Completa</h4>
                                        <p className="text-base text-zinc-400 leading-relaxed bg-zinc-900/50 p-4 rounded-xl border border-zinc-800/50">
                                            {selectedService.full_desc}
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Features */}
                            {selectedService.features && selectedService.features.length > 0 && (
                                <div>
                                    <h4 className="text-sm font-bold text-zinc-500 font-unbounded mb-3 flex items-center gap-2"><Sparkles size={14}/> Qué incluye</h4>
                                    <div className="flex flex-col gap-2">
                                        {selectedService.features.map((feature, idx) => (
                                            <div key={idx} className="flex items-center gap-3 bg-zinc-900 border border-zinc-800 p-3 rounded-xl text-base text-zinc-300">
                                                <Check size={16} className="text-yellow-500 shrink-0" />
                                                {feature}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                        </div>

                        {/* Footer Modal Vista */}
                        {profile.role === 'admin' && (
                            <div className="p-4 border-t border-zinc-800 bg-zinc-950 shrink-0">
                                <button 
                                    onClick={(e) => handleEdit(selectedService, e)}
                                    className="w-full flex items-center font-unbounded text-base justify-center gap-2 py-3.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-xl font-bold text-white transition-colors cursor-pointer"
                                >
                                    <Edit2 size={16} /> Editar Servicio
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}


            {/* ========================================================= */}
            {/* MODAL 2: CREACIÓN / EDICIÓN (Formulario)                  */}
            {/* ========================================================= */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
                    
                    <div className="bg-zinc-950 border border-zinc-800 w-full max-w-2xl rounded-[2rem] shadow-2xl relative z-10 flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-300">
                        
                        {/* Modal Header */}
                        <div className="px-6 py-5 border-b border-zinc-800 flex justify-between items-center bg-zinc-900/50 shrink-0">
                            <div>
                                <h2 className="text-lg font-bold font-unbounded text-white">{editingService ? 'Editar Servicio' : 'Nuevo Servicio'}</h2>
                                <p className="text-sm text-zinc-400 mt-1">Completa los detalles para tu catálogo.</p>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="p-2 bg-zinc-900 rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer">
                                <X size={18} />
                            </button>
                        </div>

                        {/* Modal Body (Scrollable form) */}
                        <div className="p-6 overflow-y-auto custom-scrollbar space-y-6">
                            
                            {/* Fila 1: Título y Estado */}
                            <div className="flex flex-col sm:flex-row gap-6">
                                <div className="flex-1 space-y-2">
                                    <label className="text-sm font-bold text-zinc-400 font-unbounded">Nombre del Servicio *</label>
                                    <input 
                                        type="text" 
                                        value={formData.title || ''}
                                        onChange={e => setFormData({...formData, title: e.target.value})}
                                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 outline-none transition-all text-base"
                                        placeholder="Ej: Corte Clásico"
                                    />
                                </div>
                                <div className="sm:w-32 space-y-2">
                                    <label className="text-sm font-bold text-zinc-400 font-unbounded">Estado</label>
                                    <button 
                                        onClick={() => setFormData({...formData, is_active: !formData.is_active})}
                                        className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-bold font-unbounded text-sm transition-all border ${formData.is_active ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-zinc-900 text-zinc-500 border-zinc-800'}`}
                                    >
                                        {formData.is_active ? <><Check size={16}/> Activo</> : 'Inactivo'}
                                    </button>
                                </div>
                            </div>

                            {/* Fila 2: Precio y Duración */}
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-zinc-400 font-unbounded">Precio (€) *</label>
                                    <div className="relative">
                                        <Euro className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                                        <input 
                                            type="number" 
                                            value={formData.price || ''}
                                            onChange={e => setFormData({...formData, price: parseFloat(e.target.value)})}
                                            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-10 pr-4 py-3 text-white focus:border-yellow-500 outline-none transition-all text-base"
                                            placeholder="0.00"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-zinc-400 font-unbounded">Duración (Min) *</label>
                                    <div className="relative">
                                        <Clock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                                        <input 
                                            type="number" 
                                            step="5"
                                            value={formData.duration || ''}
                                            onChange={e => setFormData({...formData, duration: parseInt(e.target.value)})}
                                            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-10 pr-4 py-3 text-white focus:border-yellow-500 outline-none transition-all text-base"
                                            placeholder="30"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Descripciones */}
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-zinc-400 font-unbounded">Descripción Corta</label>
                                    <input 
                                        type="text" 
                                        value={formData.short_desc || ''}
                                        onChange={e => setFormData({...formData, short_desc: e.target.value})}
                                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:border-yellow-500 outline-none text-base"
                                        placeholder="Breve resumen para la vista rápida..."
                                        maxLength={100}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-zinc-400 font-unbounded">Descripción Completa</label>
                                    <textarea 
                                        value={formData.full_desc || ''}
                                        onChange={e => setFormData({...formData, full_desc: e.target.value})}
                                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:border-yellow-500 outline-none text-base min-h-[100px] resize-none"
                                        placeholder="Detalla todo lo que incluye el servicio..."
                                    />
                                </div>
                            </div>

                            {/* Características (Array of Strings) */}
                            <div className="space-y-3 bg-zinc-900/50 p-5 rounded-2xl border border-zinc-800">
                                <label className="text-sm font-bold text-zinc-400 font-unbounded flex items-center gap-2">
                                    <Sparkles size={14}/> Qué incluye (Características)
                                </label>
                                
                                <div className="grid grid-cols-3 gap-2">
                                    <input 
                                        type="text" 
                                        value={newFeature}
                                        onChange={e => setNewFeature(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                                        className="flex-1 bg-zinc-950 border col-span-2 placeholder:text-yellow-500/80 border-zinc-800 rounded-xl px-4 py-2.5 text-base text-white focus:border-yellow-500 outline-none"
                                        placeholder="Recomendado 2 features máximo"
                                    />
                                    <button onClick={addFeature} type="button" className="bg-zinc-800 hover:bg-zinc-700 text-white px-4 rounded-xl text-sm font-bold transition-colors cursor-pointer">
                                        Añadir
                                    </button>
                                </div>

                                {formData.features && formData.features.length > 0 && (
                                    <div className="flex flex-wrap gap-2 pt-2">
                                        {formData.features.map((feature, idx) => (
                                            <span key={idx} className="flex items-center gap-1.5 bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 px-3 py-1.5 rounded-lg text-sm font-medium">
                                                {feature}
                                                <button onClick={() => removeFeature(idx)} className="hover:text-white transition-colors ml-1 cursor-pointer"><X size={12}/></button>
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>

                        </div>

                        {/* Modal Footer */}
                        <div className="p-4 border-t border-zinc-800 bg-zinc-900 flex justify-between items-center shrink-0">
                            {editingService ? (
                                <button
                                    onClick={async () => {
                                        setIsLoading(true)
                                        const result = await deleteService(editingService.id)

                                        if (result.error) {
                                            sileo.error({
                                                title: 'Error eliminando',
                                                description: result.error
                                            })
                                        } else if (result.success) {
                                            sileo.success({
                                                title: 'Eliminado con éxito',
                                                description: 'Servicio eliminado correctamente.'
                                            })
                                            setServices(prev => prev.filter(s => s.id !== editingService.id))
                                            setIsModalOpen(false)
                                        }
                                        setIsLoading(false)
                                    }} 
                                    className="flex items-center gap-2 cursor-pointer">
                                    {
                                        isLoading ? (
                                            <span className='flex gap-2 items-center bg-red-500/10 text-red-500 hover:bg-red-500/20 px-4 py-2 rounded-xl font-bold text-base transition-colors'><LoaderCircle width={16} className='animate-spin'/>Eliminando</span>
                                        ) : (
                                            <span className='flex gap-2 items-center bg-red-500/10 text-red-500 hover:bg-red-500/20 px-4 py-2 rounded-xl font-medium font-unbounded text-sm transition-colors'><Trash2 size={16} /> Eliminar</span>
                                        )
                                    }
                                </button>
                            ) : <div></div>}
                            
                            <div className="flex gap-1">
                                <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium rounded-xl font-unbounded text-zinc-400 bg-zinc-400/5 hover:text-white transition-colors cursor-pointer">
                                    Cancelar
                                </button>
                                <button 
                                    onClick={handleSave}
                                    disabled={isSaving}
                                    className="bg-yellow-500 text-zinc-950 px-4 py-2 rounded-xl text-sm font-unbounded font-medium hover:bg-yellow-400 transition-transform active:scale-95 shadow-lg shadow-yellow-500/20 cursor-pointer">
                                    {
                                        isSaving ? <span className='flex gap-2 items-center'><LoaderCircle width={16} className='animate-spin' /> Guardando</span> : 'Guardar'
                                    }
                                    
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </div>
    )
}