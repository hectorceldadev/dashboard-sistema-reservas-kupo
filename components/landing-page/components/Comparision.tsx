import { XCircle, CheckCircle2 } from "lucide-react";

export default function Comparison() {
  return (
    <section className="relative z-10 w-full py-20 md:py-32 border-t border-white/[0.02]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col items-center text-center mb-16 md:mb-20">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-unbounded text-white mb-6">
            ¿Por qué salir de <br /> <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-200 to-yellow-600">las apps de siempre?</span>
          </h2>
          <p className="text-base sm:text-lg text-zinc-400 max-w-2xl font-geist px-2 sm:px-0">
            Las aplicaciones de directorio te traen clientes, <b className="text-zinc-300">te cobran un precio muy alto: tu identidad y tus márgenes.</b> Es hora de independizarse.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <div className="relative flex flex-col p-8 sm:p-10 rounded-3xl bg-[#121214]/50 border border-red-500/10 opacity-90 h-full">
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-zinc-400 font-unbounded mb-2">Apps de Directorio</h3>
              <p className="text-sm text-zinc-500 font-geist">(Booksy, Treatwell, etc.)</p>
            </div>
            <div className="space-y-6 font-geist text-base flex-1">
              <div className="flex items-start gap-4 text-zinc-400">
                <XCircle className="w-6 h-6 text-red-500/70 shrink-0 mt-0.5" /> 
                <span><strong className="text-zinc-300">Comisiones abusivas.</strong> Te cobran un porcentaje por cada cliente nuevo o reserva.</span>
              </div>
              <div className="flex items-start gap-4 text-zinc-400">
                <XCircle className="w-6 h-6 text-red-500/70 shrink-0 mt-0.5" /> 
                <span><strong className="text-zinc-300">Cobro por empleado.</strong> Te penalizan por crecer sumando extras a tu cuota.</span>
              </div>
              <div className="flex items-start gap-4 text-zinc-400">
                <XCircle className="w-6 h-6 text-red-500/70 shrink-0 mt-0.5" /> 
                <span><strong className="text-zinc-300">Guerra de precios.</strong> Apareces en una lista junto a tu competencia más barata.</span>
              </div>
              <div className="flex items-start gap-4 text-zinc-400">
                <XCircle className="w-6 h-6 text-red-500/70 shrink-0 mt-0.5" /> 
                <span><strong className="text-zinc-300">Los clientes no son tuyos.</strong> Son de la aplicación. Si te vas, pierdes tu base de datos.</span>
              </div>
              <div className="flex items-start gap-4 text-zinc-400">
                <XCircle className="w-6 h-6 text-red-500/70 shrink-0 mt-0.5" /> 
                <span><strong className="text-zinc-300">Marca invisible.</strong> El cliente recuerda que reservó en {`"la app"`}, no en tu salón.</span>
              </div>
            </div>
          </div>

          <div className="relative flex flex-col p-8 sm:p-10 rounded-3xl bg-[#18181b] border-2 border-yellow-500/30 shadow-[0_0_40px_rgba(234,179,8,0.05)] md:scale-105 z-10 h-full">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4/5 h-px bg-gradient-to-r from-transparent via-yellow-500 to-transparent opacity-50" />
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-yellow-500 font-unbounded mb-2">Con Kupo</h3>
              <p className="text-sm text-zinc-300 font-geist">El modelo de los líderes</p>
            </div>
            <div className="space-y-6 font-geist text-base flex-1">
              <div className="flex items-start gap-4 text-white">
                <CheckCircle2 className="w-6 h-6 text-yellow-500 shrink-0 mt-0.5" /> 
                <span><strong className="text-white">0% Comisiones.</strong> Pagas una cuota fija, todo el dinero de tus servicios es 100% tuyo.</span>
              </div>
              <div className="flex items-start gap-4 text-white">
                <CheckCircle2 className="w-6 h-6 text-yellow-500 shrink-0 mt-0.5" /> 
                <span><strong className="text-white">Equipo ilimitado.</strong> Añade a todos tus profesionales y gestiona sus agendas sin pagar extra.</span>
              </div>
              <div className="flex items-start gap-4 text-white">
                <CheckCircle2 className="w-6 h-6 text-yellow-500 shrink-0 mt-0.5" /> 
                <span><strong className="text-white">Exclusividad total.</strong> Tu web, tu espacio. Nadie compite contigo cuando te visitan.</span>
              </div>
              <div className="flex items-start gap-4 text-white">
                <CheckCircle2 className="w-6 h-6 text-yellow-500 shrink-0 mt-0.5" /> 
                <span><strong className="text-white">Base de datos propia.</strong> Los correos y teléfonos te pertenecen para fidelizarlos.</span>
              </div>
              <div className="flex items-start gap-4 text-white">
                <CheckCircle2 className="w-6 h-6 text-yellow-500 shrink-0 mt-0.5" /> 
                <span><strong className="text-white">Prestigio de marca.</strong> Al tener tu propia web, transmites una imagen mucho más premium.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}