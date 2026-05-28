import type { Noticia } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { parseUploadUrl } from "@/lib/upload-paths";
import { deleteStoredFileByUrl } from "@/lib/upload-delete";

/** Recolecta URLs de medios vinculados a una noticia (portada, galería incrustada, tabla Media). */
export function collectNoticiaAssetUrls(noticia: {
  portadaUrl: string | null;
  imagenes: string[];
  media?: { url: string }[];
}): string[] {
  const urls = new Set<string>();
  if (noticia.portadaUrl) urls.add(noticia.portadaUrl);
  for (const url of noticia.imagenes) {
    if (url) urls.add(url);
  }
  for (const m of noticia.media ?? []) {
    if (m.url) urls.add(m.url);
  }
  return [...urls];
}

/** Elimina archivos físicos en `storage/noticias/` asociados a la noticia. */
export async function deleteNoticiaFilesFromDisk(urls: string[]): Promise<void> {
  await Promise.all(
    urls.map(async (url) => {
      const parsed = parseUploadUrl(url);
      if (parsed?.category !== "noticias") return;
      await deleteStoredFileByUrl(url);
    })
  );
}

/**
 * Borrado en cascada: archivos en disco → registros Media → registro Noticia.
 * Devuelve la noticia eliminada o null si no existía.
 */
export async function deleteNoticiaWithAssets(
  noticiaId: string
): Promise<Noticia | null> {
  const noticia = await prisma.noticia.findUnique({
    where: { id: noticiaId },
    include: { media: true },
  });

  if (!noticia) return null;

  const urls = collectNoticiaAssetUrls(noticia);
  await deleteNoticiaFilesFromDisk(urls);

  await prisma.$transaction([
    prisma.media.deleteMany({ where: { asociadoAId: noticiaId } }),
    prisma.noticia.delete({ where: { id: noticiaId } }),
  ]);

  return noticia;
}
