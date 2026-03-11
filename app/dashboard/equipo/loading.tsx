export default function LoadingEquipo() {
    return (
        <div className="space-y-8 animate-pulse">
            
            {/* ========================================== */}
            {/* HEADER & TABS (Responsivo: Columna en móvil, Fila en PC) */}
            {/* ========================================== */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 border-b border-zinc-800 pb-8">
                
                {/* Textos del Header */}
                <div className="w-full sm:w-auto space-y-3">
                    <div className="h-8 w-48 sm:w-64 bg-zinc-800/60 rounded-lg"></div>
                    <div className="h-4 w-3/4 sm:w-80 bg-zinc-800/40 rounded-md"></div>
                </div>

                {/* Tabs de navegación (Ancho completo en móvil, ajustado en PC) */}
                <div className="flex items-center p-1.5 bg-zinc-900 border border-zinc-800 rounded-xl w-full sm:w-auto">
                    <div className="h-9 flex-1 sm:w-32 bg-zinc-800/60 rounded-lg mr-1.5"></div>
                    <div className="h-9 flex-1 sm:w-32 bg-zinc-800/30 rounded-lg"></div>
                </div>
            </div>

            {/* ========================================== */}
            {/* GRID DE EQUIPO (Responsivo: 1 col móvil, 2 en Tablet, 3 en PC) */}
            {/* ========================================== */}
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {[1, 2, 3].map(i => (
                    <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 min-h-[340px] flex flex-col justify-between shadow-sm">
                        
                        {/* Botón superior de opciones (tres puntos falsos) */}
                        <div className="flex justify-end">
                            <div className="w-8 h-8 bg-zinc-800/50 rounded-md"></div>
                        </div>

                        {/* Avatar y Textos centrales */}
                        <div className="flex flex-col items-center gap-5 mt-2">
                            
                            {/* Avatar con chapa de rol */}
                            <div className="relative">
                                <div className="h-24 w-24 rounded-full bg-zinc-800/60 border-2 border-zinc-700"></div>
                                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-16 h-5 rounded-full bg-zinc-800 border border-zinc-700"></div>
                            </div>

                            {/* Nombre y Descripción */}
                            <div className="flex flex-col items-center w-full gap-2 px-2">
                                <div className="h-6 w-3/4 bg-zinc-800/60 rounded-md"></div>
                                <div className="space-y-1.5 w-full flex flex-col items-center mt-1">
                                    <div className="h-3 w-full bg-zinc-800/40 rounded-sm"></div>
                                    <div className="h-3 w-5/6 bg-zinc-800/40 rounded-sm"></div>
                                </div>
                            </div>
                        </div>

                        {/* Botón inferior falso ("Editar Perfil") */}
                        <div className="py-6 w-full">
                            <div className="w-full h-11 bg-zinc-800/50 rounded-xl"></div>
                        </div>

                        {/* Etiqueta de Activo/Inactivo del final */}
                        <div className="pt-4 border-t border-zinc-800/50 flex items-center justify-center w-full mt-auto">
                            <div className="h-7 w-24 bg-zinc-800/40 rounded-full border border-white/5"></div>
                        </div>

                    </div>
                ))}
            </div>

        </div>
    )
}