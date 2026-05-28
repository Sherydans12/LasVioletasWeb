import Link from "next/link";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { WhatsAppBubble } from "@/components/shared/WhatsAppBubble";
import { DocumentosExplorer } from "@/components/documentos/DocumentosExplorer";
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
    <>
      <Navbar />
      <main id="main-content" className="pt-28 lg:pt-32 pb-20 bg-school-neutral min-h-screen">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <header className="mb-10">
            <Link
              href="/"
              className="text-sm text-school-violet hover:text-school-gold mb-4 inline-block"
            >
              ← Inicio
            </Link>
            <h1 className="text-(length:--text-4xl) font-heading font-bold text-foreground">
              Documentos oficiales
            </h1>
            <p className="text-muted-foreground mt-3">
              Descarga reglamentos, formularios y material institucional organizado
              por secciones.
            </p>
          </header>
          <DocumentosExplorer categorias={categorias} />
        </div>
      </main>
      <Footer />
      <WhatsAppBubble />
    </>
  );
}
