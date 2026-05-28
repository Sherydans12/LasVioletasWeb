"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Phone } from "lucide-react";
import { NAV_ICONS } from "@/lib/nav-icons";
import { CONTACT } from "@/lib/contact";
import { useSiteHeaderScroll } from "@/contexts/site-header-scroll";

const HEADER_MOTION = {
  duration: 0.35,
  ease: [0.25, 0.46, 0.45, 0.94] as const,
};

/** Instagram SVG icon (inline — avoids adding a dependency) */
function InstagramIcon({ size = 14 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  );
}

/** Facebook SVG icon */
function FacebookIcon({ size = 14 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

const ADDRESS_LINE = "Las Violetas 1159, Coquimbo";

/**
 * Fixed bar above the Navbar (md+). Hidden when scrolled away from y=0
 * (`useSiteHeaderScroll`). z-60 above Navbar (z-50); Navbar offset matches
 * `TOP_HEADER_OFFSET_PX` when this chrome is visible.
 */
export function TopHeader() {
  const { showTopHeaderChrome, isMdUp } = useSiteHeaderScroll();
  const visuallyOpen = isMdUp && showTopHeaderChrome;

  return (
    <div
      className="pointer-events-none hidden md:block fixed top-0 inset-x-0 z-60 h-9 overflow-hidden"
      aria-hidden={!visuallyOpen}
    >
      <motion.div
        role="complementary"
        aria-label="Información de contacto rápido"
        className={`h-9 bg-[#3A002B] text-white/70 text-xs border-b border-white/5 ${
          visuallyOpen ? "pointer-events-auto" : "pointer-events-none"
        }`}
        initial={false}
        animate={{
          y: visuallyOpen ? "0%" : "-100%",
          opacity: visuallyOpen ? 1 : 0,
        }}
        transition={HEADER_MOTION}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8 h-9 flex items-center justify-between gap-4">

          {/* Left: phones */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 min-w-0">
            <a
              href={CONTACT.phones.landline.href}
              className="flex items-center gap-1.5 text-white/70 hover:text-school-gold transition-colors duration-200 shrink-0"
              aria-label={`Teléfono fijo: ${CONTACT.phones.landline.display}`}
            >
              <Phone
                size={14}
                className="text-school-gold opacity-80 shrink-0"
                aria-hidden="true"
              />
              <span>{CONTACT.phones.landline.display}</span>
            </a>
            <span className="text-white/20 shrink-0" aria-hidden="true">
              |
            </span>
            <a
              href={CONTACT.phones.primary.href}
              className="hover:text-school-gold transition-colors duration-200 shrink-0"
              aria-label={`Celular: ${CONTACT.phones.primary.display}`}
            >
              {CONTACT.phones.primary.display}
            </a>
          </div>

          {/* Right: address + social */}
          <div className="flex items-center gap-4 shrink-0">
            <a
              href={CONTACT.address.mapsLink}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-1.5 text-white/70 hover:text-school-gold text-xs min-w-0 transition-colors duration-200 max-w-[min(100%,14rem)] sm:max-w-none"
              aria-label={`Abrir ubicación en Google Maps: ${ADDRESS_LINE}`}
            >
              <NAV_ICONS.ubicacion
                size={14}
                className="text-school-gold opacity-80 shrink-0"
                aria-hidden="true"
              />
              <span className="truncate underline-offset-2 group-hover:underline">
                {ADDRESS_LINE}
              </span>
            </a>
            <div className="flex items-center gap-3">
              <Link
                href={CONTACT.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram del Instituto Las Violetas"
                className="text-school-gold opacity-80 hover:opacity-100 transition-opacity duration-200"
              >
                <InstagramIcon size={14} />
              </Link>
              <Link
                href={CONTACT.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook del Instituto Las Violetas"
                className="text-school-gold opacity-80 hover:opacity-100 transition-opacity duration-200"
              >
                <FacebookIcon size={14} />
              </Link>
            </div>
          </div>

        </div>
      </motion.div>
    </div>
  );
}
