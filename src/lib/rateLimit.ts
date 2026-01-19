const buckets = new Map<string, { count: number; ts: number }>();

export function rateLimit(key: string, limit = 30, windowMs = 60000) {
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
