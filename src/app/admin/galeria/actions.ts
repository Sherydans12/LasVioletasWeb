"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/api-auth";
import { deleteStoredFileByUrl } from "@/lib/upload-delete";

export type DeleteMediaResult =
  | { ok: true }
  | { ok: false; error: string };

export async function deleteMedia(id: string): Promise<DeleteMediaResult> {
  const { error } = await requireAdminSession();
  if (error) {
    return { ok: false, error: "No autorizado" };
  }

  try {
    const media = await prisma.media.findUnique({ where: { id } });
    if (!media) {
      return { ok: false, error: "Recurso no encontrado" };
    }

    await prisma.media.delete({ where: { id } });
    await deleteStoredFileByUrl(media.url);
    revalidatePath("/admin/galeria");

    return { ok: true };
  } catch {
    return { ok: false, error: "No se pudo eliminar el recurso" };
  }
}
