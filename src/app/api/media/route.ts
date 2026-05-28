import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import type { MediaTipo } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/api-auth";
import { handleUploadRouteError } from "@/lib/api-errors";
import { inferMediaTipo, saveUpload } from "@/lib/uploads";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const tipo = searchParams.get("tipo") as MediaTipo | null;

  try {
    const media = await prisma.media.findMany({
      where: tipo ? { tipo } : undefined,
      orderBy: { fecha: "desc" },
    });
    return NextResponse.json(media);
  } catch {
    return NextResponse.json(
      { error: "No se pudo cargar la galería" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const { error } = await requireAdminSession();
  if (error) return error;

  try {
    const form = await request.formData();
    const file = form.get("archivo");
    const destacado = form.get("destacado") === "true";
    const tipoParam = String(form.get("tipo") ?? "");

    if (!(file instanceof File) || file.size === 0) {
      return NextResponse.json({ error: "Archivo requerido" }, { status: 400 });
    }

    const saved = await saveUpload(file, "galeria");
    const tipo =
      tipoParam === "video" || tipoParam === "image"
        ? tipoParam
        : inferMediaTipo(file.name) === "video"
          ? "video"
          : "image";

    const media = await prisma.media.create({
      data: {
        url: saved.url,
        tipo,
        origen: "directo",
        destacado,
        tamanoBytes: saved.size,
      },
    });

    revalidatePath("/admin/galeria");
    revalidatePath("/galeria");

    return NextResponse.json(media, { status: 201 });
  } catch (err) {
    return handleUploadRouteError(err);
  }
}
