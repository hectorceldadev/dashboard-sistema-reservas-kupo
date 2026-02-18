'use client'

import Link from "next/link";
import { ArrowRight, Calendar, Users, BarChart3, CheckCircle2, ShieldCheck, Sparkles } from "lucide-react";
import Image from "next/image";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-zinc-950 font-sans text-zinc-100 selection:bg-yellow-500/30 selection:text-yellow-200 overflow-x-hidden">
      
      {/* BACKGROUND NOISE TEXTURE (Opcional, da el toque 'film') */}
      <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-soft-light pointer-events-none z-50"></div>

      {/* NAVBAR */}
      <nav className="fixed top-0 w-full z-40 bg-zinc-950/80 backdrop-blur-md border-b border-white/5 transition-all">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="group">
                <Image 
                  src='/icon.png'
                  alt="KUPO"
                  height={50}
                  width={50}
                />
            </Link>
            <span className="font-bold text-xl tracking-tight text-white">kupo</span>
          </div>
          <div className="flex items-center gap-6">
            <Link 
              href="/login" 
              className="hidden md:block text-sm font-medium text-zinc-400 hover:text-white transition-colors"
            >
              Iniciar sesión
            </Link>
            <Link 
              href="/login" 
              className="px-5 py-2.5 text-sm font-bold text-zinc-950 bg-white rounded-full hover:bg-zinc-200 transition-all shadow-lg shadow-white/5"
            >
              Empezar ahora
            </Link>
          </div>
        </div>
      </nav>

      <main className="pt-32 relative">
        
        {/* HERO SECTION */}
        <section className="relative pb-24 sm:pb-32 lg:pb-40">
            {/* Spotlights de fondo */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-800px h-500px bg-yellow-500/10 rounded-full blur-[120px] -z-10 pointer-events-none" />
            
          <div className="max-w-6xl mx-auto px-6 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-yellow-500 text-sm font-medium mb-8 animate-fade-in-up shadow-xl shadow-black/50">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-yellow-500"></span>
                </span>
                <span className="text-zinc-300">Nuevo:</span> Pagos automatizados integrados
              </div>

              {/* Title */}
              <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-8 leading-[1.1]">
                Gestiona tu negocio <br/>
                <span className="text-transparent bg-clip-text bg-linear-to-r from-yellow-200 via-yellow-500 to-yellow-600">
                  sin complicaciones.
                </span>
              </h1>

              {/* Description */}
              <p className="text-xl text-zinc-400 mb-10 max-w-2xl mx-auto leading-relaxed">
                La plataforma todo-en-uno para gestionar reservas, equipo y cobros. 
                Diseñada para negocios que buscan <span className="text-white font-medium">eficiencia y control total</span>.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
                <Link 
                  href="/login" 
                  className="inline-flex items-center justify-center px-8 py-4 text-base font-bold text-zinc-950 bg-yellow-500 rounded-full hover:bg-yellow-400 transition-all shadow-xl shadow-yellow-500/20 hover:shadow-yellow-500/40 group active:scale-95"
                >
                  Prueba gratis 30 días
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <div className="flex items-center gap-2 px-4 py-4 text-zinc-500 text-sm font-medium">
                  <ShieldCheck className="w-5 h-5 text-zinc-400" />
                  Sin tarjeta de crédito
                </div>
              </div>
            </div>
            
          </div>
        </section>

        {/* FEATURES GRID */}
        <section className="py-32 bg-zinc-950 relative border-t border-white/5">
            {/* Luz ambiental inferior */}
            <div className="absolute bottom-0 left-0 w-500px h-500px bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none" />

          <div className="max-w-6xl mx-auto px-6 relative z-10">
            <div className="mb-20 md:text-center max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Todo lo que necesitas para operar</h2>
              <p className="text-lg text-zinc-400">Deja de usar papel y lápiz. Centraliza tu operación en una sola herramienta moderna, oscura y extremadamente rápida.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {/* Feature 1 */}
              <div className="group bg-zinc-900/40 backdrop-blur-sm p-8 rounded-3xl border border-white/5 hover:border-yellow-500/30 hover:bg-zinc-900/60 transition-all duration-300">
                <div className="w-14 h-14 bg-zinc-950 rounded-2xl border border-white/5 flex items-center justify-center text-yellow-500 mb-6 group-hover:scale-110 transition-transform shadow-lg">
                  <Calendar className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Agenda Inteligente</h3>
                <p className="text-zinc-400 leading-relaxed">
                  Evita solapamientos y gestiona los horarios de todo tu equipo con una interfaz fluida de arrastrar y soltar.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="group bg-zinc-900/40 backdrop-blur-sm p-8 rounded-3xl border border-white/5 hover:border-yellow-500/30 hover:bg-zinc-900/60 transition-all duration-300">
                <div className="w-14 h-14 bg-zinc-950 rounded-2xl border border-white/5 flex items-center justify-center text-yellow-500 mb-6 group-hover:scale-110 transition-transform shadow-lg">
                  <Users className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">CRM de Clientes</h3>
                <p className="text-zinc-400 leading-relaxed">
                  Historial de visitas, preferencias y notas. Conoce a tus clientes antes de que entren por la puerta.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="group bg-zinc-900/40 backdrop-blur-sm p-8 rounded-3xl border border-white/5 hover:border-yellow-500/30 hover:bg-zinc-900/60 transition-all duration-300">
                <div className="w-14 h-14 bg-zinc-950 rounded-2xl border border-white/5 flex items-center justify-center text-yellow-500 mb-6 group-hover:scale-110 transition-transform shadow-lg">
                  <BarChart3 className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Analíticas Reales</h3>
                <p className="text-zinc-400 leading-relaxed">
                  Entiende qué servicios son los más rentables y cuáles son tus horas punta con gráficos oscuros fáciles de leer.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* PRICING / CTA BANNER */}
        <section className="py-24 relative overflow-hidden">
          <div className="max-w-5xl mx-auto px-6">
            <div className="relative bg-zinc-900 rounded-[2.5rem] p-12 md:p-20 text-center overflow-hidden border border-white/5">
              
              {/* Decoración de fondo del card */}
              <div className="absolute inset-0 bg-radial-gradient(circle_at_center,_var(--tw-gradient-stops)) from-yellow-500/10 via-zinc-900 to-zinc-900" />
              <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500/10 blur-[80px] rounded-full" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-yellow-600/10 blur-[80px] rounded-full" />

              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 text-xs font-bold uppercase tracking-wider mb-6">
                    <Sparkles className="w-3 h-3" /> Oferta Limitada
                </div>
                
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
                  Empieza hoy, <br className="hidden md:block"/>
                  <span className="text-yellow-500">paga el mes que viene.</span>
                </h2>
                
                <p className="text-zinc-400 text-lg mb-10 max-w-xl mx-auto">
                  Queremos que veas el valor antes de invertir. Disfruta de todas las funcionalidades Premium gratis durante 30 días.
                </p>
                
                <div className="flex flex-col sm:flex-row justify-center gap-4 mb-10">
                  <div className="flex items-center gap-2 text-zinc-300 bg-zinc-950/50 px-5 py-2 rounded-full border border-white/5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span className="text-sm font-medium">Sin compromiso</span>
                  </div>
                  <div className="flex items-center gap-2 text-zinc-300 bg-zinc-950/50 px-5 py-2 rounded-full border border-white/5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span className="text-sm font-medium">Soporte prioritario</span>
                  </div>
                </div>

                <div>
                  <Link 
                    href="/login" 
                    className="inline-block px-10 py-4 bg-white text-zinc-950 font-black rounded-full hover:bg-yellow-400 hover:scale-105 transition-all duration-300 shadow-2xl shadow-white/10"
                  >
                    Crear mi cuenta gratis
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="bg-zinc-950 border-t border-white/5 py-12">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-zinc-800 rounded-md flex items-center justify-center text-zinc-400 text-xs font-bold">M</div>
            <div className="text-zinc-500 text-sm">
                © {new Date().getFullYear()} MiSaaS Inc.
            </div>
          </div>
          <div className="flex gap-8">
            <a href="#" className="text-zinc-500 hover:text-yellow-500 text-sm font-medium transition-colors">Términos</a>
            <a href="#" className="text-zinc-500 hover:text-yellow-500 text-sm font-medium transition-colors">Privacidad</a>
            <a href="#" className="text-zinc-500 hover:text-yellow-500 text-sm font-medium transition-colors">Soporte</a>
          </div>
        </div>
      </footer>
    </div>
  );
}