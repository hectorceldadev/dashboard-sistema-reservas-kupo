import Link from "next/link";
import { Check, Sparkles, Megaphone, BellRing } from "lucide-react";

export default function Pricing() {
  return (
    <section id="precios" className="relative z-10 w-full py-20 md:py-32 border-t border-white/[0.02]">
      <div className="absolute top-0 right-1/4 w-[60%] h-[50%] bg-yellow-500/5 blur-[150px] rounded-full pointer-events-none" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="flex flex-col items-center text-center mb-16 md:mb-20">
          <h2 className="text-5xl lg:text-6xl font-extrabold leading-[0.90] tracking-tighter mt-4 mb-6 font-unbounded">
            Precios simples. <br className=""/> <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 to-yellow-500">Sin comisiones ocultas.</span>
          </h2>
          <p className="text-base sm:text-lg text-zinc-400 max-w-2xl font-geist px-2 sm:px-0">
            Pagas una cuota fija al mes. Sin límites de empleados ni sorpresas en la factura. Jamás nos quedaremos con un porcentaje de tu trabajo.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl px-2 mx-auto items-stretch">
          <div className="relative flex flex-col p-8 sm:p-10 rounded-3xl bg-[#18181b] border-2 border-yellow-500/50 shadow-[0_0_40px_rgba(234,179,8,0.1)] h-full z-20 md:scale-105">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 py-1.5 bg-yellow-500 text-black text-xs font-bold uppercase tracking-wider rounded-full shadow-lg">El más elegido</div>
            <h3 className="text-2xl font-bold text-yellow-500 font-unbounded mb-2">Profesional</h3>
            <p className="text-sm text-zinc-400 font-geist mb-6 h-10">Todo lo que necesitas para operar y crecer con tu propia marca hoy mismo.</p>
            <div className="mb-8">
              <span className="text-5xl font-bold text-white font-unbounded">€25</span>
              <span className="text-zinc-500 text-base font-medium"> /mes</span>
            </div>
            <div className="space-y-5 font-geist text-sm mb-10 flex-1">
              <div className="flex items-start gap-3 text-white"><Check className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" /><span className="font-semibold">Web de reservas propia y exclusiva</span></div>
              <div className="flex items-start gap-3 text-white"><Check className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" /><span className="font-semibold">Montaje {"Llave en mano"} por nuestro equipo</span></div>
              <div className="flex items-start gap-3 text-zinc-300"><Check className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />Agenda inteligente para todo tu equipo</div>
              <div className="flex items-start gap-3 text-zinc-300"><Check className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />Recordatorios automáticos (Push/Email)</div>
              <div className="flex items-start gap-3 text-zinc-300"><Check className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />Empleados y reservas 100% ilimitadas</div>
            </div>
            <Link href="/register" className="w-full py-4 rounded-xl bg-yellow-500 text-black font-bold hover:bg-yellow-400 hover:scale-[1.02] transition-all duration-300 text-center shadow-[0_0_20px_rgba(234,179,8,0.3)]">Empezar 30 días gratis</Link>
          </div>

          <div className="relative flex flex-col p-8 sm:p-10 rounded-3xl bg-[#121214] border border-white/[0.05] h-full overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-fuchsia-500/5 rounded-full blur-[80px] pointer-events-none" />
            <div className="inline-flex items-center gap-2 w-fit px-3 py-1 bg-white/[0.03] border border-white/[0.05] rounded-full mb-4">
              <Sparkles className="w-3 h-3 text-fuchsia-400" /><span className="text-xs font-semibold text-fuchsia-400 tracking-wider uppercase">Próximamente</span>
            </div>
            <h3 className="text-2xl font-bold text-white font-unbounded mb-2">Premium</h3>
            <p className="text-sm text-zinc-400 font-geist mb-6 h-10">Fideliza a tus clientes e impulsa tus ventas en piloto automático.</p>
            <div className="mb-8 opacity-60">
              <span className="text-5xl font-bold text-white font-unbounded">€39</span><span className="text-zinc-500 text-base font-medium"> /mes</span>
            </div>
            <div className="space-y-5 font-geist text-sm mb-10 flex-1 opacity-80">
              <div className="flex items-start gap-3 text-zinc-300"><Check className="w-5 h-5 text-zinc-600 shrink-0 mt-0.5" /> Todo lo incluido en el plan Profesional</div>
              <div className="flex items-start gap-3 text-white"><Megaphone className="w-5 h-5 text-fuchsia-400 shrink-0 mt-0.5" /> <span className="font-semibold text-fuchsia-100">Campañas de Marketing Integradas</span></div>
              <div className="flex items-start gap-3 text-zinc-300"><BellRing className="w-5 h-5 text-fuchsia-500/70 shrink-0 mt-0.5" /> Notificaciones Push masivas a clientes</div>
              <div className="flex items-start gap-3 text-zinc-300"><Check className="w-5 h-5 text-zinc-600 shrink-0 mt-0.5" /> Email marketing para promociones</div>
              <div className="flex items-start gap-3 text-zinc-300"><Check className="w-5 h-5 text-zinc-600 shrink-0 mt-0.5" /> Automatizaciones (ej. Feliz Cumpleaños)</div>
            </div>
            <button disabled className="w-full py-4 rounded-xl border border-white/5 bg-white/[0.02] text-zinc-500 font-bold cursor-not-allowed">En construcción...</button>
          </div>
        </div>
      </div>
    </section>
  );
}