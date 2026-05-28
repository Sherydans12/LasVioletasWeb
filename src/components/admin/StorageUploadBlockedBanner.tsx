import type { StorageQuotaInfo } from "@/lib/storage-quota";

type StorageUploadBlockedBannerProps = {
  storage: StorageQuotaInfo;
};

export function StorageUploadBlockedBanner({
  storage,
}: StorageUploadBlockedBannerProps) {
  if (!storage.uploadsBlocked) return null;

  return (
    <p className="text-sm text-destructive font-medium" role="alert">
      Espacio crítico: queda menos de 1 GB libre. Libera archivos antes de subir
      nuevos contenidos.
    </p>
  );
}

export function isAdminFormErrorMessage(message: string): boolean {
  const lower = message.toLowerCase();
  return (
    lower.includes("error") ||
    lower.includes("insuficiente") ||
    lower.includes("crítico") ||
    lower.includes("critico")
  );
}
