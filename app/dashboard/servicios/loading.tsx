export default function LoadingServicios() {
    return (
        <div className="max-w-4xl space-y-6 animate-pulse">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <div className="h-8 sm:h-9 w-48 bg-zinc-800/60 rounded-lg"></div>
                    <div className="h-4 w-64 bg-zinc-800/40 rounded-md mt-2"></div>
                </div>
                <div className="h-10 w-full sm:w-40 bg-zinc-800/50 rounded-xl"></div>
            </div>

            {/* Categorías Falsas */}
            <div className="space-y-4">
                {[1, 2].map(cat => (
                    <div key={cat} className="bg-zinc-900 border border-zinc-800/50 rounded-2xl overflow-hidden">
                        {/* Cabecera de Categoría */}
                        <div className="p-4 border-b border-zinc-800/50 flex justify-between items-center bg-zinc-800/10">
                            <div className="h-5 w-32 bg-zinc-800/60 rounded-md"></div>
                            <div className="h-8 w-24 bg-zinc-800/50 rounded-lg"></div>
                        </div>
                        {/* Lista de servicios */}
                        <div className="p-4 space-y-3">
                            {[1, 2, 3].map(item => (
                                <div key={item} className="flex justify-between items-center bg-zinc-950/50 p-3 sm:p-4 rounded-xl border border-zinc-800/30">
                                    <div className="space-y-2">
                                        <div className="h-4 w-40 bg-zinc-800/60 rounded-md"></div>
                                        <div className="h-3 w-20 bg-zinc-800/40 rounded-md"></div>
                                    </div>
                                    <div className="flex gap-2">
                                        <div className="h-8 w-16 bg-zinc-800/60 rounded-lg hidden sm:block"></div>
                                        <div className="h-8 w-8 bg-zinc-800/40 rounded-lg"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}