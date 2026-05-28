import type { MediaTipo, Prisma } from "@prisma/client";

export type GalleryFilterType = "all" | "image" | "video";

export function parseGalleryTypeParam(
  type: string | undefined
): GalleryFilterType {
  if (type === "image" || type === "video") return type;
  return "all";
}

/** Filtros de galería admin (`q` busca en la URL del archivo; `type` usa enum `Media.tipo`). */
export function buildMediaAdminWhere(
  q?: string,
  type?: string
): Prisma.MediaWhereInput {
  const where: Prisma.MediaWhereInput = {};
  const query = q?.trim();

  if (query) {
    where.url = { contains: query, mode: "insensitive" };
  }

  const parsedType = parseGalleryTypeParam(type);
  if (parsedType === "image" || parsedType === "video") {
    where.tipo = parsedType satisfies MediaTipo;
  }

  return where;
}

export function buildGalleryQueryString(opts: {
  q?: string;
  type?: string;
  page?: number;
  limit?: number;
}): string {
  const params = new URLSearchParams();
  if (opts.q?.trim()) params.set("q", opts.q.trim());
  if (opts.type && opts.type !== "all") params.set("type", opts.type);
  if (opts.page && opts.page > 1) params.set("page", String(opts.page));
  if (opts.limit && opts.limit !== 12) params.set("limit", String(opts.limit));
  const qs = params.toString();
  return qs ? `?${qs}` : "";
}
