import { unlink } from "fs/promises";
import {
  parseUploadUrl,
  resolveStoredFilePath,
} from "@/lib/upload-paths";

/** Elimina el archivo en disco asociado a una URL `/uploads/...` (ignora ENOENT). */
export async function deleteStoredFileByUrl(url: string): Promise<void> {
  const parsed = parseUploadUrl(url);
  if (!parsed) return;

  const filePath = resolveStoredFilePath(parsed.category, parsed.filename);
  try {
    await unlink(filePath);
  } catch (err) {
    const code = (err as NodeJS.ErrnoException).code;
    if (code !== "ENOENT") throw err;
  }
}
