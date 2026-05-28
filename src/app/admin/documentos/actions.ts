"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/api-auth";
import { assertStorageQuota, StorageQuotaError } from "@/lib/storage";
import { deleteStoredFileByUrl } from "@/lib/upload-delete";
import { saveUpload } from "@/lib/uploads";

function revalidateDocumentosCache() {
  revalidatePath("/admin", "layout");
  revalidatePath("/admin/documentos");
  revalidatePath("/documentos");
}

type ActionResult = { ok: true } | { ok: false; error: string };

export type DeleteDocumentoResult = ActionResult;
export type RenameCategoriaResult = ActionResult;
export type DeleteCategoriaResult = ActionResult;
export type UpdateDocumentoResult = ActionResult;

export async function deleteDocumento(id: string): Promise<DeleteDocumentoResult> {
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
    revalidateDocumentosCache();

    return { ok: true };
  } catch {
    return { ok: false, error: "No se pudo eliminar el documento" };
  }
}

export async function renameCategoria(
  id: string,
  nombre: string
): Promise<RenameCategoriaResult> {
  const { error } = await requireAdminSession();
  if (error) {
    return { ok: false, error: "No autorizado" };
  }

  const trimmed = nombre.trim();
  if (trimmed.length < 2) {
    return { ok: false, error: "El nombre debe tener al menos 2 caracteres." };
  }

  try {
    const existing = await prisma.categoriaDocumento.findUnique({ where: { id } });
    if (!existing) {
      return { ok: false, error: "Carpeta no encontrada" };
    }

    await prisma.categoriaDocumento.update({
      where: { id },
      data: { nombre: trimmed },
    });
    revalidateDocumentosCache();

    return { ok: true };
  } catch {
    return {
      ok: false,
      error: "No se pudo renombrar la carpeta. Verifica que el nombre no esté en uso.",
    };
  }
}

export async function deleteCategoria(id: string): Promise<DeleteCategoriaResult> {
  const { error } = await requireAdminSession();
  if (error) {
    return { ok: false, error: "No autorizado" };
  }

  try {
    const categoria = await prisma.categoriaDocumento.findUnique({
      where: { id },
      include: { documentos: true },
    });
    if (!categoria) {
      return { ok: false, error: "Carpeta no encontrada" };
    }

    for (const documento of categoria.documentos) {
      await deleteStoredFileByUrl(documento.archivoUrl);
    }

    await prisma.categoriaDocumento.delete({ where: { id } });
    revalidateDocumentosCache();

    return { ok: true };
  } catch {
    return { ok: false, error: "No se pudo eliminar la carpeta" };
  }
}

export async function updateDocumento(
  id: string,
  formData: FormData
): Promise<UpdateDocumentoResult> {
  const { error } = await requireAdminSession();
  if (error) {
    return { ok: false, error: "No autorizado" };
  }

  const nombre = String(formData.get("nombre") ?? "").trim();
  const archivo = formData.get("archivo");

  if (nombre.length < 2) {
    return { ok: false, error: "El título debe tener al menos 2 caracteres." };
  }

  try {
    const documento = await prisma.documento.findUnique({ where: { id } });
    if (!documento) {
      return { ok: false, error: "Documento no encontrado" };
    }

    const updateData: {
      nombre: string;
      archivoUrl?: string;
      tamanoBytes?: number;
      mimeType?: string;
    } = { nombre };

    if (archivo instanceof File && archivo.size > 0) {
      const netBytes = archivo.size - documento.tamanoBytes;
      await assertStorageQuota(netBytes);

      const saved = await saveUpload(archivo, "documentos");
      await deleteStoredFileByUrl(documento.archivoUrl);

      updateData.archivoUrl = saved.url;
      updateData.tamanoBytes = saved.size;
      updateData.mimeType = saved.mimeType;
    }

    await prisma.documento.update({
      where: { id },
      data: updateData,
    });
    revalidateDocumentosCache();

    return { ok: true };
  } catch (err) {
    if (err instanceof StorageQuotaError) {
      return { ok: false, error: err.message };
    }
    return { ok: false, error: "No se pudo actualizar el documento" };
  }
}
