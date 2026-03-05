export default function LoadingAgenda() {
    return (
        <div className="flex flex-col h-[calc(100vh-2rem)] animate-pulse">
            {/* Header */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
                <div>
                    <div className="h-8 sm:h-9 w-40 bg-zinc-800/60 rounded-lg"></div>
                    <div className="h-4 w-64 bg-zinc-800/40 rounded-md mt-2"></div>
                </div>
                
                <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
                    {/* Botones de navegación de fecha falsos */}
                    <div className="flex items-center gap-1 bg-zinc-900 p-1 rounded-xl border border-zinc-800/50">
                        <div className="h-8 w-8 bg-zinc-800/50 rounded-lg"></div>
                        <div className="h-8 w-24 bg-zinc-800/40 rounded-lg mx-1"></div>
                        <div className="h-8 w-8 bg-zinc-800/50 rounded-lg"></div>
                    </div>
                    {/* Botones de vista falsos */}
                    <div className="h-10 w-32 bg-zinc-900 border border-zinc-800/50 rounded-xl"></div>
                </div>
            </div>

            {/* Cuadrícula del Calendario Falsa */}
            <div className="flex-1 bg-zinc-900 border border-zinc-800/50 rounded-2xl p-4 flex flex-col gap-4">
                <div className="flex gap-4 border-b border-zinc-800/50 pb-4">
                    {[1,2,3,4,5,6,7].map(i => (
                        <div key={i} className="flex-1 h-8 bg-zinc-800/40 rounded-md"></div>
                    ))}
                </div>
                <div className="flex-1 w-full bg-zinc-800/20 rounded-xl border border-zinc-800/30"></div>
            </div>
        </div>
    )
}