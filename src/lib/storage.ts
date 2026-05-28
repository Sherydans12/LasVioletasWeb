import { prisma } from "@/lib/prisma";

/** Límite contratado (`MAX_STORAGE_GB`, fallback 10). */
export const STORAGE_LIMIT_BYTES =
  Number(process.env.MAX_STORAGE_GB || 10) * 1024 * 1024 * 1024;

export const STORAGE_LIMIT_GB = Number(process.env.MAX_STORAGE_GB || 10);

export class StorageQuotaError extends Error {
  readonly code = "STORAGE_QUOTA_EXCEEDED";

  constructor() {
    super("Espacio de almacenamiento contratado insuficiente");
    this.name = "StorageQuotaError";
  }
}

export async function getUsedStorageBytes(): Promise<number> {
  try {
    const [mediaSum, documentoSum] = await Promise.all([
      prisma.media.aggregate({ _sum: { tamanoBytes: true } }),
      prisma.documento.aggregate({ _sum: { tamanoBytes: true } }),
    ]);

    return (
      (mediaSum._sum.tamanoBytes ?? 0) + (documentoSum._sum.tamanoBytes ?? 0)
    );
  } catch {
    return 0;
  }
}

export async function assertStorageQuota(additionalBytes: number): Promise<void> {
  if (additionalBytes <= 0) return;

  const used = await getUsedStorageBytes();
  if (used + additionalBytes > STORAGE_LIMIT_BYTES) {
    throw new StorageQuotaError();
  }
}

export type StorageStats = {
  usedBytes: number;
  limitBytes: number;
  usedGb: number;
  limitGb: number;
  percentUsed: number;
};

export async function getStorageStats(): Promise<StorageStats> {
  const usedBytes = await getUsedStorageBytes();
  const limitBytes = STORAGE_LIMIT_BYTES;
  const usedGb = usedBytes / 1024 ** 3;
  const limitGb = limitBytes / 1024 ** 3;
  const percentUsed =
    limitBytes > 0 ? Math.min(100, (usedBytes / limitBytes) * 100) : 0;

  return {
    usedBytes,
    limitBytes,
    usedGb,
    limitGb,
    percentUsed,
  };
}
