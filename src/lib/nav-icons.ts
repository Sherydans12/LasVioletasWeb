import {
  FolderOpen,
  Images,
  LayoutDashboard,
  MapPin,
  Newspaper,
  User,
  type LucideIcon,
} from "lucide-react";

/** Iconografía institucional unificada (Navbar, TopHeader, admin). */
export const NAV_ICONS = {
  home: LayoutDashboard,
  noticias: Newspaper,
  galeria: Images,
  documentos: FolderOpen,
  perfil: User,
  ubicacion: MapPin,
} as const satisfies Record<string, LucideIcon>;

export type NavIconKey = keyof typeof NAV_ICONS;

const HREF_ICON: Record<string, NavIconKey> = {
  "/": "home",
  "/admin": "home",
  "/noticias": "noticias",
  "/galeria": "galeria",
  "/documentos": "documentos",
  "/admin/noticias": "noticias",
  "/admin/galeria": "galeria",
  "/admin/documentos": "documentos",
  "/admin/perfil": "perfil",
};

export function getNavIconForHref(href: string): LucideIcon | null {
  const key = HREF_ICON[href.split("#")[0] ?? href];
  return key ? NAV_ICONS[key] : null;
}

export function getNavIconKeyForHref(href: string): NavIconKey | null {
  return HREF_ICON[href.split("#")[0] ?? href] ?? null;
}
