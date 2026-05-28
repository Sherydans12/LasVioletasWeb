import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/api-auth";
import { deleteNoticiaWithAssets } from "@/lib/noticia-delete";
import { handleUploadRouteError } from "@/lib/api-errors";
import { syncMediaFromNoticia, type MediaSyncItem } from "@/lib/media-sync";
import { assertStorageQuota } from "@/lib/storage";
import { saveUpload } from "@/lib/uploads";

type RouteContext = { params: Promise<{ id: string }> };

function parseFecha(fechaRaw: string): Date | null {
  if (!fechaRaw.trim()) return null;
  const parsed = new Date(fechaRaw);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

export async function PATCH(request: Request, context: RouteContext) {
  const { error } = await requireAdminSession();
  if (error) return error;

  const { id } = await context.params;

  try {
    const existing = await prisma.noticia.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Noticia no encontrada" }, { status: 404 });
    }

    const form = await request.formData();
    const titulo = String(form.get("titulo") ?? "").trim();
    const contenido = String(form.get("contenido") ?? "").trim();
    const fechaRaw = String(form.get("fecha") ?? "");
    const fecha = parseFecha(fechaRaw);
    if (!fecha) {
      return NextResponse.json(
        { error: "Fecha de publicación inválida o requerida" },
        { status: 400 }
      );
    }

    if (!titulo || !contenido) {
      return NextResponse.json(
        { error: "Título y contenido son obligatorios" },
        { status: 400 }
      );
    }

    const pendingFiles: File[] = [];
    const portada = form.get("portada");
    if (portada instanceof File && portada.size > 0) pendingFiles.push(portada);

    for (const file of form.getAll("imagenes")) {
      if (file instanceof File && file.size > 0) pendingFiles.push(file);
    }

    const totalBytes = pendingFiles.reduce((sum, f) => sum + f.size, 0);
    await assertStorageQuota(totalBytes);

    const existingMedia = await prisma.media.findMany({
      where: { asociadoAId: id, origen: "noticia" },
    });

    const mediaItems: MediaSyncItem[] = existingMedia.map((m) => ({
      url: m.url,
      tamanoBytes: m.tamanoBytes,
    }));

    let newPortadaUrl: string | null = null;
    for (const file of pendingFiles) {
      const saved = await saveUpload(file, "noticias");
      if (!newPortadaUrl && portada instanceof File && file === portada) {
        newPortadaUrl = saved.url;
      }
      mediaItems.push({ url: saved.url, tamanoBytes: saved.size });
    }

    const uniqueByUrl = new Map<string, MediaSyncItem>();
    for (const item of mediaItems) {
      if (item.url) uniqueByUrl.set(item.url, item);
    }
    const mergedItems = [...uniqueByUrl.values()];
    const imagenUrls = mergedItems.map((m) => m.url);

    let portadaUrl = newPortadaUrl ?? existing.portadaUrl;
    if (!portadaUrl && imagenUrls.length > 0) {
      portadaUrl = imagenUrls[0];
    }

    const noticia = await prisma.$transaction(async (tx) => {
      const updated = await tx.noticia.update({
        where: { id },
        data: {
          titulo,
          contenido,
          fecha,
          portadaUrl,
          imagenes: imagenUrls.length > 0 ? imagenUrls : existing.imagenes,
        },
      });
      await syncMediaFromNoticia(id, mergedItems, tx);
      return updated;
    });

    revalidatePath("/admin", "layout");
    revalidatePath("/admin/galeria");
    revalidatePath("/admin/noticias");
    revalidatePath(`/admin/noticias/${id}/edit`);
    revalidatePath("/galeria");
    revalidatePath("/noticias");
    revalidatePath(`/noticias/${id}`);

    return NextResponse.json(noticia);
  } catch (err) {
    return handleUploadRouteError(err);
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  const { error } = await requireAdminSession();
  if (error) return error;

  const { id } = await context.params;

  try {
    const deleted = await deleteNoticiaWithAssets(id);
    if (!deleted) {
      return NextResponse.json({ error: "Noticia no encontrada" }, { status: 404 });
    }

    revalidatePath("/admin", "layout");
    revalidatePath("/admin/noticias");
    revalidatePath("/admin/galeria");
    revalidatePath("/noticias");
    revalidatePath("/galeria");

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "No se pudo eliminar la noticia" },
      { status: 500 }
    );
  }
}
