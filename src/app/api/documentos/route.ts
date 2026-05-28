import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/api-auth";
import { handleUploadRouteError } from "@/lib/api-errors";
import { saveUpload } from "@/lib/uploads";

export async function POST(request: Request) {
  const { error } = await requireAdminSession();
  if (error) return error;

  try {
    const form = await request.formData();
    const categoriaId = String(form.get("categoriaId") ?? "");
    const nombre = String(form.get("nombre") ?? "").trim();
    const file = form.get("archivo");

    if (!categoriaId || !(file instanceof File) || file.size === 0) {
      return NextResponse.json(
        { error: "Categoría y archivo son obligatorios" },
        { status: 400 }
      );
    }

    const saved = await saveUpload(file, "documentos");
    const documento = await prisma.documento.create({
      data: {
        nombre: nombre || file.name,
        archivoUrl: saved.url,
        categoriaId,
        tamanoBytes: saved.size,
        mimeType: saved.mimeType,
      },
    });

    return NextResponse.json(documento, { status: 201 });
  } catch (err) {
    return handleUploadRouteError(err);
  }
}
