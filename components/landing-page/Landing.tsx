import Navbar from "@/components/landing-page/components/NavBar";
import Hero from "@/components/landing-page/components/Hero";
import Features from "@/components/landing-page/components/Features";
import Comparison from "@/components/landing-page/components/Comparision";
import HowItWorks from "@/components/landing-page/components/HowItWorks";
import Pricing from "@/components/landing-page/components/Pricing";
import Testimonials from "@/components/landing-page/components/Testimonials";
import FAQ from "@/components/landing-page/components/FAQ";
import CtaFinal from "@/components/landing-page/components/CtaFinal";
import Footer from "@/components/landing-page/components/Footer";

export default function Landing() {
  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-50 overflow-hidden relative font-sans">

      {/* Efectos de luz de fondo */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-yellow-500/10 rounded-full blur-[120px] pointer-events-none mix-blend-screen" />
      <div className="absolute top-[20%] right-[-5%] w-[30%] h-[40%] bg-amber-600/10 rounded-full blur-[120px] pointer-events-none mix-blend-screen" />

      <Navbar />
      <Hero />
      <Features />
      <Comparison />
      <HowItWorks />
      <Pricing />
      <Testimonials />
      <FAQ />
      <CtaFinal />
      <Footer />

      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes float {
          0%, 100% { transform: translateY(0) translateZ(50px); }
          50% { transform: translateY(-10px) translateZ(50px); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}} />
    </div>
  );
}