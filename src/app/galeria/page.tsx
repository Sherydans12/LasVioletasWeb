import { PublicPageShell } from "@/components/shared/PublicPageShell";
import { BackToHomeLink } from "@/components/shared/BackToHomeLink";
import { PublicEmptyState } from "@/components/shared/PublicEmptyState";
import { GaleriaGrid } from "@/components/galeria/GaleriaGrid";
import { NAV_ICONS } from "@/lib/nav-icons";
import { getGalleryMedia } from "@/lib/content";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Galería multimedia",
  description:
    "Fotos y videos de actividades, comunidad e infraestructura del Instituto Las Violetas.",
};

export default async function GaleriaPage() {
  const items = await getGalleryMedia();

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

        {items.length === 0 ? (
          <PublicEmptyState
            icon={NAV_ICONS.galeria}
            message="Próximamente se publicarán registros multimedia de nuestras actividades institucionales."
          />
        ) : (
          <div className="mt-10">
            <GaleriaGrid items={items} />
          </div>
        )}
      </div>
    </PublicPageShell>
  );
}
