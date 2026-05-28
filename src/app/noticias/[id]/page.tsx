import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { WhatsAppBubble } from "@/components/shared/WhatsAppBubble";
import { getNoticiaById } from "@/lib/content";

export const dynamic = "force-dynamic";

type PageProps = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  const noticia = await getNoticiaById(id);
  if (!noticia) return { title: "Noticia no encontrada" };
  return {
    title: noticia.titulo,
    description: noticia.contenido.slice(0, 160),
  };
}

export default async function NoticiaDetailPage({ params }: PageProps) {
  const { id } = await params;
  const noticia = await getNoticiaById(id);
  if (!noticia) notFound();

  return (
    <>
      <Navbar />
      <main id="main-content" className="pt-28 lg:pt-32 pb-20 bg-background min-h-screen">
        <article className="max-w-3xl mx-auto px-6 lg:px-8">
          <Link
            href="/noticias"
            className="text-sm text-school-violet hover:text-school-gold mb-6 inline-block"
          >
            ← Todas las actividades
          </Link>
          <time
            dateTime={noticia.fecha.toISOString()}
            className="text-sm text-muted-foreground block mb-3"
          >
            {noticia.fecha.toLocaleDateString("es-CL", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </time>
          <h1 className="text-(length:--text-4xl) font-heading font-bold text-foreground mb-8 text-balance">
            {noticia.titulo}
          </h1>
          {noticia.portadaUrl && (
            <div className="relative aspect-video rounded-2xl overflow-hidden mb-8">
              <Image
                src={noticia.portadaUrl}
                alt=""
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, 768px"
              />
            </div>
          )}
          <div className="prose prose-neutral max-w-none">
            {noticia.contenido.split("\n").map((paragraph, i) => (
              <p key={i} className="text-muted-foreground leading-relaxed mb-4">
                {paragraph}
              </p>
            ))}
          </div>
        </article>
      </main>
      <Footer />
      <WhatsAppBubble />
    </>
  );
}
