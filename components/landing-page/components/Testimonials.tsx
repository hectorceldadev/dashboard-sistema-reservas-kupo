'use client'

import { Star } from "lucide-react";
import Image from "next/image";

export default function Testimonials() {

  return (
    <section id="testimonios" className="relative z-10 w-full py-20 md:py-32 border-t border-white/[0.02] bg-[#09090b] overflow-hidden">
      <div className="absolute top-1/2 left-0 w-[40%] h-[50%] bg-yellow-500/5 blur-[120px] rounded-full pointer-events-none -translate-y-1/2 -translate-x-1/2" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        
        {/* ENCABEZADO */}
        <div className="flex flex-col items-center text-center mb-16 md:mb-20">
          <h2 className="text-5xl lg:text-6xl font-extrabold leading-[0.90] tracking-tighter mt-4 mb-6 font-unbounded">
            Negocios que ya <br/> <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 to-yellow-500">han dado el salto.</span>
          </h2>
          <p className="text-base sm:text-lg text-zinc-400 max-w-2xl font-geist px-2 sm:px-0">
            Únete a los profesionales que <b className="text-zinc-300">han dejado de pagar comisiones abusivas y han recuperado el control</b> absoluto de sus clientes.
          </p>
        </div>

        {/* TARJETAS DE TESTIMONIOS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
          
          {/* ENVOLTORIO 1 */}
          <div className="h-full">
            <div className="relative flex flex-col p-8 rounded-3xl bg-[#121214] border border-white/[0.05] hover:border-yellow-500/30 transition-colors duration-300 h-full">
              <div className="flex gap-1 mb-6">{[1, 2, 3, 4, 5].map((star) => (<Star key={star} className="w-4 h-4 fill-yellow-500 text-yellow-500" />))}</div>
              <p className="text-zinc-300 font-geist text-base leading-relaxed mb-8 flex-1">{`"Estaba pagando 70€ al mes en otra app de reservas. Desde que uso Kupo, pago mi cuota fija y el resto es beneficio limpio"`}</p>
              <div className="flex items-center gap-4 border-t border-white/5 pt-6 mt-auto">
                <div className="relative w-12 h-12 rounded-full  border border-white/10 " >
                  <Image 
                    src={'/landing/josemartinez.jpg'}
                    alt="Jose"
                    fill
                    className="object-contain rounded-full"
                  />
                </div>
                <div><p className="text-white font-bold text-sm font-unbounded">José Martínez</p><p className="text-zinc-500 text-xs font-geist">JS Barber</p></div>
                <div className="ml-auto text-right"><span className="block text-emerald-400 font-bold text-sm">+45€</span><span className="block text-zinc-600 text-[10px] uppercase tracking-wider">Ahorro/mes</span></div>
              </div>
            </div>
          </div>

          {/* ENVOLTORIO 2 (Este contiene la tarjeta que se eleva) */}
          <div className="h-full">
            <div className="relative flex flex-col p-8 rounded-3xl bg-[#121214] border border-white/[0.05] hover:border-yellow-500/30 transition-colors duration-300 md:-translate-y-4 h-full">
              <div className="flex gap-1 mb-6">{[1, 2, 3, 4, 5].map((star) => (<Star key={star} className="w-4 h-4 fill-yellow-500 text-yellow-500" />))}</div>
              <p className="text-zinc-300 font-geist text-base leading-relaxed mb-8 flex-1">{`Soy malísima con la tecnología y me aterraba la idea de montar mi propia página web. El equipo de Kupo me lo dejó todo funcionando en 24 horas`}</p>
              <div className="flex items-center gap-4 border-t border-white/5 pt-6 mt-auto">
                <div className="relative w-12 h-12 rounded-full  border border-white/10 " >
                  <Image 
                    src={'/landing/andrealopez.png'}
                    alt="Jose"
                    fill
                    className="object-cover rounded-full"
                  />
                </div>
                <div><p className="text-white font-bold text-sm font-unbounded">Andrea López</p><p className="text-zinc-500 text-xs font-geist">AL Nails & Beauty</p></div>
                <div className="ml-auto text-right"><span className="block text-blue-400 font-bold text-sm">24h</span><span className="block text-zinc-600 text-[10px] uppercase tracking-wider">Instalación</span></div>
              </div>
            </div>
          </div>

          {/* ENVOLTORIO 3 */}
          <div className="h-full">
            <div className="relative flex flex-col p-8 rounded-3xl bg-[#121214] border border-white/[0.05] hover:border-yellow-500/30 transition-colors duration-300 h-full">
              <div className="flex gap-1 mb-6">{[1, 2, 3, 4, 5].map((star) => (<Star key={star} className="w-4 h-4 fill-yellow-500 text-yellow-500" />))}</div>
              <p className="text-zinc-300 font-geist text-base leading-relaxed mb-8 flex-1">{`Desde que estoy en Kupo me quito un peso de encima, antes mi negocio aparecía justo al lado de otros que reventaban los precios, ahora tengo mi espacio independiente`}</p>
              <div className="flex items-center gap-4 border-t border-white/5 pt-6 mt-auto">
                <div className="relative w-12 h-12 rounded-full  border border-white/10 " >
                  <Image 
                    src={'/landing/davidiranzo.jpg'}
                    alt="Jose"
                    fill
                    className="object-cover rounded-full"
                  />
                </div>
                <div><p className="text-white font-bold text-sm font-unbounded">David Iranzo</p><p className="text-zinc-500 text-xs font-geist">Fisio & Tu</p></div>
                <div className="ml-auto text-right"><span className="block text-yellow-500 font-bold text-sm">100%</span><span className="block text-zinc-600 text-[10px] uppercase tracking-wider">Propio</span></div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}