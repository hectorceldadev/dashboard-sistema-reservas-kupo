import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Image from "next/image";

export default function Hero() {
  return (
    <div className="w-full bg-black relative overflow-hidden pb-8 md:pb-0 md:min-h-screen">
      {/* Tropical Dusk Glow Background */}

      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[700px] h-[500px] rounded-full bg-yellow-500/10 blur-[120px]" />
        <div className="absolute top-[5%] left-[10%] w-[300px] h-[300px] rounded-full bg-amber-600/8 blur-[100px]" />
        <div className="absolute top-[5%] right-[10%] w-[250px] h-[250px] rounded-full bg-yellow-300/8 blur-[100px]" />
      </div>
  {/* Amber Glow Background */}
  <div
    className="absolute inset-0 z-0"
    style={{
      backgroundImage: `
        radial-gradient(125% 125% at 50% 10%, #000000 50%, #f59e0b 100%)
      `,
      backgroundSize: "100% 100%",
    }}
  />
  {/* Your Content/Components */}

      <main className="relative z-10 max-w-6xl mx-auto px-6 pt-16 md:pt-24">
        <div className="flex flex-col items-center gap-8">
          {/* Text block */}
          <div className="flex flex-col justify-center items-center text-center mt-8">
            <h1 className="text-6xl lg:text-7xl font-extrabold leading-[0.90] tracking-tighter mt-4 mb-6 font-unbounded">
              Tu web. Tus reservas.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-500">
                Tus clientes.
              </span>
            </h1>
            <p className="text-lg text-zinc-400 mb-10 max-w-xl leading-relaxed font-geist">
              Gestiona tu negocio sin preocuparte. <br />
              Reservas, clientes e ingresos en un solo lugar.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
              <Link
                href="/register"
                className="w-full rounded-full sm:w-auto flex items-center justify-center gap-2 bg-yellow-500 hover:bg-yellow-400 text-black font-bold px-8 py-4 transition-all duration-300 shadow-[0_0_30px_rgba(234,179,8,0.3)] hover:shadow-[0_0_30px_rgba(234,179,8,0.6)] hover:-translate-y-0.5"
              >
                Comenzar ahora
              </Link>
            </div>
          </div>

          {/* Image block */}
          <div className="relative w-full mb-10 aspect-[10/8] sm:aspect-[16/9] md:h-[600px]">
            <Image
              src="/landing/hero-landing.webp"
              alt="Preview Kupo"
              fill
              className="object-contain object-top"
              priority
            />
          </div>
        </div>
      </main>
    </div>
  );
}