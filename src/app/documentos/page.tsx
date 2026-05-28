import { PublicPageShell } from "@/components/shared/PublicPageShell";
import { BackToHomeLink } from "@/components/shared/BackToHomeLink";
import { PublicEmptyState } from "@/components/shared/PublicEmptyState";
import { DocumentosExplorer } from "@/components/documentos/DocumentosExplorer";
import { NAV_ICONS } from "@/lib/nav-icons";
import { getDocumentCategories } from "@/lib/content";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Documentos oficiales",
  description:
    "Reglamentos, circulares y documentación institucional del CEIA Las Violetas para descarga.",
};

export default async function DocumentosPage() {
  const categorias = await getDocumentCategories();

  return (
    <PublicPageShell>
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        <header>
          <BackToHomeLink />
          <h1 className="text-(length:--text-4xl) font-heading font-bold text-foreground text-balance">
            Documentos oficiales
          </h1>
          <p className="text-muted-foreground mt-3 text-pretty">
            Descarga reglamentos, formularios y material institucional organizado
            por secciones.
          </p>
        </header>

        {categorias.length === 0 ? (
          <PublicEmptyState
            icon={NAV_ICONS.documentos}
            message="Documentación en proceso de carga."
          />
        ) : (
          <div className="mt-10">
            <DocumentosExplorer categorias={categorias} />
          </div>
        )}
      </div>
    </PublicPageShell>
  );
}
