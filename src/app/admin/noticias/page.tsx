import { AdminShell } from "@/components/admin/AdminShell";
import { NoticiaForm } from "@/components/admin/NoticiaForm";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminNoticiasPage() {
  let noticias: Awaited<ReturnType<typeof prisma.noticia.findMany>> = [];
  try {
    noticias = await prisma.noticia.findMany({
      orderBy: { fecha: "desc" },
      take: 20,
    });
  } catch {
    noticias = [];
  }

  return (
    <AdminShell title="Noticias y actividades">
      <div className="grid lg:grid-cols-[1fr_320px] gap-10 items-start">
        <NoticiaForm />
        <aside className="bg-background rounded-2xl border border-school-violet/10 shadow-sm p-6">
          <h2 className="font-heading font-semibold mb-4">Publicadas recientemente</h2>
          {noticias.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Aún no hay noticias. Conecta PostgreSQL y ejecuta{" "}
              <code className="text-xs">npx prisma db push</code>.
            </p>
          ) : (
            <ul className="space-y-4 text-sm">
              {noticias.map((n) => (
                <li key={n.id} className="border-b border-border/40 pb-3 last:border-0">
                  <p className="font-medium text-foreground line-clamp-2">{n.titulo}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(n.fecha).toLocaleDateString("es-CL")}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </aside>
      </div>
    </AdminShell>
  );
}
