export default function LoadingEquipo() {
    return (
        <div className="space-y-6 animate-pulse">
            {/* --- Header Principal --- */}
            <div>
                <div className="h-8 sm:h-9 w-40 bg-zinc-800/60 rounded-lg"></div>
                <div className="h-4 w-64 bg-zinc-800/40 rounded-md mt-2"></div>
            </div>

            {/* --- Pestañas falsas (Vista Equipo / Horarios) --- */}
            <div className="flex items-center gap-6 border-b border-zinc-800 pt-2">
                <div className="pb-4 border-b-2 border-zinc-700 w-24"><div className="h-5 w-full bg-zinc-800/60 rounded-md"></div></div>
                <div className="pb-4 w-20"><div className="h-5 w-full bg-zinc-800/30 rounded-md"></div></div>
            </div>

            {/* --- Tarjetas de Equipo (Grid idéntico al real) --- */}
            <div className="grid grid-cols-3 gap-6">
                {[1, 2, 3].map(i => (
                    <div key={i} className="bg-zinc-900 border border-zinc-800/50 rounded-3xl p-6 py-10 flex flex-col items-center">
                        
                        {/* Avatar grande (como en el componente real) */}
                        <div className="w-24 h-24 rounded-full bg-zinc-800/60 mb-4 shrink-0"></div>
                        
                        {/* Textos centrales */}
                        <div className="flex flex-col items-center w-full gap-2 mb-6">
                            {/* Nombre */}
                            <div className="h-5 w-32 bg-zinc-800/60 rounded-md"></div>
                            {/* Rol */}
                            <div className="h-3 w-20 bg-zinc-800/40 rounded-md mb-2"></div>
                            {/* Descripción (2 líneas) */}
                            <div className="space-y-2 w-full flex flex-col items-center">
                                <div className="h-3 w-full bg-zinc-800/30 rounded-sm"></div>
                                <div className="h-3 w-4/5 bg-zinc-800/30 rounded-sm"></div>
                            </div>
                        </div>

                        {/* Botón inferior falso */}
                        <div className="w-full h-11 bg-zinc-800/50 rounded-xl mt-auto"></div>
                    </div>
                ))}
            </div>
        </div>
    )
}