'use client'

import { MessageSquare, Wand2, Rocket } from "lucide-react";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

export default function HowItWorks() {
  const container = useRef<HTMLElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container.current,
        start: "top 80%", // Se dispara al 80% de la pantalla
        toggleActions: 'play none none reverse'
      }
    });

    // 1. Encabezado
    tl.fromTo(".hiw-text", 
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: "power3.out" }
    )
    
    // 2. La línea conectora se "dibuja" de izquierda a derecha
    .fromTo(".hiw-line",
      { scaleX: 0, opacity: 0 },
      { scaleX: 1, opacity: 1, duration: 1, ease: "power3.inOut", transformOrigin: "left center" },
      "-=0.4"
    )

    // 3. Los 3 pasos aparecen en cascada acompañando a la línea
    .fromTo(".hiw-step",
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, stagger: 0.25, ease: "power3.out" },
      "-=0.8" // Solapamos para que los pasos suban mientras la línea se dibuja
    );

  }, { scope: container });

  return (
    <section ref={container} id="como-funciona" className="relative z-10 w-full py-20 md:py-28 lg:py-32 border-t border-white/[0.02]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        <div className="flex flex-col items-center text-center mb-16 md:mb-24">
          <h2 className="hiw-text text-3xl sm:text-4xl md:text-5xl font-bold font-unbounded text-white mb-6">
            Tu web lista <br /> <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-200 to-yellow-600">sin mover un dedo.</span>
          </h2>
          <p className="hiw-text text-base sm:text-lg text-zinc-400 max-w-2xl font-geist px-2 sm:px-0">
            Olvídate de tutoriales y creadores de webs complicados. <b className="text-zinc-300">Nuestro equipo se encarga de todo el trabajo técnico</b> para que tú te dediques a lo que mejor sabes hacer: tu negocio.
          </p>
        </div>

        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-8">
          
          {/* Línea conectora visual para Desktop */}
          <div className="hiw-line hidden md:block absolute top-12 left-[15%] right-[15%] h-[1px] bg-gradient-to-r from-transparent via-zinc-700 to-transparent" />
          
          {/* Paso 1 */}
          <div className="hiw-step relative flex flex-col items-center text-center group">
            <div className="w-24 h-24 rounded-full bg-[#121214] border-2 border-zinc-800 flex items-center justify-center mb-8 relative z-10 group-hover:border-yellow-500/50 group-hover:bg-yellow-500/5 transition-colors duration-500">
              <MessageSquare className="w-10 h-10 text-yellow-500" />
              <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-yellow-500 text-black font-bold flex items-center justify-center border-4 border-[#09090b]">1</div>
            </div>
            <h3 className="text-xl font-bold text-white font-unbounded mb-3">Pide tu plataforma</h3>
            <p className="text-zinc-400 font-geist text-sm leading-relaxed max-w-[280px]">
              Regístrate y dinos que quieres empezar. Solo te pediremos tu logo, tus colores corporativos y la lista de servicios que ofreces.
            </p>
          </div>

          {/* Paso 2 */}
          <div className="hiw-step relative flex flex-col md:mt-10 items-center text-center group">
            <div className="w-24 h-24 rounded-full bg-[#121214] border-2 border-zinc-800 flex items-center justify-center mb-8 relative z-10 group-hover:border-yellow-500/50 group-hover:bg-yellow-500/5 transition-colors duration-500 md:translate-y-6">
              <Wand2 className="w-10 h-10 text-yellow-500" />
              <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-yellow-500 text-black font-bold flex items-center justify-center border-4 border-[#09090b]">2</div>
            </div>
            <h3 className="text-xl font-bold text-white font-unbounded mb-3 md:mt-6">Nosotros la montamos</h3>
            <p className="text-zinc-400 font-geist text-sm leading-relaxed max-w-[280px]">
              Hacemos la magia. Nuestro equipo adapta nuestro sistema de reservas a tu marca, dejándolo configurado y listo para usar.
            </p>
          </div>

          {/* Paso 3 */}
          <div className="hiw-step relative flex flex-col items-center text-center group">
            <div className="w-24 h-24 rounded-full bg-[#121214] border-2 border-zinc-800 flex items-center justify-center mb-8 relative z-10 group-hover:border-yellow-500/50 group-hover:bg-yellow-500/5 transition-colors duration-500">
              <Rocket className="w-10 h-10 text-yellow-500" />
              <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-yellow-500 text-black font-bold flex items-center justify-center border-4 border-[#09090b]">3</div>
            </div>
            <h3 className="text-xl font-bold text-white font-unbounded mb-3">Empieza a recibir citas</h3>
            <p className="text-zinc-400 font-geist text-sm leading-relaxed max-w-[280px]">
              Te entregamos tu enlace único (ej. kupo.es/tu-salon). Ponlo en tu Instagram, compártelo por WhatsApp y mira cómo se llena tu agenda.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}