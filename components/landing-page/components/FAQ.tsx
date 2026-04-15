import { ChevronDown } from "lucide-react";

export default function FAQ() {
  return (
    <section id="faq" className="relative z-10 w-full py-20 md:py-32 border-t border-white/[0.02] bg-[#09090b]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="flex flex-col items-center text-center mb-12 md:mb-16">
          <h2 className="text-5xl lg:text-6xl font-extrabold leading-[0.90] tracking-tighter mt-4 mb-6 font-unbounded">Resolvemos tus dudas</h2>
          <p className="text-base sm:text-lg text-zinc-400 max-w-2xl font-geist">Todo lo que necesitas saber antes de dar el salto y <b className="text-zinc-300">recuperar el control de tu negocio.</b></p>
        </div>
        <div className="space-y-4">
          <details className="group bg-[#121214] border border-white/[0.05] rounded-2xl overflow-hidden cursor-pointer [&_summary::-webkit-details-marker]:hidden">
            <summary className="flex items-center justify-between px-6 py-5 sm:p-6 text-white font-bold font-unbounded outline-none"><span>¿Tengo algún tipo de permanencia?</span><ChevronDown className="w-5 h-5 text-zinc-500 group-open:rotate-180 transition-transform duration-300 shrink-0 ml-4" /></summary>
            <div className="px-6 pb-6 sm:px-6 sm:pb-6 text-zinc-400 font-geist text-sm sm:text-base leading-relaxed">Ninguna. Pagas mes a mes y puedes cancelar tu suscripción en cualquier momento.</div>
          </details>
          <details className="group bg-[#121214] border border-white/[0.05] rounded-2xl overflow-hidden cursor-pointer [&_summary::-webkit-details-marker]:hidden">
            <summary className="flex items-center justify-between px-6 py-5 sm:p-6 text-white font-bold font-unbounded outline-none"><span>¿Qué pasa si ya tengo clientes en otra app, los pierdo?</span><ChevronDown className="w-5 h-5 text-zinc-500 group-open:rotate-180 transition-transform duration-300 shrink-0 ml-4" /></summary>
            <div className="px-6 pb-6 sm:px-6 sm:pb-6 text-zinc-400 font-geist text-sm sm:text-base leading-relaxed">En absoluto. Tus clientes van a tu negocio por ti, no por la aplicación que usas. Al pasarte a Kupo, simplemente cambias el enlace de reservas en tu biografía de Instagram y WhatsApp. Ellos verán una web más profesional (la tuya) y seguirán reservando como siempre.</div>
          </details>
          <details className="group bg-[#121214] border border-white/[0.05] rounded-2xl overflow-hidden cursor-pointer [&_summary::-webkit-details-marker]:hidden">
            <summary className="flex items-center justify-between px-6 py-5 sm:p-6 text-white font-bold font-unbounded outline-none"><span>No tengo ni idea de informática. ¿Es para mí?</span><ChevronDown className="w-5 h-5 text-zinc-500 group-open:rotate-180 transition-transform duration-300 shrink-0 ml-4" /></summary>
            <div className="px-6 pb-6 sm:px-6 sm:pb-6 text-zinc-400 font-geist text-sm sm:text-base leading-relaxed">Totalmente. Justamente por eso ofrecemos el servicio {`"Llave en mano"`} gratuito. Nuestro equipo técnico se encarga de subir tu logo, configurar los datos de tu negocio y tu paleta de colores. Te entregamos la plataforma 100% lista para recibir citas el primer día.</div>
          </details>
          <details className="group bg-[#121214] border border-white/[0.05] rounded-2xl overflow-hidden cursor-pointer [&_summary::-webkit-details-marker]:hidden">
            <summary className="flex items-center justify-between px-6 py-5 sm:p-6 text-white font-bold font-unbounded outline-none"><span>¿De verdad no cobráis comisiones por reserva?</span><ChevronDown className="w-5 h-5 text-zinc-500 group-open:rotate-180 transition-transform duration-300 shrink-0 ml-4" /></summary>
            <div className="px-6 pb-6 sm:px-6 sm:pb-6 text-zinc-400 font-geist text-sm sm:text-base leading-relaxed">De verdad. Da igual si haces 10 reservas o 1.000 al mes. Creemos que el dinero que generas con tu trabajo debe ir directo a tu bolsillo, por eso solo cobramos la cuota fija mensual. Cero sorpresas a fin de mes.</div>
          </details>
          <details className="group bg-[#121214] border border-white/[0.05] rounded-2xl overflow-hidden cursor-pointer [&_summary::-webkit-details-marker]:hidden">
            <summary className="flex items-center justify-between px-6 py-5 sm:p-6 text-white font-bold font-unbounded outline-none"><span>¿Cómo funciona la prueba gratuita de 30 días?</span><ChevronDown className="w-5 h-5 text-zinc-500 group-open:rotate-180 transition-transform duration-300 shrink-0 ml-4" /></summary>
            <div className="px-6 pb-6 sm:px-6 sm:pb-6 text-zinc-400 font-geist text-sm sm:text-base leading-relaxed">Te configuramos tu web y tienes 30 días enteros para usar todas las funciones. Solo si estás 100% satisfecho al terminar el mes, comienza el pago de la mensualidad. Si no, no pasa nada.</div>
          </details>
        </div>
      </div>
    </section>
  );
}