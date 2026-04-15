import { MessageSquare, Wand2, Rocket } from "lucide-react";

export default function HowItWorks() {
  return (
    <section id="como-funciona" className="relative z-10 w-full py-20 md:py-28 lg:py-32 border-t border-white/[0.02]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col items-center text-center mb-16 md:mb-24">
          <h2 className="text-5xl lg:text-6xl font-extrabold leading-[0.90] tracking-tighter mt-4 mb-6 font-unbounded">
            Tu web lista <br /> <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 to-yellow-500">sin mover un dedo.</span>
          </h2>
          <p className="text-base sm:text-lg text-zinc-400 max-w-2xl font-geist px-2 sm:px-0">
            Olvídate de tutoriales y creadores de webs complicados. <b className="text-zinc-300">Nuestro equipo se encarga de todo el trabajo técnico</b> para que tú te dediques a lo que mejor sabes hacer: tu negocio.
          </p>
        </div>
        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-8">
          <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-[1px] bg-gradient-to-r from-transparent via-zinc-700 to-transparent" />
          <div className="relative flex flex-col items-center text-center group">
            <div className="w-24 h-24 rounded-full bg-[#121214] border-2 border-zinc-800 flex items-center justify-center mb-8 relative z-10 group-hover:border-yellow-500/50 group-hover:bg-yellow-500/5 transition-colors duration-500">
              <MessageSquare className="w-10 h-10 text-yellow-500" />
              <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-yellow-500 text-black font-bold flex items-center justify-center border-4 border-[#09090b]">1</div>
            </div>
            <h3 className="text-xl font-bold text-white font-unbounded mb-3">Pide tu plataforma</h3>
            <p className="text-zinc-400 font-geist text-sm leading-relaxed max-w-[280px]">
              Regístrate y dinos que quieres empezar. Solo te pediremos tu logo, tus colores corporativos y la lista de servicios que ofreces.
            </p>
          </div>
          <div className="relative flex flex-col md:mt-10 items-center text-center group">
            <div className="w-24 h-24 rounded-full bg-[#121214] border-2 border-zinc-800 flex items-center justify-center mb-8 relative z-10 group-hover:border-yellow-500/50 group-hover:bg-yellow-500/5 transition-colors duration-500 md:translate-y-6">
              <Wand2 className="w-10 h-10 text-yellow-500" />
              <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-yellow-500 text-black font-bold flex items-center justify-center border-4 border-[#09090b]">2</div>
            </div>
            <h3 className="text-xl font-bold text-white font-unbounded mb-3 md:mt-6">Nosotros la montamos</h3>
            <p className="text-zinc-400 font-geist text-sm leading-relaxed max-w-[280px]">
              Hacemos la magia. Nuestro equipo adapta nuestro sistema de reservas a tu marca, dejándolo configurado y listo para usar.
            </p>
          </div>
          <div className="relative flex flex-col items-center text-center group">
            <div className="w-24 h-24 rounded-full bg-[#121214] border-2 border-zinc-800 flex items-center justify-center mb-8 relative z-10 group-hover:border-yellow-500/50 group-hover:bg-yellow-500/5 transition-colors duration-500">
              <Rocket className="w-10 h-10 text-yellow-500" />
              <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-yellow-500 text-black font-bold flex items-center justify-center border-4 border-[#09090b]">3</div>
            </div>
            <h3 className="text-xl font-bold text-white font-unbounded mb-3">Empieza a recibir citas</h3>
            <p className="text-zinc-400 font-geist text-sm leading-relaxed max-w-[280px]">
              Te entregamos tu enlace único (ej. barbershop.es). Ponlo en tu Instagram, compártelo por WhatsApp y mira cómo se llena tu agenda.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}