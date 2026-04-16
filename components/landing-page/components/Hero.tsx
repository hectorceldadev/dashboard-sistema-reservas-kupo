import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import RotatingText from "@/lib/RotatingText";

export default function Hero() {
  return (
    <div className="w-full bg-black relative overflow-hidden pb-8 md:pb-0 md:min-h-screen">
      {/* Combined Background */}
      <div
        className="absolute hidden lg:block inset-0 z-0"
        style={{
          background: `
            radial-gradient(ellipse 80% 60% at 50% 0%, rgba(251, 191, 36, 0.25), transparent 70%),
            radial-gradient(125% 125% at 50% 10%, #000000 50%, #f59e0b 100%)
          `,
        }}
      />
      <div
        className="absolute lg:hidden inset-0 z-0"
        style={{
          background: `
            radial-gradient(ellipse 80% 60% at 50% 0%, rgba(251, 191, 36, 0.25), transparent 70%),
            radial-gradient(125% 125% at 50% 10%, #000000 55%, #f59e0b 100%)
          `,
        }}
      />

      <main className="relative z-10 max-w-6xl mx-auto px-6 pt-16 md:pt-24">
        <div className="flex flex-col items-center gap-8 stagger-container">
          {/* Text block */}
          <div className="flex flex-col justify-center items-center text-center mt-8 stagger-container">
            <h1 className="text-6xl lg:text-7xl font-extrabold leading-[0.90] tracking-tighter mt-4 mb-6 font-unbounded">
              Tu web. <br className="md:hidden" /> Tus reservas.
              {/* Línea del rotating: bloque propio centrado */}
              <span className="flex items-center justify-center gap-2 text-yellow-400">
                Tus <span className="lg:hidden block">reglas.</span>
                {/* Contenedor de ancho fijo = palabra más larga */}
                <span className="justify-start hidden lg:block w-[260px] lg:w-[310px] overflow-hidden">
                  <RotatingText
                    texts={["ingresos.","clientes.", "ingresos.", "reglas."]}
                    mainClassName="px-2 py-1 justify-center items-center text-yellow-400 rounded-md overflow-hidden"
                    staggerFrom="last"
                    initial={{ y: "110%" }}
                    animate={{ y: 0 }}
                    exit={{ y: "-110%" }}
                    staggerDuration={0.025}
                    splitLevelClassName="overflow-hidden"
                    transition={{ type: "spring", damping: 30, stiffness: 400 }}
                    rotationInterval={2000}
                    splitBy="characters"
                    auto
                    loop
                  />
                </span>
              </span>
            </h1>
            <p className="text-lg text-zinc-400 mb-10 max-w-xl leading-relaxed font-geist">
              Gestiona tu negocio sin preocuparte. <br />
              Reservas, clientes e ingresos en un solo lugar.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
              <Link
                href="/register"
                className="w-full rounded-full sm:w-auto flex items-center justify-center gap-2 bg-yellow-500 hover:bg-yellow-400 text-black font-bold px-8 py-4 transition-all duration-300 shadow-[0_0_30px_rgba(234,179,8,0.4)] hover:shadow-[0_0_30px_rgba(234,179,8,0.6)] hover:-translate-y-0.5"
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