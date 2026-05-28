import Image from "next/image";
import Link from "next/link";
import { getLatestNoticias } from "@/lib/content";
import { PLACEHOLDER_ACTIVITIES } from "@/lib/home-fallbacks";
import { LatestActivitiesCta } from "@/components/sections/LatestActivitiesCta";

function excerpt(text: string, max = 120) {
  const plain = text.replace(/\s+/g, " ").trim();
  return plain.length > max ? `${plain.slice(0, max)}…` : plain;
}

type ActivityCard = {
  id: string;
  titulo: string;
  contenido: string;
  fecha: Date;
  portadaUrl: string | null;
};

export async function LatestActivities() {
  const fromDb = await getLatestNoticias(3);
  const isPreview = fromDb.length === 0;
  const noticias: ActivityCard[] = isPreview
    ? PLACEHOLDER_ACTIVITIES.map((p) => ({ ...p }))
    : fromDb;

  return (
    <section
      id="actividades"
      aria-labelledby="activities-heading"
      className="py-20 lg:py-28 bg-background"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-12">
          <div>
            <span className="inline-block text-xs font-semibold uppercase tracking-[0.15em] text-school-violet mb-4">
              Comunidad
            </span>
            <h2
              id="activities-heading"
              className="text-(length:--text-4xl) font-heading font-bold tracking-[-0.02em] text-foreground text-balance"
            >
              Últimas actividades
            </h2>
            {isPreview && (
              <p className="mt-3 text-sm text-muted-foreground max-w-xl leading-relaxed">
                Próximamente publicaremos los registros de nuestras actividades
                y novedades institucionales. Mientras tanto, te invitamos a
                conocer nuestra propuesta formativa.
              </p>
            )}
          </div>
          <LatestActivitiesCta />
        </div>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {noticias.map((noticia) => (
            <article
              key={noticia.id}
              className="group relative flex flex-col rounded-2xl border border-border/60 bg-school-neutral/50 overflow-hidden hover:border-school-gold/40 hover:shadow-lg transition-all duration-300"
            >
              {isPreview && (
                <span className="absolute z-10 top-4 left-4 text-[10px] uppercase font-semibold tracking-wider bg-school-gold/90 text-school-violet px-2.5 py-1 rounded-full">
                  Próximamente
                </span>
              )}
              <div className="relative aspect-16/10 bg-school-violet/10 shrink-0">
                {noticia.portadaUrl ? (
                  <Image
                    src={noticia.portadaUrl}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-school-violet/40 font-heading text-4xl">
                    LV
                  </div>
                )}
              </div>
              <div className="flex flex-col flex-1 p-6">
                {!isPreview && (
                  <time
                    dateTime={noticia.fecha.toISOString()}
                    className="text-xs text-muted-foreground mb-2"
                  >
                    {noticia.fecha.toLocaleDateString("es-CL", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </time>
                )}
                <h3 className="font-heading font-semibold text-lg text-foreground mb-2 line-clamp-2 group-hover:text-school-violet transition-colors">
                  {isPreview ? (
                    noticia.titulo
                  ) : (
                    <Link href={`/noticias/${noticia.id}`}>{noticia.titulo}</Link>
                  )}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed flex-1">
                  {excerpt(noticia.contenido)}
                </p>
                {!isPreview && (
                  <Link
                    href={`/noticias/${noticia.id}`}
                    className="mt-4 text-sm font-medium text-school-violet hover:text-school-gold transition-colors"
                  >
                    Leer más →
                  </Link>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
