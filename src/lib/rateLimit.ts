const map = new Map<string, number[]>();

export function rateLimit(key: string, limit = 5, windowMs = 60000) {
  const now = Date.now();
  const hits = map.get(key)?.filter((t) => now - t < windowMs) || [];

  if (hits.length >= limit) return false;

  hits.push(now);
  map.set(key, hits);
  return true;
}
