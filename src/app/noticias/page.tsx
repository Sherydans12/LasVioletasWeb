import Link from "next/link";
import Image from "next/image";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { WhatsAppBubble } from "@/components/shared/WhatsAppBubble";
import { getAllNoticias } from "@/lib/content";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Noticias y actividades",
  description:
    "Novedades, actividades y comunicados del Instituto Las Violetas en Coquimbo.",
};

function excerpt(text: string, max = 160) {
  const plain = text.replace(/\s+/g, " ").trim();
  return plain.length > max ? `${plain.slice(0, max)}…` : plain;
}

export default async function NoticiasPage() {
  const noticias = await getAllNoticias();

  return (
    <>
      <Navbar />
      <main id="main-content" className="pt-28 lg:pt-32 pb-20 bg-school-neutral min-h-screen">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <header className="mb-12">
            <Link
              href="/"
              className="text-sm text-school-violet hover:text-school-gold mb-4 inline-block"
            >
              ← Inicio
            </Link>
            <h1 className="text-(length:--text-4xl) font-heading font-bold text-foreground">
              Noticias y actividades
            </h1>
            <p className="text-muted-foreground mt-3 max-w-2xl">
              Mantente al día con lo que ocurre en nuestra comunidad educativa.
            </p>
          </header>

          {noticias.length === 0 ? (
            <p className="text-muted-foreground">Pronto publicaremos novedades.</p>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {noticias.map((n) => (
                <article
                  key={n.id}
                  className="rounded-2xl border border-border/60 bg-background overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="relative aspect-16/10 bg-school-violet/10">
                    {n.portadaUrl && (
                      <Image
                        src={n.portadaUrl}
                        alt=""
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    )}
                  </div>
                  <div className="p-6">
                    <time
                      dateTime={n.fecha.toISOString()}
                      className="text-xs text-muted-foreground"
                    >
                      {n.fecha.toLocaleDateString("es-CL")}
                    </time>
                    <h2 className="font-heading font-semibold text-xl mt-2 mb-2">
                      <Link
                        href={`/noticias/${n.id}`}
                        className="hover:text-school-violet"
                      >
                        {n.titulo}
                      </Link>
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      {excerpt(n.contenido)}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
      <WhatsAppBubble />
    </>
  );
}
