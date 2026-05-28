"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import type { NavItem } from "@/types";
import {
  TOP_HEADER_OFFSET_PX,
  useSiteHeaderScroll,
} from "@/contexts/site-header-scroll";

const NAV_ITEMS: NavItem[] = [
  { label: "Nosotros", href: "#nosotros" },
  { label: "Oferta Educativa", href: "#servicios" },
  { label: "Contacto", href: "#contacto" },
];

export function Navbar() {
  const { showTopHeaderChrome } = useSiteHeaderScroll();
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navTopPx = showTopHeaderChrome ? TOP_HEADER_OFFSET_PX : 0;

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      role="banner"
      style={{ top: navTopPx }}
      className={`fixed left-0 right-0 z-50 transition-[top,background-color,box-shadow,border-color,backdrop-filter] duration-300 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] ${
        isScrolled
          ? "bg-school-violet/90 backdrop-blur-md border-b border-white/10 shadow-lg shadow-black/20"
          : "bg-school-violet"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header grows to fit logo at each breakpoint */}
        <div className="flex items-center justify-between h-[72px] sm:h-20 md:h-24">
          <Link
            href="/"
            aria-label="Instituto Las Violetas — Página de inicio"
            className="flex items-center gap-3 group"
          >
            {/* Responsive wrapper: 56 px on mobile → 75 px sm → 85 px md+ */}
            <div className="relative h-14 w-14 sm:h-[75px] sm:w-[75px] md:h-[85px] md:w-[85px] shrink-0">
              <Image
                src="/logo-institucional.png"
                alt="Escudo oficial del Instituto Las Violetas"
                fill
                className="object-contain drop-shadow-[0_1px_4px_rgba(255,255,255,0.18)] group-hover:scale-105 transition-transform duration-200"
                priority
              />
            </div>
            <span className="font-heading font-semibold text-lg tracking-wide text-white hidden sm:block">
              Las Violetas
            </span>
          </Link>

          <nav aria-label="Main" className="hidden md:flex items-center gap-8">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-white/80 hover:text-school-gold transition-colors duration-200 relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-px after:bg-school-gold after:transition-all after:duration-200 hover:after:w-full"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="#admision"
              className="inline-flex items-center justify-center px-5 py-2 rounded-lg bg-school-gold text-school-violet text-sm font-semibold hover:bg-school-gold-light transition-colors duration-200 hover:-translate-y-px hover:shadow-md hover:shadow-school-gold/30 min-h-[44px]"
            >
              Matrícula 2026
            </Link>
          </nav>

          <button
            type="button"
            aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen((prev) => !prev)}
            className="md:hidden p-2 rounded-lg text-white hover:bg-white/10 transition-colors duration-200"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Menú de navegación"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-school-violet/95 backdrop-blur-md border-b border-white/10"
          >
            <nav className="max-w-7xl mx-auto px-6 py-6 flex flex-col gap-4">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className="text-base font-medium text-white/80 hover:text-school-gold transition-colors py-1"
                >
                  {item.label}
                </Link>
              ))}
              <Link
                href="#admision"
                onClick={() => setMenuOpen(false)}
                className="inline-flex items-center justify-center px-5 py-3 rounded-lg bg-school-gold text-school-violet text-sm font-semibold hover:bg-school-gold-light transition-colors mt-2 min-h-[44px]"
              >
                Matrícula 2026
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
