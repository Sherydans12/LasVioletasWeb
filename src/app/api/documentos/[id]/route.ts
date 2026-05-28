import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/api-auth";
import { deleteStoredFileByUrl } from "@/lib/upload-delete";

type RouteContext = { params: Promise<{ id: string }> };

export async function DELETE(_request: Request, context: RouteContext) {
  const { error } = await requireAdminSession();
  if (error) return error;

  const { id } = await context.params;

  try {
    const documento = await prisma.documento.findUnique({ where: { id } });
    if (!documento) {
      return NextResponse.json({ error: "Documento no encontrado" }, { status: 404 });
    }

    await prisma.documento.delete({ where: { id } });
    await deleteStoredFileByUrl(documento.archivoUrl);

    revalidatePath("/admin", "layout");
    revalidatePath("/admin/documentos");
    revalidatePath("/documentos");

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "No se pudo eliminar el documento" },
      { status: 500 }
    );
  }
}
