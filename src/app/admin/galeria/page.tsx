import { Suspense } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { GaleriaFiltersToolbar } from "@/components/admin/GaleriaFiltersToolbar";
import { GaleriaForm } from "@/components/admin/GaleriaForm";
import { GaleriaMediaGrid } from "@/components/admin/GaleriaMediaGrid";
import { PaginationNav } from "@/components/shared/PaginationNav";
import { buildMediaAdminWhere } from "@/lib/galeria-filters";
import { parsePaginationParams, buildPaginationMeta } from "@/lib/pagination";
import { prisma } from "@/lib/prisma";
import { getStorageStats } from "@/lib/storage";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: Promise<{
    page?: string;
    limit?: string;
    q?: string;
    type?: string;
  }>;
};

export default async function AdminGaleriaPage({ searchParams }: PageProps) {
  const resolved = await searchParams;
  const pagination = parsePaginationParams(resolved);
  const where = buildMediaAdminWhere(resolved.q, resolved.type);
  const storage = await getStorageStats();

  const filterQuery: Record<string, string | undefined> = {
    q: resolved.q?.trim() || undefined,
    type:
      resolved.type === "image" || resolved.type === "video"
        ? resolved.type
        : undefined,
  };

  let media: Awaited<ReturnType<typeof prisma.media.findMany>> = [];
  let meta = buildPaginationMeta(0, pagination.page, pagination.limit);

  try {
    const [total, items] = await Promise.all([
      prisma.media.count({ where }),
      prisma.media.findMany({
        where,
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
        <GaleriaForm storage={storage} />
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

        <Suspense
          fallback={
            <div className="h-10 rounded-lg bg-school-neutral animate-pulse" />
          }
        >
          <GaleriaFiltersToolbar />
        </Suspense>

        <GaleriaMediaGrid items={media} />
        <PaginationNav
          basePath="/admin/galeria"
          meta={meta}
          query={filterQuery}
        />
      </section>
    </AdminShell>
  );
}
