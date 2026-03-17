'use client'

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-4 inset-x-0 z-50 flex justify-center px-4 md:px-6 pointer-events-none stagger-container">
      <div className="pointer-events-auto w-full max-w-5xl bg-[#121214]/80 backdrop-blur-xl border border-white/[0.08] rounded-full px-4 md:px-6 h-16 flex items-center justify-between shadow-[0_8px_30px_rgb(0,0,0,0.5)] stagger-container">
        <Link href="/" className="flex items-center gap-3 group">
          <Image src="/kupo-sBG.png" alt="Kupo Logo" width={28} height={28} className="group-hover:scale-105 transition-transform duration-300" />
          <span className="font-bold text-lg tracking-tight text-white font-unbounded hidden sm:block">Kupo</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          <Link href="#funciones" className="text-sm font-medium text-zinc-300 hover:text-yellow-400 transition-colors">Funciones</Link>
          <Link href="#como-funciona" className="text-sm font-medium text-zinc-300 hover:text-yellow-400 transition-colors">Cómo funciona</Link>
          <Link href="#testimonios" className="text-sm font-medium text-zinc-300 hover:text-yellow-400 transition-colors">Testimonios</Link>
          <Link href="#precios" className="text-sm font-medium text-zinc-300 hover:text-yellow-400 transition-colors">Precios</Link>
        </nav>

        <div className="flex items-center gap-3">
          <Link href="/login" className="hidden sm:block text-sm font-medium text-zinc-300 hover:text-white transition-colors px-4 py-2">Entrar</Link>
          <Link href="/register" className="hidden sm:flex items-center justify-center text-sm font-bold bg-yellow-500 text-black px-5 py-2 rounded-full hover:bg-yellow-400 hover:scale-105 transition-all duration-300 shadow-[0_0_15px_rgba(234,179,8,0.2)]">Empezar gratis</Link>
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden p-2 text-zinc-300 hover:text-white bg-white/5 rounded-full border border-white/10 transition-colors">
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="absolute top-20 inset-x-4 p-6 bg-[#121214] border border-white/10 rounded-3xl shadow-2xl backdrop-blur-2xl md:hidden pointer-events-auto flex flex-col gap-6 animate-in fade-in slide-in-from-top-4 duration-200">
          <nav className="flex flex-col gap-4">
            <Link href="#funciones" onClick={() => setIsMenuOpen(false)} className="text-base font-medium text-zinc-300 hover:text-yellow-400">Funciones</Link>
            <Link href="#como-funciona" onClick={() => setIsMenuOpen(false)} className="text-base font-medium text-zinc-300 hover:text-yellow-400">Cómo Funciona</Link>
            <Link href="#testimonios" onClick={() => setIsMenuOpen(false)} className="text-base font-medium text-zinc-300 hover:text-yellow-400">Testimonios</Link>
            <Link href="#precios" onClick={() => setIsMenuOpen(false)} className="text-base font-medium text-zinc-300 hover:text-yellow-400">Precios</Link>
            <Link href="#faq" onClick={() => setIsMenuOpen(false)} className="text-base font-medium text-zinc-300 hover:text-yellow-400">FAQ</Link>
          </nav>
          <div className="flex flex-col gap-3 pt-6 border-t border-white/10">
            <Link href="/login" className="flex items-center justify-center w-full py-3 text-sm font-medium text-white bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors">Entrar a mi cuenta</Link>
            <Link href="/register" className="flex items-center justify-center w-full py-3 text-sm font-bold bg-yellow-500 text-black rounded-xl shadow-[0_0_15px_rgba(234,179,8,0.2)]">Empezar 30 días gratis</Link>
          </div>
        </div>
      )}
    </header>
  );
}