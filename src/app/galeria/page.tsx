import Link from "next/link";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { WhatsAppBubble } from "@/components/shared/WhatsAppBubble";
import { GaleriaGrid } from "@/components/galeria/GaleriaGrid";
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
    <>
      <Navbar />
      <main id="main-content" className="pt-28 lg:pt-32 pb-20 bg-school-neutral min-h-screen">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <header className="mb-10">
            <Link
              href="/"
              className="text-sm text-school-violet hover:text-school-gold mb-4 inline-block"
            >
              ← Inicio
            </Link>
            <h1 className="text-(length:--text-4xl) font-heading font-bold text-foreground">
              Galería
            </h1>
            <p className="text-muted-foreground mt-3 max-w-2xl">
              Recuerdos visuales de nuestra comunidad educativa en Coquimbo.
            </p>
          </header>
          <GaleriaGrid items={items} />
        </div>
      </main>
      <Footer />
      <WhatsAppBubble />
    </>
  );
}
