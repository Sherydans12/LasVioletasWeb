"use server";

import { revalidatePath } from "next/cache";
import { requireAdminSession } from "@/lib/api-auth";
import { deleteNoticiaWithAssets } from "@/lib/noticia-delete";

export type DeleteNoticiaResult =
  | { ok: true }
  | { ok: false; error: string };

export async function deleteNoticia(id: string): Promise<DeleteNoticiaResult> {
  const { error } = await requireAdminSession();
  if (error) {
    return { ok: false, error: "No autorizado" };
  }

  try {
    const deleted = await deleteNoticiaWithAssets(id);
    if (!deleted) {
      return { ok: false, error: "Noticia no encontrada" };
    }

    revalidatePath("/admin", "layout");
    revalidatePath("/admin/noticias");
    revalidatePath("/admin/galeria");
    revalidatePath("/noticias");
    revalidatePath("/galeria");

    return { ok: true };
  } catch {
    return { ok: false, error: "No se pudo eliminar la noticia" };
  }
}
