import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";
import { assertStorageQuota } from "@/lib/storage";
import {
  resolveStoredFilePath,
  safeUploadFilename,
  type UploadCategory,
} from "@/lib/upload-paths";

export type { UploadCategory } from "@/lib/upload-paths";

export class UploadValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "UploadValidationError";
  }
}

const RULES: Record<
  UploadCategory,
  { mimes: Set<string>; extensions: Set<string> }
> = {
  noticias: {
    mimes: new Set(["image/jpeg", "image/png", "image/webp", "video/mp4"]),
    extensions: new Set([".jpg", ".jpeg", ".png", ".webp", ".mp4"]),
  },
  galeria: {
    mimes: new Set(["image/jpeg", "image/png", "image/webp", "video/mp4"]),
    extensions: new Set([".jpg", ".jpeg", ".png", ".webp", ".mp4"]),
  },
  documentos: {
    mimes: new Set([
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ]),
    extensions: new Set([".pdf", ".docx", ".xlsx"]),
  },
};

function safeBasename(filename: string): string {
  try {
    return safeUploadFilename(filename);
  } catch {
    throw new UploadValidationError("Nombre de archivo no permitido");
  }
}

function resolveExtension(
  filename: string,
  mimeType: string,
  category: UploadCategory
): string {
  const rules = RULES[category];
  const fromName = path.extname(safeBasename(filename)).toLowerCase();

  if (fromName && rules.extensions.has(fromName)) return fromName;

  const mimeToExt: Record<string, string> = {
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp",
    "video/mp4": ".mp4",
    "application/pdf": ".pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
      ".docx",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
      ".xlsx",
  };

  const fromMime = mimeToExt[mimeType];
  if (fromMime && rules.extensions.has(fromMime)) return fromMime;

  throw new UploadValidationError(
    "Tipo de archivo no permitido para esta sección"
  );
}

function validateFile(file: File, category: UploadCategory) {
  const rules = RULES[category];
  const ext = path.extname(safeBasename(file.name)).toLowerCase();

  if (!rules.extensions.has(ext)) {
    throw new UploadValidationError(
      `Extensión no permitida. Permitidas: ${[...rules.extensions].join(", ")}`
    );
  }

  const mime = (file.type || "").toLowerCase();
  if (mime && !rules.mimes.has(mime)) {
    throw new UploadValidationError("Tipo MIME no permitido");
  }
}

export { inferMediaTipo, formatFileSize } from "@/lib/file-utils";

export async function saveUpload(
  file: File,
  category: UploadCategory
): Promise<{ url: string; size: number; mimeType: string }> {
  if (file.size <= 0) {
    throw new UploadValidationError("Archivo vacío");
  }

  validateFile(file, category);
  await assertStorageQuota(file.size);

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const mimeType = (file.type || "application/octet-stream").toLowerCase();
  const ext = resolveExtension(file.name, mimeType, category);
  const filename = `${randomUUID()}${ext}`;

  const targetPath = resolveStoredFilePath(category, filename);
  await mkdir(path.dirname(targetPath), { recursive: true });
  await writeFile(targetPath, buffer);

  return {
    url: `/uploads/${category}/${filename}`,
    size: buffer.byteLength,
    mimeType,
  };
}

