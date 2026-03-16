'use client'

import Link from "next/link";
import { ArrowRight, Play, CheckCircle2, CalendarDays, Users, TrendingUp, Menu } from "lucide-react";
import Image from "next/image";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-50 overflow-hidden relative font-sans stagger-container">

      {/* Efectos de luz de fondo */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-yellow-500/10 rounded-full blur-[120px] pointer-events-none mix-blend-screen" />
      <div className="absolute top-[20%] right-[-5%] w-[30%] h-[40%] bg-amber-600/10 rounded-full blur-[120px] pointer-events-none mix-blend-screen" />

      {/* NAVBAR ELEGANTE FULL-WIDTH */}
      <header className="absolute top-4 px-4 md:px-40 w-full">
        <div className="relative z-100 max-w-7xl mx-auto px-6 h-14 flex items-center border bg-yellow-500/5 border-yellow-500/30 rounded-4xl justify-between">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <Image
              src="/kupo-sBG.png"
              alt="Kupo Logo"
              width={28}
              height={28}
              className="group-hover:scale-105 transition-transform duration-300 cursor-pointer"
            />
          </Link>

          {/* Enlaces Desktop */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="#funciones" className="text-sm font-medium text-zinc-400 hover:text-yellow-400 transition-colors cursor-pointer">
              Funciones
            </Link>
            <Link href="#precios" className="text-sm font-medium text-zinc-400 hover:text-yellow-400 transition-colors cursor-pointer">
              Precios
            </Link>
          </nav>

          {/* CTAs Desktop & Mobile Toggle */}
          <div className="flex items-center gap-4">
            <Link href="/login" className="hidden sm:block text-sm font-medium text-zinc-400 hover:text-white transition-colors cursor-pointer">
              Entrar
            </Link>
            <Link href="/register" className="hidden sm:block text-sm font-bold bg-white text-black px-4 py-1.5 rounded-full hover:bg-zinc-200 transition-all shadow-[0_0_15px_rgba(255,255,255,0.1)] cursor-pointer">
              Empezar
            </Link>
            {/* Botón menú móvil */}
            <button className="md:hidden p-2 text-zinc-400 hover:text-white">
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <main className="relative z-10 max-w-6xl mx-auto px-6 pt-22 pb-24 md:pb-32">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-22 items-center">

          {/* Columna Izquierda: Texto y CTA */}
          <div className="flex flex-col items-start text-left">

            <div className="flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/70 rounded-full py-1.5 px-4">
              <div>
                <div className={`w-2 h-2 rounded-full ring-[4px] ring-zinc-900 z-10 bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.8)]`} >
                <div className={`w-2 h-2 rounded-full bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.8)] animate-ping`} /></div>
              </div>

              <span className="text-xs font-bold text-yellow-500 uppercase">La nueva era de la gestión</span>
            </div>

            <h1 className="text-5xl sm:text-6xl font-bold tracking-tight mt-4 mb-6">
              Tu negocio fluye. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-yellow-400 to-amber-600">
                Nosotros el resto.
              </span>
            </h1>

            <p className="text-lg text-zinc-400 mb-10 max-w-xl leading-relaxed">
              Kupo automatiza tus reservas, sincroniza a tu equipo y dispara tus ingresos. Despídete del caos organizativo hoy mismo.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
              <Link href="/register" className="w-full sm:w-auto flex items-center justify-center gap-2 bg-yellow-500 hover:bg-yellow-400 text-black font-bold px-8 py-4 rounded-xl transition-all duration-300 hover:shadow-[0_0_30px_rgba(234,179,8,0.3)] hover:-translate-y-0.5">
                Comenzar ahora
                <ArrowRight className="w-5 h-5" />
              </Link>
              <button className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.1] text-white font-medium px-8 py-4 rounded-xl transition-all duration-300">
                <Play className="w-4 h-4 text-zinc-400" />
                Ver demo
              </button>
            </div>

            <div className="mt-8 flex items-center justify-center sm:justify-start gap-6 text-sm text-zinc-500 font-medium w-full sm:w-auto">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>14 días gratis</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Sin tarjeta</span>
              </div>
            </div>
          </div>



          {/* VISUAL PC (El mockup 3D que te gustaba, oculto en móvil) */}
          <div className="relative w-full h-full min-h-[500px]" style={{ perspective: '600px' }}>
            <div className="absolute inset-0 translate-x-12 md:translate-x-0" style={{ transform: 'rotateY(-12deg) rotateX(5deg)', transformStyle: 'preserve-3d' }}>
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
                  <div className="w-3/4 h-full bg-yellow-500 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>
      <section className="my-100">

      </section>

      {/* ESPACIO VACÍO PARA LA NUEVA SECCIÓN */}
      {/* Aquí irá la nueva sección de características que haremos en el siguiente paso */}

      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes float {
          0%, 100% { transform: translateY(0) translateZ(50px); }
          50% { transform: translateY(-10px) translateZ(50px); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}} />
    </div>
  );
}