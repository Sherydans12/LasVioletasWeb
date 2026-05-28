/** Reserva mínima: por debajo de este umbral se bloquean nuevas subidas. */
export const STORAGE_CRITICAL_RESERVE_BYTES = 1024 ** 3;

export const STORAGE_QUOTA_ERROR_MESSAGE =
  "Espacio de almacenamiento contratado insuficiente";

export type StorageQuotaInfo = {
  availableBytes: number;
  availableGb: number;
  limitGb: number;
  isCritical: boolean;
  uploadsBlocked: boolean;
};

export function buildStorageQuotaInfo(
  usedBytes: number,
  limitBytes: number
): StorageQuotaInfo {
  const availableBytes = Math.max(0, limitBytes - usedBytes);
  const isCritical = availableBytes <= STORAGE_CRITICAL_RESERVE_BYTES;
  const uploadsBlocked = isCritical;

  return {
    availableBytes,
    availableGb: availableBytes / 1024 ** 3,
    limitGb: limitBytes / 1024 ** 3,
    isCritical,
    uploadsBlocked,
  };
}

export function fileExceedsAvailableStorage(
  fileSize: number,
  availableBytes: number
): boolean {
  return fileSize > availableBytes;
}
