import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";

const VIDEO_EXT = new Set([".mp4", ".webm", ".mov", ".ogg"]);

export function inferMediaTipo(filename: string): "image" | "video" {
  const ext = path.extname(filename).toLowerCase();
  return VIDEO_EXT.has(ext) ? "video" : "image";
}

export async function saveUpload(
  file: File,
  subdir: "noticias" | "galeria" | "documentos"
): Promise<{ url: string; size: number; mimeType: string }> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const ext = path.extname(file.name) || "";
  const filename = `${randomUUID()}${ext}`;
  const dir = path.join(process.cwd(), "public", "uploads", subdir);

  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, filename), buffer);

  return {
    url: `/uploads/${subdir}/${filename}`,
    size: buffer.byteLength,
    mimeType: file.type || "application/octet-stream",
  };
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
