import { getLatestNoticias } from "@/lib/content";
import { PLACEHOLDER_ACTIVITIES } from "@/lib/home-fallbacks";
import { LatestActivitiesCta } from "@/components/sections/LatestActivitiesCta";
import {
  LatestActivitiesGrid,
  type ActivityCardData,
} from "@/components/sections/LatestActivitiesGrid";

export async function LatestActivities() {
  const fromDb = await getLatestNoticias(3);
  const isPreview = fromDb.length === 0;
  const noticias: ActivityCardData[] = isPreview
    ? PLACEHOLDER_ACTIVITIES.map((p) => ({
        id: p.id,
        titulo: p.titulo,
        contenido: p.contenido,
        fechaIso: null,
        portadaUrl: p.portadaUrl,
      }))
    : fromDb.map((n) => ({
        id: n.id,
        titulo: n.titulo,
        contenido: n.contenido,
        fechaIso: n.fecha.toISOString(),
        portadaUrl: n.portadaUrl,
      }));

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
              <p className="mt-3 text-sm text-muted-foreground max-w-xl leading-relaxed text-pretty">
                Próximamente publicaremos los registros de nuestras actividades
                y novedades institucionales. Mientras tanto, te invitamos a
                conocer nuestra propuesta formativa.
              </p>
            )}
          </div>
          <LatestActivitiesCta />
        </div>

        <LatestActivitiesGrid noticias={noticias} isPreview={isPreview} />
      </div>
    </section>
  );
}
