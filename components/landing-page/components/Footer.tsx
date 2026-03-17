import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="relative z-10 w-full pt-16 pb-8 border-t border-white/[0.05] bg-[#09090b]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-6 inline-flex">
              <Image src="/kupo-sBG.png" alt="Kupo Logo" width={28} height={28} className="grayscale hover:grayscale-0 transition-all duration-300" />
              <span className="font-bold text-xl tracking-tight text-white font-unbounded">Kupo</span>
            </Link>
            <p className="text-zinc-400 font-geist text-sm leading-relaxed max-w-sm">El sistema operativo para negocios que quieren crecer bajo su propia marca. Agenda, web de reservas y fidelización en una sola plataforma.</p>
          </div>
          <div>
            <h4 className="text-white font-bold font-unbounded mb-6">Producto</h4>
            <ul className="space-y-4 text-sm font-geist text-zinc-400">
              <li><Link href="#funciones" className="hover:text-yellow-500 transition-colors">Características</Link></li>
              <li><Link href="#como-funciona" className="hover:text-yellow-500 transition-colors">Cómo Funciona</Link></li>
              <li><Link href="#precios" className="hover:text-yellow-500 transition-colors">Precios</Link></li>
              <li><Link href="#faq" className="hover:text-yellow-500 transition-colors">Preguntas Frecuentes</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold font-unbounded mb-6">Compañía</h4>
            <ul className="space-y-4 text-sm font-geist text-zinc-400">
              <li><Link href="/login" className="hover:text-yellow-500 transition-colors">Iniciar Sesión</Link></li>
              <li><Link href="#" className="hover:text-yellow-500 transition-colors">Soporte y Contacto</Link></li>
              <li><Link href="#" className="hover:text-yellow-500 transition-colors">Aviso Legal</Link></li>
              <li><Link href="#" className="hover:text-yellow-500 transition-colors">Política de Privacidad</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/[0.05] pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-zinc-600 text-sm font-geist">© {new Date().getFullYear()} Kupo. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}