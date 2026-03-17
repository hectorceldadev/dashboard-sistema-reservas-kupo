'use client'

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

export default function CtaFinal() {
  const container = useRef<HTMLElement>(null);

  useGSAP(() => {
    // Animación en cascada para los elementos del CTA
    gsap.fromTo(".cta-element",
      { y: 40, opacity: 0 },
      { 
        y: 0, 
        opacity: 1, 
        duration: 0.8, 
        stagger: 0.2, 
        ease: "power3.out",
        scrollTrigger: {
          trigger: container.current,
          start: "top 80%", // Se dispara cuando la sección asoma por abajo
          toggleActions: 'play none none reverse'
        }
      }
    );
  }, { scope: container });

  return (
    <section ref={container} className="relative z-10 w-full py-24 md:py-32 border-t border-white/[0.02] bg-[#09090b] overflow-hidden">
      
      {/* Resplandor central de enfoque */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] md:w-[50%] h-[60%] bg-yellow-500/10 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10 flex flex-col items-center text-center">
        <h2 className="cta-element text-4xl sm:text-5xl md:text-6xl font-bold font-unbounded text-white mb-6 leading-tight">
          Es hora de ser el dueño <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-yellow-600">de tu propio éxito.</span>
        </h2>
        
        <p className="cta-element text-lg md:text-xl text-zinc-400 mb-10 font-geist max-w-2xl">
          Únete a los profesionales que ya no pagan comisiones abusivas por sus propias reservas. <b className="text-zinc-300">Da el salto hoy y nosotros te montamos la web gratis.</b>
        </p>
        
        <Link href="/register" className="cta-element inline-flex items-center justify-center gap-2 bg-yellow-500 hover:bg-yellow-400 text-black font-bold px-10 py-5 rounded-2xl transition-all duration-300 hover:shadow-[0_0_40px_rgba(234,179,8,0.4)] hover:-translate-y-1 text-lg group">
          Comenzar 30 días gratis <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </section>
  );
}