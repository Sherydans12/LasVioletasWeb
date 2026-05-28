import type { MediaTipo, Prisma } from "@prisma/client";
import { inferMediaTipo } from "@/lib/uploads";

export type MediaSyncItem = {
  url: string;
  tamanoBytes: number;
};

function tipoFromUrl(url: string): MediaTipo {
  return inferMediaTipo(url) === "video" ? "video" : "image";
}

/** Duplica archivos de una noticia en la galería global con origen `noticia`. */
export async function syncMediaFromNoticia(
  noticiaId: string,
  items: MediaSyncItem[],
  tx: Prisma.TransactionClient
) {
  const unique = new Map<string, MediaSyncItem>();
  for (const item of items) {
    if (item.url) unique.set(item.url, item);
  }

  await tx.media.deleteMany({
    where: { asociadoAId: noticiaId, origen: "noticia" },
  });

  if (unique.size === 0) return;

  await tx.media.createMany({
    data: [...unique.values()].map((item) => ({
      url: item.url,
      tamanoBytes: item.tamanoBytes,
      tipo: tipoFromUrl(item.url),
      origen: "noticia" as const,
      asociadoAId: noticiaId,
    })),
  });
}
