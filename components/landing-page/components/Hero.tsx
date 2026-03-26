import Link from "next/link";
import { ArrowRight, CheckCircle2, CalendarDays, Users, TrendingUp } from "lucide-react";

export default function Hero() {
  return (
    <div className="min-h-screen w-full bg-black relative">
      {/* Tropical Dusk Glow Background */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `
          radial-gradient(circle at 50% 100%, rgba(255, 99, 71, 0.6) 0%, transparent 60%),
          radial-gradient(circle at 50% 100%, rgba(255, 215, 0, 0.4) 0%, transparent 70%),
          radial-gradient(circle at 50% 100%, rgba(60, 179, 113, 0.3) 0%, transparent 80%)
        `,
        }}
      />
      <main className="relative z-10 max-w-6xl mx-auto px-6 pt-16 md:pt-24 pb-24 md:pb-32 stagger-container">
        {/* Your Content/Components */}

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-26 items-center">
          <div className="flex flex-col items-center lg:items-start mt-8 text-left stagger-container">
            <h1 className="text-4xl lg:text-5xl text-center lg:text-left font-bold mt-4 mb-6 font-unbounded">
              Tu propia web de reservas <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-yellow-400 to-amber-600">
                No un negocio mas en una app
              </span>
            </h1>
            <p className="text-lg text-center lg:text-left text-zinc-400 mb-10 max-w-xl leading-relaxed font-geist">
              <b className="text-zinc-300">Deja de compartir escaparate con tu competencia.</b> En Kupo te creamos un sitio web exclusivo, <b className="text-zinc-300">bajo tu propia marca para que tus clientes reserven directamente contigo.</b>
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
              <Link href="/register" className="w-full sm:w-auto flex items-center justify-center gap-2 bg-yellow-500 hover:bg-yellow-400 text-black font-bold px-8 py-4 rounded-xl transition-all duration-300 hover:shadow-[0_0_30px_rgba(234,179,8,0.3)] hover:-translate-y-0.5">
                Comenzar ahora
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
            <div className="mt-8 flex items-center justify-center sm:justify-start gap-6 text-sm text-zinc-500 font-medium w-full sm:w-auto">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>30 días gratis</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Sin Compromiso</span>Hola
              </div>
            </div>
          </div>
          <div className="relative w-full md:w-[80%] lg:w-full h-full min-h-[500px] animate-float" style={{ perspective: '600px' }}>
            <div className="absolute inset-0 translate-x-12 md:translate-x-24 lg:translate-x-0" style={{ transform: 'rotateY(-12deg) rotateX(5deg)', transformStyle: 'preserve-3d' }}>
              <div className="absolute top-10 right-10 w-[110%] bg-[#121214] border border-white/10 rounded-2xl shadow-2xl p-6 backdrop-blur-xl">
                <div className="flex items-center gap-2 mb-6 border-b border-white/5 pb-4">
                  <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-white/[0.02] border border-white/[0.05] p-4 rounded-xl">
                    <TrendingUp className="w-5 h-5 text-emerald-400 mb-2" />
                    <div className="text-zinc-500 text-xs mb-1">Ingresos de hoy</div>
                    <div className="text-xl font-bold bg-clip-text text-transparent bg-linear-to-r from-emerald-300 via-emerald-400 to-emerald-600">€1,240.50</div>
                  </div>
                  <div className="bg-white/[0.02] border border-white/[0.05] p-4 rounded-xl">
                    <Users className="w-5 h-5 text-yellow-400 mb-2" />
                    <div className="text-zinc-500 text-xs mb-1">Nuevos Clientes</div>
                    <div className="text-xl font-bold bg-clip-text text-transparent bg-linear-to-r from-yellow-300 via-yellow-400 to-yellow-600">+12</div>
                  </div>
                </div>
                <div className="space-y-3">
                  {[1, 2, 3].map((_, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02] border border-white/[0.03]">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-zinc-800 to-zinc-900 border border-white/5"></div>
                        <div>
                          <div className="w-24 h-4 bg-white/10 rounded mb-1"></div>
                          <div className="w-16 h-3 bg-white/5 rounded"></div>
                        </div>
                      </div>
                      <div className="w-16 h-6 bg-yellow-500/20 rounded-full border border-yellow-500/30"></div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="absolute -bottom-6 -left-12 md:w-64 bg-[#18181b] border border-white/10 rounded-xl shadow-[0_20px_40px_rgba(0,0,0,0.8)] p-5 animate-float" style={{ transform: 'translateZ(50px)' }}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-yellow-500/10 text-yellow-500 rounded-lg">
                    <CalendarDays className="w-5 h-5" />
                  </div>
                  <div className="text-sm font-semibold">Próxima cita en 15m</div>
                </div>
                <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                  <div className="w-3/4 h-full bg-linear-to-r from-yellow-200 via-yellow-400 to-yellow-500 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}