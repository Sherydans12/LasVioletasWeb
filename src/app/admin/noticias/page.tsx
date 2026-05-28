import { AdminShell } from "@/components/admin/AdminShell";
import { AdminNoticiasList } from "@/components/admin/AdminNoticiasList";
import { NoticiaForm } from "@/components/admin/NoticiaForm";
import { parsePaginationParams, buildPaginationMeta } from "@/lib/pagination";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: Promise<{ page?: string; limit?: string }>;
};

export default async function AdminNoticiasPage({ searchParams }: PageProps) {
  const resolved = await searchParams;
  const pagination = parsePaginationParams(resolved);

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
          <AdminNoticiasList noticias={noticias} meta={meta} />
        </aside>
      </div>
    </AdminShell>
  );
}
