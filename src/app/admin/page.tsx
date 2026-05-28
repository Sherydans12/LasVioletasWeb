import Link from "next/link";
import { AdminShell } from "@/components/admin/AdminShell";

const MODULES = [
  {
    href: "/admin/noticias",
    title: "Noticias y actividades",
    description: "Publica novedades que aparecen en inicio y en /noticias.",
  },
  {
    href: "/admin/galeria",
    title: "Galería multimedia",
    description: "Sube fotos y videos destacados para el carrusel de inicio.",
  },
  {
    href: "/admin/documentos",
    title: "Documentos oficiales",
    description: "Organiza PDFs y archivos por carpetas en /documentos.",
  },
];

export default function AdminDashboardPage() {
  return (
    <AdminShell title="Panel principal">
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {MODULES.map((mod) => (
          <Link
            key={mod.href}
            href={mod.href}
            className="block rounded-2xl border border-border/60 bg-background p-6 hover:border-school-gold/50 hover:shadow-md transition-all"
          >
            <h2 className="font-heading font-semibold text-lg text-foreground mb-2">
              {mod.title}
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {mod.description}
            </p>
          </Link>
        ))}
      </div>
    </AdminShell>
  );
}
