import Image from "next/image";
import Link from "next/link";
import { CONTACT } from "@/lib/contact";
import { FOOTER_NAV_ITEMS } from "@/lib/nav-config";

function InstagramIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

const CURRENT_YEAR = new Date().getFullYear();

export function Footer() {
  return (
    <footer role="contentinfo" className="bg-school-violet text-white mt-auto">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

          {/* Brand + tagline */}
          <div>
            <Link href="/" className="flex items-center gap-3 mb-4 group">
              <Image
                src="/logo-institucional.png"
                alt="Escudo oficial del Instituto Las Violetas"
                width={75}
                height={75}
                className="object-contain drop-shadow-[0_1px_4px_rgba(255,255,255,0.15)] group-hover:scale-105 transition-transform duration-200"
              />
              <span className="font-heading font-semibold text-lg tracking-wide text-white whitespace-nowrap">
                Las Violetas
              </span>
            </Link>
            <p className="text-sm text-white/60 leading-relaxed max-w-xs mb-4">
              Establecimiento educacional comprometido con la formación integral
              de adultos en Coquimbo. Matrícula 2026 disponible.
            </p>

            {/* Social links */}
            <div className="flex items-center gap-3">
              <Link
                href={CONTACT.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram del Instituto Las Violetas"
                className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-white/60 hover:text-school-gold hover:bg-white/20 transition-all duration-200"
              >
                <InstagramIcon />
              </Link>
              <Link
                href={CONTACT.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook del Instituto Las Violetas"
                className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-white/60 hover:text-school-gold hover:bg-white/20 transition-all duration-200"
              >
                <FacebookIcon />
              </Link>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <p className="text-sm font-semibold mb-4 text-school-gold uppercase tracking-wider">
              Navegación
            </p>
            <nav aria-label="Navegación del pie de página">
              <ul className="space-y-2">
                {FOOTER_NAV_ITEMS.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/60 hover:text-school-gold transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Contact details */}
          <div>
            <p className="text-sm font-semibold mb-4 text-school-gold uppercase tracking-wider">
              Contacto
            </p>
            <address className="not-italic space-y-2 text-sm text-white/60">
              <a
                href={CONTACT.address.mapsLink}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-school-gold transition-colors duration-200 block"
                aria-label={`Abrir ubicación en Google Maps: ${CONTACT.address.full}`}
              >
                {CONTACT.address.full}
              </a>
              <a
                href={`mailto:${CONTACT.email}`}
                className="hover:text-school-gold transition-colors duration-200 block"
              >
                {CONTACT.email}
              </a>
              <a
                href={CONTACT.phones.landline.href}
                className="hover:text-school-gold transition-colors duration-200 block"
              >
                {CONTACT.phones.landline.display}
              </a>
              <a
                href={CONTACT.phones.primary.href}
                className="hover:text-school-gold transition-colors duration-200 block"
              >
                {CONTACT.phones.primary.display} (WhatsApp)
              </a>
            </address>
          </div>

        </div>

        <div className="mt-12 pt-8 border-t border-white/10 text-xs text-white/40">
          <p>© {CURRENT_YEAR} Instituto Las Violetas. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
