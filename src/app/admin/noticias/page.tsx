import Link from "next/link";
import { AdminShell } from "@/components/admin/AdminShell";
import { NoticiaForm } from "@/components/admin/NoticiaForm";
import { PaginationNav } from "@/components/shared/PaginationNav";
import { parsePaginationParams, buildPaginationMeta } from "@/lib/pagination";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: Promise<{ page?: string; limit?: string }>;
};

export default async function AdminNoticiasPage({ searchParams }: PageProps) {
  const pagination = parsePaginationParams(await searchParams);

  let noticias: Awaited<ReturnType<typeof prisma.noticia.findMany>> = [];
  let meta = buildPaginationMeta(0, pagination.page, pagination.limit);

  try {
    const [total, items] = await Promise.all([
      prisma.noticia.count(),
      prisma.noticia.findMany({
        orderBy: { fecha: "desc" },
        skip: pagination.skip,
        take: pagination.limit,
      }),
    ]);
    noticias = items;
    meta = buildPaginationMeta(total, pagination.page, pagination.limit);
  } catch {
    noticias = [];
  }

  return (
    <AdminShell title="Noticias y actividades">
      <div className="grid lg:grid-cols-[1fr_320px] gap-10 items-start">
        <NoticiaForm />
        <aside className="bg-background rounded-2xl border border-school-violet/10 shadow-sm p-6 space-y-4">
          <h2 className="font-heading font-semibold">Publicadas</h2>
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
                  <Link
                    href={`/admin/noticias/${n.id}/edit`}
                    className="text-xs text-school-violet hover:text-school-gold mt-2 inline-block font-medium"
                  >
                    Editar →
                  </Link>
                </li>
              ))}
            </ul>
          )}
          <PaginationNav basePath="/admin/noticias" meta={meta} className="mt-4" />
        </aside>
      </div>
    </AdminShell>
  );
}
