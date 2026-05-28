import type { NavItem } from "@/types";

/** Enlaces del sitio público (Navbar y Footer). */
export const PUBLIC_NAV_ITEMS: NavItem[] = [
  { label: "Nosotros", href: "/#nosotros" },
  { label: "Oferta Educativa", href: "/#servicios" },
  { label: "Actualidades", href: "/noticias" },
  { label: "Galería Multimedia", href: "/galeria" },
  { label: "Documentos Oficiales", href: "/documentos" },
  { label: "Contacto", href: "/#contacto" },
];

export const FOOTER_NAV_ITEMS: NavItem[] = [
  { label: "Nosotros", href: "/#nosotros" },
  { label: "Oferta Educativa", href: "/#servicios" },
  { label: "Actualidades", href: "/noticias" },
  { label: "Galería Multimedia", href: "/galeria" },
  { label: "Documentos Oficiales", href: "/documentos" },
  { label: "Matrícula 2026", href: "/#admision" },
  { label: "Contacto", href: "/#contacto" },
];
