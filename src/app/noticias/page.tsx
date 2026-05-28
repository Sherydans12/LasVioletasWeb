import Image from "next/image";
import Link from "next/link";
import { PublicPageShell } from "@/components/shared/PublicPageShell";
import { BackToHomeLink } from "@/components/shared/BackToHomeLink";
import { PublicEmptyState } from "@/components/shared/PublicEmptyState";
import { NAV_ICONS } from "@/lib/nav-icons";
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
    <PublicPageShell>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <header>
          <BackToHomeLink />
          <h1 className="text-(length:--text-4xl) font-heading font-bold text-foreground text-balance">
            Noticias y actividades
          </h1>
          <p className="text-muted-foreground mt-3 max-w-2xl text-pretty">
            Mantente al día con lo que ocurre en nuestra comunidad educativa.
          </p>
        </header>

        {noticias.length === 0 ? (
          <PublicEmptyState
            icon={NAV_ICONS.noticias}
            message="Próximamente se publicarán las actividades oficiales."
          />
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
            {noticias.map((n) => (
              <article
                key={n.id}
                className="rounded-2xl border border-school-violet/10 bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
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
                  <h2 className="font-heading font-semibold text-xl mt-2 mb-2 text-balance">
                    <Link
                      href={`/noticias/${n.id}`}
                      className="hover:text-school-violet transition-colors"
                    >
                      {n.titulo}
                    </Link>
                  </h2>
                  <p className="text-sm text-muted-foreground text-pretty">
                    {excerpt(n.contenido)}
                  </p>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </PublicPageShell>
  );
}
