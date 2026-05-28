import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/api-auth";
import { handleUploadRouteError } from "@/lib/api-errors";
import { syncMediaFromNoticia } from "@/lib/media-sync";
import { assertStorageQuota } from "@/lib/storage";
import { saveUpload } from "@/lib/uploads";

export async function GET() {
  try {
    const noticias = await prisma.noticia.findMany({
      orderBy: { fecha: "desc" },
    });
    return NextResponse.json(noticias);
  } catch {
    return NextResponse.json(
      { error: "No se pudo cargar noticias" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const { error } = await requireAdminSession();
  if (error) return error;

  try {
    const form = await request.formData();
    const titulo = String(form.get("titulo") ?? "").trim();
    const contenido = String(form.get("contenido") ?? "").trim();
    const fechaRaw = String(form.get("fecha") ?? "").trim();
    const fecha = fechaRaw ? new Date(fechaRaw) : null;
    if (!fecha || Number.isNaN(fecha.getTime())) {
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

    const mediaItems: { url: string; tamanoBytes: number }[] = [];

    for (const file of pendingFiles) {
      const saved = await saveUpload(file, "noticias");
      mediaItems.push({ url: saved.url, tamanoBytes: saved.size });
    }

    const imagenUrls = mediaItems.map((m) => m.url);
    const portadaUrl = imagenUrls[0] ?? null;

    const noticia = await prisma.$transaction(async (tx) => {
      const created = await tx.noticia.create({
        data: {
          titulo,
          contenido,
          fecha,
          portadaUrl,
          imagenes: imagenUrls,
        },
      });
      await syncMediaFromNoticia(created.id, mediaItems, tx);
      return created;
    });

    revalidatePath("/admin", "layout");
    revalidatePath("/admin/galeria");
    revalidatePath("/admin/noticias");
    revalidatePath("/galeria");
    revalidatePath("/noticias");

    return NextResponse.json(noticia, { status: 201 });
  } catch (err) {
    return handleUploadRouteError(err);
  }
}
