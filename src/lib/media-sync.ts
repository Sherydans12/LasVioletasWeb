import type { MediaOrigen, MediaTipo, Prisma } from "@prisma/client";
import { inferMediaTipo } from "@/lib/file-utils";

export type MediaSyncItem = {
  url: string;
  tamanoBytes: number;
};

function tipoFromUrl(url: string): MediaTipo {
  return inferMediaTipo(url) === "video" ? "video" : "image";
}

/** Payload Prisma para registrar un archivo subido en la biblioteca global. */
export function buildMediaRecord(
  item: MediaSyncItem,
  opts: { origen: MediaOrigen; asociadoAId?: string; destacado?: boolean }
) {
  return {
    url: item.url,
    tamanoBytes: item.tamanoBytes,
    tipo: tipoFromUrl(item.url),
    origen: opts.origen,
    asociadoAId: opts.asociadoAId ?? null,
    destacado: opts.destacado ?? false,
  };
}

/**
 * Sincronización atómica Noticias ↔ Galería: reemplaza los registros `Media`
 * vinculados a la noticia dentro de la misma transacción Prisma.
 */
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
    data: [...unique.values()].map((item) =>
      buildMediaRecord(item, { origen: "noticia", asociadoAId: noticiaId })
    ),
  });
}
