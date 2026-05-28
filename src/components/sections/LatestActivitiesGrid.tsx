"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  scaleIn,
  staggerContainerFast,
  VIEWPORT_ONCE,
} from "@/lib/animations";

export type ActivityCardData = {
  id: string;
  titulo: string;
  contenido: string;
  fechaIso: string | null;
  portadaUrl: string | null;
};

function excerpt(text: string, max = 120) {
  const plain = text.replace(/\s+/g, " ").trim();
  return plain.length > max ? `${plain.slice(0, max)}…` : plain;
}

const cardSurface =
  "group relative flex flex-col rounded-2xl border border-school-violet/10 bg-white overflow-hidden shadow-sm hover:shadow-md hover:border-school-gold/30 transition-all duration-300";

export function LatestActivitiesGrid({
  noticias,
  isPreview,
}: {
  noticias: ActivityCardData[];
  isPreview: boolean;
}) {
  return (
    <motion.div
      variants={staggerContainerFast}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT_ONCE}
      className="grid md:grid-cols-3 gap-6 lg:gap-8"
    >
      {noticias.map((noticia) => (
        <motion.article key={noticia.id} variants={scaleIn} className={cardSurface}>
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
                className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-school-violet/40 font-heading text-4xl">
                LV
              </div>
            )}
          </div>
          <div className="flex flex-col flex-1 p-6">
            {!isPreview && noticia.fechaIso && (
              <time
                dateTime={noticia.fechaIso}
                className="text-xs text-muted-foreground mb-2"
              >
                {new Date(noticia.fechaIso).toLocaleDateString("es-CL", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </time>
            )}
            <h3 className="font-heading font-semibold text-lg text-foreground mb-2 line-clamp-2 text-balance group-hover:text-school-violet transition-colors duration-300">
              {isPreview ? (
                noticia.titulo
              ) : (
                <Link href={`/noticias/${noticia.id}`}>{noticia.titulo}</Link>
              )}
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed flex-1 text-pretty">
              {excerpt(noticia.contenido)}
            </p>
            {!isPreview && (
              <Link
                href={`/noticias/${noticia.id}`}
                className="mt-4 text-sm font-medium text-school-violet hover:text-school-gold transition-colors duration-200"
              >
                Leer más →
              </Link>
            )}
          </div>
        </motion.article>
      ))}
    </motion.div>
  );
}
