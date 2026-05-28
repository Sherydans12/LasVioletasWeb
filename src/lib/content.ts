import type { MediaTipo } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export async function getLatestNoticias(limit = 3) {
  try {
    return await prisma.noticia.findMany({
      take: limit,
      orderBy: { fecha: "desc" },
      select: {
        id: true,
        titulo: true,
        contenido: true,
        fecha: true,
        portadaUrl: true,
      },
    });
  } catch {
    return [];
  }
}

export async function getAllNoticias() {
  try {
    return await prisma.noticia.findMany({
      orderBy: { fecha: "desc" },
    });
  } catch {
    return [];
  }
}

export async function getNoticiaById(id: string) {
  try {
    return await prisma.noticia.findUnique({ where: { id } });
  } catch {
    return null;
  }
}

/** Destacados o subidos directamente a la galería principal. */
export async function getHomeGalleryMedia() {
  try {
    return await prisma.media.findMany({
      where: {
        OR: [{ destacado: true }, { origen: "directo" }],
      },
      orderBy: { fecha: "desc" },
      take: 12,
    });
  } catch {
    return [];
  }
}

export async function getGalleryMedia(filter?: MediaTipo) {
  try {
    return await prisma.media.findMany({
      where: filter ? { tipo: filter } : undefined,
      orderBy: { fecha: "desc" },
    });
  } catch {
    return [];
  }
}

export async function getDocumentCategories() {
  try {
    return await prisma.categoriaDocumento.findMany({
      orderBy: [{ orden: "asc" }, { nombre: "asc" }],
      include: {
        documentos: { orderBy: { fecha: "desc" } },
      },
    });
  } catch {
    return [];
  }
}
