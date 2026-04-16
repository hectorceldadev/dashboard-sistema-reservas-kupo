import { Smartphone, CalendarDays, Users, BellRing } from "lucide-react";

export default function Features() {
  return (
    <section id="funciones" className="relative z-10 w-full py-20 md:py-28 lg:py-32 border-t border-white/[0.02]">
      <div className="absolute top-0 inset-x-0 h-px w-full bg-gradient-to-r from-transparent via-yellow-500/20 to-transparent" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] md:w-[80%] h-[50%] bg-yellow-500/5 blur-[120px] md:blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col items-center text-center mb-16 md:mb-20 lg:mb-24">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/30 mb-6">
            <span className="text-[10px] sm:text-xs font-semibold text-yellow-500 uppercase">El control vuelve a ti</span>
          </div>
          <h2 className="text-5xl lg:text-6xl font-extrabold leading-[0.90] tracking-tighter mt-4 mb-6 font-unbounded">
            Tu negocio. <br className="block sm:hidden" /> 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-500">Tus reglas.</span>
          </h2>
          <p className="text-base sm:text-lg text-zinc-400 max-w-2xl font-geist px-2 sm:px-0">
            <b className="text-zinc-300">Todo lo que necesitas para operar como una gran marca,</b> desde tu propia página web hasta la fidelización de tu base de clientes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          <div className="group relative bg-[#121214] rounded-3xl border border-white/[0.05] px-6 pt-6 sm:px-8 sm:pt-8 hover:border-yellow-500/30 transition-all duration-500 overflow-hidden flex flex-col min-h-[400px] sm:min-h-[420px]">
            <div className="absolute top-0 right-0 w-48 h-48 sm:w-64 sm:h-64 bg-yellow-500/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 group-hover:bg-yellow-500/20 transition-all duration-500" />
            <div className="relative z-10">
              <div className="w-12 h-12 bg-yellow-500/10 border border-yellow-500/20 rounded-2xl flex items-center justify-center mb-6 text-yellow-500">
                <Smartphone className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3 font-unbounded">Escaparate 100% Tuyo</h3>
              <p className="text-zinc-400 font-geist text-sm leading-relaxed mb-8">
                Una web de reservas profesional con tu logo, tus colores y tus fotos. <b className="text-zinc-300">Sin anuncios de otros salones intentando robarte al cliente.</b>
              </p>
            </div>
            <div className="mt-auto relative w-full flex justify-center translate-y-4 group-hover:translate-y-0 transition-transform duration-500 animate-float">
              <div className="w-48 h-40 bg-zinc-950 rounded-t-2xl border border-white/10 border-b-0 overflow-hidden flex flex-col items-center p-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-amber-600 mb-3 shadow-lg"></div>
                <div className="w-24 h-3 bg-white/10 rounded-full mb-4"></div>
                <div className="w-full h-10 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black text-[10px] font-bold rounded-xl flex items-center justify-center">Reservar Cita</div>
              </div>
            </div>
          </div>

          <div className="group relative bg-[#121214] rounded-3xl border border-white/[0.05] px-6 pt-6 sm:px-8 sm:pt-8 hover:border-blue-500/30 transition-all duration-500 overflow-hidden flex flex-col min-h-[400px] sm:min-h-[420px]">
            <div className="absolute bottom-0 left-0 w-48 h-48 sm:w-64 sm:h-64 bg-blue-500/10 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2 group-hover:bg-blue-500/20 transition-all duration-500" />
            <div className="relative z-10">
              <div className="w-12 h-12 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex items-center justify-center mb-6 text-blue-400">
                <CalendarDays className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3 font-unbounded">Agenda Inteligente</h3>
              <p className="text-zinc-400 font-geist text-sm leading-relaxed mb-8">
                Evita solapamientos. <b className="text-zinc-300">Gestiona los horarios y turnos de todo tu equipo</b> desde una única pantalla rápida e intuitiva.
              </p>
            </div>
            <div className="mt-auto relative w-full h-38 bg-[#18181b] rounded-t-xl border border-white/10 border-b-0 overflow-hidden translate-y-4 group-hover:translate-y-0 transition-transform duration-500 p-4 animate-float">
              <div className="flex gap-2">
                <div className="flex flex-col gap-2 w-10 sm:w-12 text-[9px] sm:text-[10px] text-zinc-500 font-mono mt-2">
                  <span>10:00</span><span>11:00</span><span>12:00</span><span>13:00</span><span>14:00</span>
                </div>
                <div className="flex-1 relative">
                  <div className="absolute top-2 left-0 w-full h-12 bg-blue-500/20 border border-blue-500/30 rounded-md p-2">
                    <div className="w-10 sm:w-12 h-2 bg-blue-500/40 rounded-full mb-1"></div>
                    <div className="w-16 sm:w-20 h-2 bg-blue-500/20 rounded-full"></div>
                  </div>
                  <div className="absolute top-16 left-4 sm:left-8 w-3/4 h-10 bg-white/5 border border-white/10 rounded-md p-2"></div>
                </div>
              </div>
            </div>
          </div>

          <div className="group relative md:col-span-2 lg:col-span-1 bg-[#121214] rounded-3xl border border-white/[0.05] px-6 pt-6 sm:px-8 sm:pt-8 hover:border-emerald-500/30 transition-all duration-500 overflow-hidden flex flex-col min-h-[400px] sm:min-h-[420px]">
            <div className="absolute top-1/2 right-0 w-48 h-48 sm:w-64 sm:h-64 bg-emerald-500/10 rounded-full blur-[80px] translate-x-1/2 group-hover:bg-emerald-500/20 transition-all duration-500" />
            <div className="relative z-10">
              <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-center mb-6 text-emerald-400">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3 font-unbounded">Tus clientes, tu base</h3>
              <p className="text-zinc-400 font-geist text-sm leading-relaxed mb-8 md:max-w-md lg:max-w-full">
                <b className="text-zinc-300">Tú eres el dueño de los datos.</b> Historial de visitas y recordatorios automáticos por push e email con el nombre de tu marca.
              </p>
            </div>
            <div className="mt-auto relative w-full flex items-center justify-center lg:justify-center md:justify-end translate-y-2 group-hover:-translate-y-2 transition-transform duration-500 animate-float">
              <div className="w-full max-w-[220px] sm:max-w-[240px] bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-4 shadow-xl">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-200 to-emerald-600 flex items-center justify-center shrink-0">
                    <BellRing className="w-4 h-4 text-black" />
                  </div>
                  <div>
                    <p className="text-[11px] sm:text-xs font-bold text-white leading-tight mb-0.5">Peluquería Ilumina</p>
                    <p className="text-[9px] sm:text-[10px] text-zinc-500 leading-tight">Justo ahora</p>
                  </div>
                </div>
                <div className="bg-white/5 p-3 rounded-xl border border-white/5 text-[11px] sm:text-xs text-zinc-300 leading-relaxed">
                  {`"Hola, te recordamos tu cita de mañana a las 16:00h en nuestro salón."`}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}