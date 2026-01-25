const buckets = new Map<string, { count: number; resetAt: number }>();

export function rateLimitOrThrow(key: string, limit: number, windowMs: number) {
  const now = Date.now();
  const b = buckets.get(key);

  if (!b || now >= b.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return;
  }

  b.count += 1;
  if (b.count > limit) {
    const err = new Error("RATE_LIMITED");
    (err as any).retryAfterMs = b.resetAt - now;
    throw err;
  }
}
