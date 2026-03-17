'use client'

import { Star } from "lucide-react";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

export default function Testimonials() {
  const container = useRef<HTMLElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container.current,
        start: "top 80%",
        toggleActions: 'play none none reverse'
      }
    });

    // 1. Textos de encabezado
    tl.fromTo(".test-text", 
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: "power3.out" }
    )
    
    // 2. Envoltorios de las tarjetas en cascada
    // Al animar el envoltorio, no rompemos el -translate-y-4 interno de Tailwind
    .fromTo(".test-wrapper",
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, stagger: 0.2, ease: "power3.out" },
      "-=0.4"
    );

  }, { scope: container });

  return (
    <section ref={container} id="testimonios" className="relative z-10 w-full py-20 md:py-32 border-t border-white/[0.02] bg-[#09090b] overflow-hidden">
      <div className="absolute top-1/2 left-0 w-[40%] h-[50%] bg-yellow-500/5 blur-[120px] rounded-full pointer-events-none -translate-y-1/2 -translate-x-1/2" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        
        {/* ENCABEZADO */}
        <div className="flex flex-col items-center text-center mb-16 md:mb-20">
          <h2 className="test-text text-3xl sm:text-4xl md:text-5xl font-bold font-unbounded text-white mb-6">
            Negocios que ya <br/> <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-200 to-yellow-600">han dado el salto.</span>
          </h2>
          <p className="test-text text-base sm:text-lg text-zinc-400 max-w-2xl font-geist px-2 sm:px-0">
            Únete a los profesionales que <b className="text-zinc-300">han dejado de pagar comisiones abusivas y han recuperado el control</b> absoluto de sus clientes.
          </p>
        </div>

        {/* TARJETAS DE TESTIMONIOS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
          
          {/* ENVOLTORIO 1 */}
          <div className="test-wrapper h-full">
            <div className="relative flex flex-col p-8 rounded-3xl bg-[#121214] border border-white/[0.05] hover:border-yellow-500/30 transition-colors duration-300 h-full">
              <div className="flex gap-1 mb-6">{[1, 2, 3, 4, 5].map((star) => (<Star key={star} className="w-4 h-4 fill-yellow-500 text-yellow-500" />))}</div>
              <p className="text-zinc-300 font-geist text-base leading-relaxed mb-8 flex-1">{`"Estaba pagando casi 300€ al mes en comisiones a otra app de reservas. Desde que uso Kupo, pago mi cuota fija y el resto es beneficio limpio. Además, mis clientes dicen que la nueva web se ve súper profesional."`}</p>
              <div className="flex items-center gap-4 border-t border-white/5 pt-6 mt-auto">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-zinc-700 to-zinc-800 border border-white/10 shrink-0" />
                <div><p className="text-white font-bold text-sm font-unbounded">Carlos M.</p><p className="text-zinc-500 text-xs font-geist">Dueño de Barbería</p></div>
                <div className="ml-auto text-right"><span className="block text-emerald-400 font-bold text-sm">+300€</span><span className="block text-zinc-600 text-[10px] uppercase tracking-wider">Ahorro/mes</span></div>
              </div>
            </div>
          </div>

          {/* ENVOLTORIO 2 (Este contiene la tarjeta que se eleva) */}
          <div className="test-wrapper h-full">
            <div className="relative flex flex-col p-8 rounded-3xl bg-[#121214] border border-white/[0.05] hover:border-yellow-500/30 transition-colors duration-300 md:-translate-y-4 h-full">
              <div className="flex gap-1 mb-6">{[1, 2, 3, 4, 5].map((star) => (<Star key={star} className="w-4 h-4 fill-yellow-500 text-yellow-500" />))}</div>
              <p className="text-zinc-300 font-geist text-base leading-relaxed mb-8 flex-1">{`"Soy malísima con la tecnología y me aterraba la idea de montar mi propia página web. El equipo de Kupo me lo dejó todo funcionando en 24 horas. Yo solo tuve que pasarles mi logo por WhatsApp. Una maravilla."`}</p>
              <div className="flex items-center gap-4 border-t border-white/5 pt-6 mt-auto">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-zinc-700 to-zinc-800 border border-white/10 shrink-0" />
                <div><p className="text-white font-bold text-sm font-unbounded">Laura G.</p><p className="text-zinc-500 text-xs font-geist">Centro de Estética</p></div>
                <div className="ml-auto text-right"><span className="block text-blue-400 font-bold text-sm">24h</span><span className="block text-zinc-600 text-[10px] uppercase tracking-wider">Setup</span></div>
              </div>
            </div>
          </div>

          {/* ENVOLTORIO 3 */}
          <div className="test-wrapper h-full">
            <div className="relative flex flex-col p-8 rounded-3xl bg-[#121214] border border-white/[0.05] hover:border-yellow-500/30 transition-colors duration-300 h-full">
              <div className="flex gap-1 mb-6">{[1, 2, 3, 4, 5].map((star) => (<Star key={star} className="w-4 h-4 fill-yellow-500 text-yellow-500" />))}</div>
              <p className="text-zinc-300 font-geist text-base leading-relaxed mb-8 flex-1">{`"Lo que más me molestaba de estar en un directorio era que mi negocio aparecía justo al lado de otros que reventaban los precios. Ahora el cliente entra a mi enlace, ve mi marca y reserva conmigo sin distracciones."`}</p>
              <div className="flex items-center gap-4 border-t border-white/5 pt-6 mt-auto">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-zinc-700 to-zinc-800 border border-white/10 shrink-0" />
                <div><p className="text-white font-bold text-sm font-unbounded">Elena R.</p><p className="text-zinc-500 text-xs font-geist">Salón de Belleza</p></div>
                <div className="ml-auto text-right"><span className="block text-yellow-500 font-bold text-sm">100%</span><span className="block text-zinc-600 text-[10px] uppercase tracking-wider">Propio</span></div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}