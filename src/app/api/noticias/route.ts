import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/api-auth";
import { saveUpload } from "@/lib/uploads";
import { syncMediaFromNoticia } from "@/lib/media-sync";

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
    const fechaRaw = String(form.get("fecha") ?? "");
    const fecha = fechaRaw ? new Date(fechaRaw) : new Date();

    if (!titulo || !contenido) {
      return NextResponse.json(
        { error: "Título y contenido son obligatorios" },
        { status: 400 }
      );
    }

    const imagenUrls: string[] = [];
    const portada = form.get("portada");
    if (portada instanceof File && portada.size > 0) {
      const saved = await saveUpload(portada, "noticias");
      imagenUrls.push(saved.url);
    }

    const adjuntos = form.getAll("imagenes");
    for (const file of adjuntos) {
      if (file instanceof File && file.size > 0) {
        const saved = await saveUpload(file, "noticias");
        imagenUrls.push(saved.url);
      }
    }

    const portadaUrl = imagenUrls[0] ?? null;
    const imagenes = imagenUrls;

    const noticia = await prisma.$transaction(async (tx) => {
      const created = await tx.noticia.create({
        data: { titulo, contenido, fecha, portadaUrl, imagenes },
      });
      await syncMediaFromNoticia(created.id, imagenes, tx);
      return created;
    });

    return NextResponse.json(noticia, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Error al crear la noticia" },
      { status: 500 }
    );
  }
}
