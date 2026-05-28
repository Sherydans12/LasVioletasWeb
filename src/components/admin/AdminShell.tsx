import Link from "next/link";
import { signOut } from "@/auth";
import type { ReactNode } from "react";
import { StorageQuotaWidget } from "@/components/admin/StorageQuotaWidget";

const LINKS = [
  { href: "/admin", label: "Panel" },
  { href: "/admin/noticias", label: "Noticias" },
  { href: "/admin/galeria", label: "Galería" },
  { href: "/admin/documentos", label: "Documentos" },
];

export function AdminShell({
  children,
  title,
}: {
  children: ReactNode;
  title: string;
}) {
  return (
    <div className="min-h-screen bg-school-neutral">
      <header className="bg-school-violet text-white border-b border-white/10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-widest text-white/70">
              Panel de administración
            </p>
            <h1 className="font-heading text-xl font-bold">{title}</h1>
          </div>
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/" });
            }}
          >
            <button
              type="submit"
              className="text-sm px-4 py-2 rounded-lg border border-white/30 hover:bg-white/10 transition-colors"
            >
              Cerrar sesión
            </button>
          </form>
        </div>
        <nav
          aria-label="Administración"
          className="max-w-6xl mx-auto px-6 pb-4 flex flex-wrap gap-2"
        >
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm px-4 py-2 rounded-lg bg-white/10 hover:bg-school-gold hover:text-school-violet transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/"
            className="text-sm px-4 py-2 rounded-lg text-white/80 hover:text-school-gold transition-colors"
          >
            Ver sitio
          </Link>
        </nav>
      </header>
      <main className="max-w-6xl mx-auto px-6 py-10">
        <div className="grid lg:grid-cols-[minmax(0,280px)_1fr] gap-8 items-start">
          <aside className="lg:sticky lg:top-8 space-y-6">
            <StorageQuotaWidget />
          </aside>
          <div className="min-w-0">{children}</div>
        </div>
      </main>
    </div>
  );
}
