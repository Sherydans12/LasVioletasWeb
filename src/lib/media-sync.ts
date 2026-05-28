import type { MediaTipo, Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { inferMediaTipo } from "@/lib/uploads";

function tipoFromUrl(url: string): MediaTipo {
  return inferMediaTipo(url) === "video" ? "video" : "image";
}

/** Duplica URLs de una noticia en la galería global con origen `noticia`. */
export async function syncMediaFromNoticia(
  noticiaId: string,
  urls: string[],
  tx?: Prisma.TransactionClient
) {
  const client = tx ?? prisma;
  const unique = [...new Set(urls.filter(Boolean))];

  await client.media.deleteMany({
    where: { asociadoAId: noticiaId, origen: "noticia" },
  });

  if (unique.length === 0) return;

  await client.media.createMany({
    data: unique.map((url) => ({
      url,
      tipo: tipoFromUrl(url),
      origen: "noticia" as const,
      asociadoAId: noticiaId,
    })),
  });
}
