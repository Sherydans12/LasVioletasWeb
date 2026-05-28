import { PublicPageShell } from "@/components/shared/PublicPageShell";
import { BackToHomeLink } from "@/components/shared/BackToHomeLink";
import { PublicEmptyState } from "@/components/shared/PublicEmptyState";
import { PaginationNav } from "@/components/shared/PaginationNav";
import { GaleriaGrid } from "@/components/galeria/GaleriaGrid";
import { NAV_ICONS } from "@/lib/nav-icons";
import { getGalleryMediaPaginated } from "@/lib/content";
import { parsePaginationParams } from "@/lib/pagination";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Galería multimedia",
  description:
    "Fotos y videos de actividades, comunidad e infraestructura del Instituto Las Violetas.",
};

type PageProps = {
  searchParams: Promise<{ page?: string; limit?: string }>;
};

export default async function GaleriaPage({ searchParams }: PageProps) {
  const params = parsePaginationParams(await searchParams);
  const { items, meta } = await getGalleryMediaPaginated(params);

  return (
    <PublicPageShell>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <header>
          <BackToHomeLink />
          <h1 className="text-(length:--text-4xl) font-heading font-bold text-foreground text-balance">
            Galería
          </h1>
          <p className="text-muted-foreground mt-3 max-w-2xl text-pretty">
            Recuerdos visuales de nuestra comunidad educativa en Coquimbo.
          </p>
        </header>

        {meta.total === 0 ? (
          <PublicEmptyState
            icon={NAV_ICONS.galeria}
            message="Próximamente se publicarán registros multimedia de nuestras actividades institucionales."
          />
        ) : (
          <div className="mt-10">
            <GaleriaGrid items={items} />
            <PaginationNav basePath="/galeria" meta={meta} />
          </div>
        )}
      </div>
    </PublicPageShell>
  );
}
