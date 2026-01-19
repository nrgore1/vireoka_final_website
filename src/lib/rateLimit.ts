type Bucket = { count: number; ts: number };

const buckets = new Map<string, Bucket>();

export function rateLimit(
  key: string,
  limit = 30,
  windowMs = 60_000
): boolean {
  const now = Date.now();
  const b = buckets.get(key);

  if (!b || now - b.ts > windowMs) {
    buckets.set(key, { count: 1, ts: now });
    return true;
  }

  if (b.count >= limit) return false;

  b.count++;
  return true;
}

export function rateLimitOrThrow(
  key: string,
  limit = 30,
  windowMs = 60_000
) {
  if (!rateLimit(key, limit, windowMs)) {
    throw new Error("RATE_LIMITED");
  }
}
