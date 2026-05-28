import type { MediaTipo } from "@prisma/client";
import {
  buildPaginationMeta,
  type PaginationMeta,
  type PaginationParams,
} from "@/lib/pagination";
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

export async function getNoticiasPaginated(
  params: PaginationParams
): Promise<{ items: Awaited<ReturnType<typeof getAllNoticias>>; meta: PaginationMeta }> {
  try {
    const [total, items] = await Promise.all([
      prisma.noticia.count(),
      prisma.noticia.findMany({
        orderBy: { fecha: "desc" },
        skip: params.skip,
        take: params.limit,
      }),
    ]);
    return {
      items,
      meta: buildPaginationMeta(total, params.page, params.limit),
    };
  } catch {
    return {
      items: [],
      meta: buildPaginationMeta(0, params.page, params.limit),
    };
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

export async function getGalleryMediaPaginated(
  params: PaginationParams,
  filter?: MediaTipo
) {
  try {
    const where = filter ? { tipo: filter } : undefined;
    const [total, items] = await Promise.all([
      prisma.media.count({ where }),
      prisma.media.findMany({
        where,
        orderBy: { fecha: "desc" },
        skip: params.skip,
        take: params.limit,
      }),
    ]);
    return {
      items,
      meta: buildPaginationMeta(total, params.page, params.limit),
    };
  } catch {
    return {
      items: [],
      meta: buildPaginationMeta(0, params.page, params.limit),
    };
  }
}

export async function getDocumentCategories() {
  try {
    return await prisma.categoriaDocumento.findMany({
      orderBy: [{ orden: "asc" }, { nombre: "asc" }],
      include: {
        documentos: { orderBy: [{ nombre: "asc" }, { fecha: "desc" }] },
      },
    });
  } catch {
    return [];
  }
}

export async function getDocumentCategoriesForAdmin() {
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
