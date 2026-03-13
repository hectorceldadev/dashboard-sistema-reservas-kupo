export default function ServiciosLoading() {
    return (
        <div className="space-y-8 animate-pulse pb-10 stagger-container">
            
            {/* 1. Cabecera */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                <div>
                    <div className="h-9 w-40 bg-zinc-800 rounded-lg mb-2"></div>
                    <div className="h-5 w-72 bg-zinc-800/50 rounded-md"></div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                    {/* Buscador Skeleton */}
                    <div className="h-12 flex-1 lg:min-w-[300px] bg-zinc-900 border border-zinc-800 rounded-xl"></div>
                    {/* Botón Nuevo Servicio Skeleton */}
                    <div className="h-12 w-full sm:w-[160px] bg-zinc-800 rounded-xl shrink-0"></div>
                </div>
            </div>

            <div className='h-[1px] w-full bg-zinc-800/50 rounded-full'></div>

            {/* 2. Contenedor Principal */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-xl shadow-black/20">
                
                {/* --- VISTA MÓVIL SKELETON (Tarjetas en Fila) --- */}
                <div className="block md:hidden divide-y divide-zinc-800/50">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="p-5">
                            <div className="flex items-start justify-between gap-4 mb-3">
                                <div className="flex items-center gap-4 flex-1">
                                    {/* Icono */}
                                    <div className="w-12 h-12 rounded-xl bg-zinc-800/50 shrink-0"></div>
                                    {/* Textos */}
                                    <div className="flex-1 space-y-2">
                                        <div className="h-5 w-3/4 bg-zinc-800 rounded-md"></div>
                                        <div className="h-3 w-1/2 bg-zinc-800/50 rounded-md"></div>
                                    </div>
                                </div>
                                {/* Botón Editar */}
                                <div className="w-9 h-9 bg-zinc-800/50 rounded-lg shrink-0"></div>
                            </div>
                            
                            {/* Footer de la tarjeta móvil */}
                            <div className="flex items-center justify-between bg-zinc-950/50 p-3.5 rounded-lg border border-zinc-800/50">
                                <div className="flex items-center gap-4">
                                    <div className="h-4 w-16 bg-zinc-800/50 rounded"></div>
                                    <div className="h-4 w-16 bg-zinc-800/50 rounded"></div>
                                </div>
                                <div className="h-6 w-16 bg-zinc-800 rounded-md"></div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* --- VISTA ESCRITORIO SKELETON (Tabla) --- */}
                <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-left border-collapse whitespace-nowrap">
                        <thead>
                            <tr className="border-b border-zinc-800 bg-zinc-950/50">
                                <th className="px-6 py-4"><div className="h-4 w-20 bg-zinc-800 rounded"></div></th>
                                <th className="px-6 py-4"><div className="h-4 w-16 bg-zinc-800 rounded"></div></th>
                                <th className="px-6 py-4"><div className="h-4 w-16 bg-zinc-800 rounded"></div></th>
                                <th className="px-6 py-4"><div className="h-4 w-16 bg-zinc-800 rounded mx-auto"></div></th>
                                <th className="px-6 py-4"><div className="h-4 w-16 bg-zinc-800 rounded ml-auto"></div></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-800/50">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <tr key={i}>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-zinc-800/50 shrink-0"></div>
                                            <div className="space-y-2">
                                                <div className="h-4 w-48 bg-zinc-800 rounded"></div>
                                                <div className="h-3 w-64 bg-zinc-800/50 rounded"></div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="h-4 w-16 bg-zinc-800/50 rounded"></div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="h-4 w-16 bg-zinc-800/50 rounded"></div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <div className="h-6 w-16 bg-zinc-800 rounded-md mx-auto"></div>
                                    </td>
                                    <td className="px-6 py-4 text-right flex justify-end">
                                        <div className="w-9 h-9 bg-zinc-800/50 rounded-lg"></div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}