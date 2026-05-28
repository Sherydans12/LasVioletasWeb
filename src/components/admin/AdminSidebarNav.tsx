"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Newspaper,
  Images,
  FileText,
  UserCircle,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/admin", label: "Panel", icon: LayoutDashboard, exact: true },
  { href: "/admin/noticias", label: "Noticias", icon: Newspaper },
  { href: "/admin/galeria", label: "Galería", icon: Images },
  { href: "/admin/documentos", label: "Documentos", icon: FileText },
  { href: "/admin/perfil", label: "Mi perfil", icon: UserCircle },
] as const;

function isActive(pathname: string, href: string, exact?: boolean) {
  if (exact) return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AdminSidebarNav({
  orientation = "vertical",
}: {
  orientation?: "vertical" | "horizontal";
}) {
  const pathname = usePathname();
  const isHorizontal = orientation === "horizontal";

  return (
    <nav
      aria-label="Administración"
      className={cn(
        "gap-1",
        isHorizontal ? "flex flex-nowrap min-w-max" : "flex flex-col"
      )}
    >
      {LINKS.map((link) => {
        const { href, label, icon: Icon } = link;
        const exact = "exact" in link ? link.exact : false;
        const active = isActive(pathname, href, exact);
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex items-center gap-2 rounded-lg text-sm font-medium transition-colors duration-200 whitespace-nowrap",
              isHorizontal ? "px-3 py-2" : "gap-3 px-3 py-2.5",
              active
                ? "bg-school-violet text-white shadow-sm"
                : "text-foreground/80 hover:bg-school-neutral hover:text-school-violet"
            )}
          >
            <Icon
              size={18}
              className={cn(
                "shrink-0",
                active ? "text-school-gold" : "text-school-violet/70"
              )}
              aria-hidden
            />
            <span className={active ? "text-white" : undefined}>{label}</span>
          </Link>
        );
      })}
      {!isHorizontal && <div className="my-3 border-t border-border/60" />}
      <Link
        href="/"
        className={cn(
          "flex items-center gap-2 rounded-lg text-sm text-muted-foreground hover:text-school-violet hover:bg-school-neutral transition-colors duration-200 whitespace-nowrap",
          isHorizontal ? "px-3 py-2" : "gap-3 px-3 py-2.5"
        )}
      >
        <ExternalLink size={18} className="shrink-0" aria-hidden />
        Ver sitio público
      </Link>
    </nav>
  );
}
