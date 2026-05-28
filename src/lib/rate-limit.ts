type Bucket = {
  count: number;
  resetAt: number;
};

const buckets = new Map<string, Bucket>();

/** Limitador en memoria (por instancia de proceso). Adecuado para VPS single-node. */
export function rateLimit(
  key: string,
  limit: number,
  windowMs: number
): { ok: boolean; retryAfterSec?: number } {
  const now = Date.now();
  const existing = buckets.get(key);

  if (!existing || now >= existing.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true };
  }

  existing.count += 1;

  if (existing.count > limit) {
    return {
      ok: false,
      retryAfterSec: Math.ceil((existing.resetAt - now) / 1000),
    };
  }

  return { ok: true };
}

/** Limpieza periódica para evitar crecimiento ilimitado del Map. */
export function pruneRateLimitBuckets() {
  const now = Date.now();
  for (const [key, bucket] of buckets.entries()) {
    if (now >= bucket.resetAt) buckets.delete(key);
  }
}
