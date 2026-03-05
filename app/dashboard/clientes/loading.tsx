export default function LoadingClientes() {
    return (
        <div className="space-y-6 animate-pulse">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <div className="h-8 sm:h-9 w-40 bg-zinc-800/60 rounded-lg"></div>
                    <div className="h-4 w-64 bg-zinc-800/40 rounded-md mt-2"></div>
                </div>
                <div className="h-10 w-full sm:w-32 bg-zinc-800/50 rounded-xl"></div>
            </div>

            {/* Buscador falso */}
            <div className="h-12 w-full max-w-md bg-zinc-900 border border-zinc-800/50 rounded-xl"></div>

            {/* Tabla de clientes falsa */}
            <div className="bg-zinc-900 border border-zinc-800/50 rounded-2xl overflow-hidden">
                <div className="hidden sm:grid grid-cols-4 gap-4 p-4 border-b border-zinc-800/50">
                    <div className="h-3 w-16 bg-zinc-800/50 rounded"></div>
                    <div className="h-3 w-16 bg-zinc-800/50 rounded"></div>
                    <div className="h-3 w-20 bg-zinc-800/50 rounded"></div>
                    <div className="h-3 w-12 bg-zinc-800/50 rounded"></div>
                </div>
                
                {[1, 2, 3, 4, 5, 6].map(i => (
                    <div key={i} className="flex items-center justify-between p-4 border-b border-zinc-800/30">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-zinc-800/60 shrink-0"></div>
                            <div className="space-y-2">
                                <div className="h-4 w-32 bg-zinc-800/60 rounded-md"></div>
                                <div className="h-3 w-24 bg-zinc-800/40 rounded-md"></div>
                            </div>
                        </div>
                        <div className="hidden sm:block h-4 w-20 bg-zinc-800/50 rounded-md"></div>
                        <div className="h-8 w-8 bg-zinc-800/40 rounded-lg"></div>
                    </div>
                ))}
            </div>
        </div>
    )
}