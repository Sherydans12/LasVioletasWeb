import path from "path";

export const UPLOAD_CATEGORIES = ["galeria", "noticias", "documentos"] as const;
export type UploadCategory = (typeof UPLOAD_CATEGORIES)[number];

/** Raíz de archivos subidos (fuera de `public/` para despliegue standalone). */
export function getUploadDir(): string {
  const fromEnv = process.env.UPLOAD_DIR?.trim();
  if (fromEnv) return path.resolve(fromEnv);
  return path.join(process.cwd(), "storage");
}

export function safeUploadFilename(filename: string): string {
  const base = path.basename(filename.replace(/\\/g, "/"));
  if (
    !base ||
    base.includes("..") ||
    base.includes("/") ||
    base.includes("\0")
  ) {
    throw new Error("Nombre de archivo no permitido");
  }
  return base;
}

export function isUploadCategory(dir: string): dir is UploadCategory {
  return (UPLOAD_CATEGORIES as readonly string[]).includes(dir);
}

export function resolveStoredFilePath(
  category: UploadCategory,
  filename: string
): string {
  const root = path.resolve(getUploadDir());
  const targetDir = path.resolve(root, category);

  if (!targetDir.startsWith(root + path.sep) && targetDir !== root) {
    throw new Error("Ruta de destino inválida");
  }

  const safeName = safeUploadFilename(filename);
  const filePath = path.resolve(targetDir, safeName);

  if (!filePath.startsWith(targetDir + path.sep)) {
    throw new Error("Ruta de archivo inválida");
  }

  return filePath;
}

export function parseUploadUrl(
  url: string
): { category: UploadCategory; filename: string } | null {
  const match = url.match(/^\/uploads\/([^/]+)\/([^/]+)$/);
  if (!match) return null;

  const category = match[1];
  const filename = match[2];
  if (!isUploadCategory(category)) return null;

  try {
    return { category, filename: safeUploadFilename(filename) };
  } catch {
    return null;
  }
}

const EXT_TO_MIME: Record<string, string> = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".mp4": "video/mp4",
  ".pdf": "application/pdf",
  ".docx":
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
};

export function contentTypeFromFilename(filename: string): string {
  const ext = path.extname(filename).toLowerCase();
  return EXT_TO_MIME[ext] ?? "application/octet-stream";
}
