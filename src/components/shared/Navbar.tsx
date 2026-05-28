"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { PUBLIC_NAV_ITEMS } from "@/lib/nav-config";
import { getNavIconForHref } from "@/lib/nav-icons";
import { usePublicChromeVisible } from "@/contexts/public-chrome-suppress";
import {
  TOP_HEADER_OFFSET_PX,
  useSiteHeaderScroll,
} from "@/contexts/site-header-scroll";

export function Navbar() {
  const showPublicChrome = usePublicChromeVisible();
  const { showTopHeaderChrome } = useSiteHeaderScroll();
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navTopPx = showTopHeaderChrome ? TOP_HEADER_OFFSET_PX : 0;

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!showPublicChrome) return null;

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
      <div className="max-w-7xl mx-auto px-4 sm:px-5 md:px-6 lg:px-8">
        <div className="grid grid-cols-[auto_1fr_auto] items-center h-[72px] md:h-20 lg:h-24 gap-x-3 md:gap-x-4 xl:gap-x-6">
          <Link
            href="/"
            aria-label="Instituto Las Violetas — Página de inicio"
            className="flex items-center gap-2 md:gap-2.5 shrink-0 max-w-[min(100%,13.5rem)] sm:max-w-[min(100%,15rem)] xl:max-w-none group col-start-1"
          >
            <div className="relative h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16 xl:h-14 xl:w-14 2xl:h-[85px] 2xl:w-[85px] shrink-0">
              <Image
                src="/logo-institucional.png"
                alt="Escudo oficial del Instituto Las Violetas"
                fill
                className="object-contain drop-shadow-[0_1px_4px_rgba(255,255,255,0.18)] group-hover:scale-105 transition-transform duration-200"
                priority
              />
            </div>
            {/* Título solo cuando el menú es hamburguesa; en xl+ el logo evita choque con la nav */}
            <span className="font-heading font-semibold text-base md:text-lg tracking-wide text-white hidden sm:block xl:hidden whitespace-nowrap">
              Las Violetas
            </span>
          </Link>

          <div className="col-start-2 min-w-2 xl:min-w-4" aria-hidden />

          <nav
            aria-label="Principal"
            className="hidden xl:flex items-center justify-end gap-2 2xl:gap-4 min-w-0 col-start-3 shrink-0"
          >
            {PUBLIC_NAV_ITEMS.map((item) => {
              const Icon = getNavIconForHref(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-white/80 hover:text-school-gold transition-colors duration-200 relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-px after:bg-school-gold after:transition-all after:duration-200 hover:after:w-full whitespace-nowrap shrink-0"
                >
                  {Icon && (
                    <Icon
                      size={16}
                      className="shrink-0 opacity-80"
                      aria-hidden
                    />
                  )}
                  {item.label}
                </Link>
              );
            })}
            <Link
              href="/#admision"
              className="inline-flex items-center justify-center px-4 2xl:px-5 py-2 rounded-lg bg-school-gold text-school-violet text-sm font-semibold hover:bg-school-gold-light transition-colors duration-200 hover:-translate-y-px hover:shadow-md hover:shadow-school-gold/30 min-h-[44px] shrink-0 whitespace-nowrap"
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
            className="xl:hidden p-2 rounded-lg text-white hover:bg-white/10 transition-colors duration-200 shrink-0 col-start-3 justify-self-end"
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
            className="xl:hidden bg-school-violet/95 backdrop-blur-md border-b border-white/10"
          >
            <nav className="max-w-7xl mx-auto px-6 py-6 flex flex-col gap-4">
              {PUBLIC_NAV_ITEMS.map((item) => {
                const Icon = getNavIconForHref(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className="inline-flex items-center gap-2.5 text-base font-medium text-white/80 hover:text-school-gold transition-colors py-1"
                  >
                    {Icon && (
                      <Icon size={18} className="shrink-0 opacity-80" aria-hidden />
                    )}
                    {item.label}
                  </Link>
                );
              })}
              <Link
                href="/#admision"
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
