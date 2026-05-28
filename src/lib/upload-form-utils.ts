import {
  fileExceedsAvailableStorage,
  STORAGE_QUOTA_ERROR_MESSAGE,
  type StorageQuotaInfo,
} from "@/lib/storage-quota";

export async function parseUploadErrorResponse(
  res: Response,
  fallback: string
): Promise<string> {
  try {
    const body = (await res.json()) as { error?: string };
    return body.error ?? fallback;
  } catch {
    return fallback;
  }
}

export function validateUploadAgainstStorage(
  totalBytes: number,
  storage: StorageQuotaInfo
): string | null {
  if (storage.uploadsBlocked) {
    return "Espacio crítico: queda menos de 1 GB libre. Libera archivos antes de subir nuevos contenidos.";
  }

  if (fileExceedsAvailableStorage(totalBytes, storage.availableBytes)) {
    return STORAGE_QUOTA_ERROR_MESSAGE;
  }

  return null;
}
