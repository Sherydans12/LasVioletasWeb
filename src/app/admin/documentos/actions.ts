"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/api-auth";
import { deleteStoredFileByUrl } from "@/lib/upload-delete";

export type DeleteDocumentoResult =
  | { ok: true }
  | { ok: false; error: string };

export async function deleteDocumento(
  id: string
): Promise<DeleteDocumentoResult> {
  const { error } = await requireAdminSession();
  if (error) {
    return { ok: false, error: "No autorizado" };
  }

  try {
    const documento = await prisma.documento.findUnique({ where: { id } });
    if (!documento) {
      return { ok: false, error: "Documento no encontrado" };
    }

    await prisma.documento.delete({ where: { id } });
    await deleteStoredFileByUrl(documento.archivoUrl);

    revalidatePath("/admin/documentos");
    revalidatePath("/documentos");

    return { ok: true };
  } catch {
    return { ok: false, error: "No se pudo eliminar el documento" };
  }
}
