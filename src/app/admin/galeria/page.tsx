import { AdminShell } from "@/components/admin/AdminShell";
import { GaleriaForm } from "@/components/admin/GaleriaForm";
import { GaleriaMediaGrid } from "@/components/admin/GaleriaMediaGrid";
import { PaginationNav } from "@/components/shared/PaginationNav";
import { parsePaginationParams, buildPaginationMeta } from "@/lib/pagination";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: Promise<{ page?: string; limit?: string }>;
};

export default async function AdminGaleriaPage({ searchParams }: PageProps) {
  const pagination = parsePaginationParams(await searchParams);

  let media: Awaited<ReturnType<typeof prisma.media.findMany>> = [];
  let meta = buildPaginationMeta(0, pagination.page, pagination.limit);

  try {
    const [total, items] = await Promise.all([
      prisma.media.count(),
      prisma.media.findMany({
        orderBy: { fecha: "desc" },
        skip: pagination.skip,
        take: pagination.limit,
      }),
    ]);
    media = items;
    meta = buildPaginationMeta(total, pagination.page, pagination.limit);
  } catch {
    media = [];
  }

  return (
    <AdminShell title="Galería multimedia">
      <section aria-label="Subir archivos">
        <GaleriaForm />
      </section>

      <div
        className="my-10 border-t border-school-violet/10"
        role="separator"
        aria-hidden
      />

      <section aria-labelledby="galeria-medios-heading" className="space-y-6">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2
            id="galeria-medios-heading"
            className="text-xl font-semibold text-school-violet"
          >
            Galería de medios
          </h2>
          <p className="text-sm text-muted-foreground">
            {meta.total === 1 ? "1 recurso" : `${meta.total} recursos`}
          </p>
        </div>

        <GaleriaMediaGrid items={media} />
        <PaginationNav basePath="/admin/galeria" meta={meta} />
      </section>
    </AdminShell>
  );
}
