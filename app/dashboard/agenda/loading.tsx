export default function AgendaLoading() {
    return (
        <div className="space-y-6 animate-pulse stagger-container">
            {/* 1. Cabecera (Title & Subtitle) */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 border-b border-zinc-800 pb-6">
                <div>
                    <div className="h-9 w-32 bg-zinc-800 rounded-lg mb-2"></div>
                    <div className="h-5 w-64 bg-zinc-800/50 rounded-md"></div>
                </div>
            </div>

            {/* 2. Barra de Herramientas (Toolbar) */}
            <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 bg-zinc-900 border border-zinc-800 p-4 rounded-2xl shadow-sm">
                
                {/* Controles de Fecha Skeleton */}
                <div className="flex items-center gap-4">
                    <div className="h-10 w-28 bg-zinc-950 border border-zinc-800 rounded-xl"></div>
                    <div className="h-6 w-32 bg-zinc-800/50 rounded-md hidden sm:block"></div>
                </div>

                {/* Filtros y Vistas Skeleton */}
                <div className="flex flex-wrap items-center gap-4 w-full xl:w-auto">
                    {/* Selector de Staff */}
                    <div className="h-10 flex-1 sm:flex-none min-w-[200px] bg-zinc-950 border border-zinc-800 rounded-xl"></div>
                    {/* Selector de Vista (Mes/Semana/Día) */}
                    <div className="h-10 w-full sm:w-[250px] bg-zinc-950 border border-zinc-800 rounded-xl p-1"></div>
                </div>
            </div>

            {/* 3. Contenedor de la Vista (Grid de Calendario Mensual) */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl min-h-[600px] overflow-hidden relative p-2 lg:p-4 flex flex-col gap-4">
                
                {/* Cabecera de los días de la semana */}
                <div className="grid grid-cols-7 bg-zinc-950/50 rounded-xl h-10 w-full"></div>

                {/* Cuadrícula de días */}
                <div className="grid grid-cols-7 gap-0.5 flex-1 auto-rows-fr">
                    {/* Generamos 35 bloques simulando 5 semanas */}
                    {Array.from({ length: 35 }).map((_, i) => (
                        <div 
                            key={i} 
                            className="relative min-h-[80px] md:min-h-[120px] p-1.5 sm:p-2 rounded-md border-r border-b border-zinc-800/50 bg-zinc-950/20 flex flex-col items-start justify-start"
                        >
                            {/* Círculo del número del día */}
                            <div className="w-6 h-6 sm:w-7 sm:h-7 bg-zinc-800/50 rounded-full mb-2"></div>
                            
                            {/* Simulador de etiquetas de "citas" aleatorias para darle realismo */}
                            {i % 4 === 0 && (
                                <div className="mt-auto w-full">
                                    <div className="w-full h-5 sm:h-6 rounded-md sm:rounded-lg bg-zinc-800/30"></div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}