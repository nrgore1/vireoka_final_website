import { NextResponse } from "next/server";

type RateLimitOptions = {
  max: number;
  windowMs: number;
};

const store = new Map<
  string,
  { count: number; resetAt: number }
>();

export function rateLimit(
  key: string,
  opts: RateLimitOptions
): boolean {
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || entry.resetAt < now) {
    store.set(key, {
      count: 1,
      resetAt: now + opts.windowMs,
    });
    return true;
  }

  if (entry.count >= opts.max) {
    return false;
  }

  entry.count += 1;
  return true;
}

/**
 * Convenience helper for API routes.
 * Returns a NextResponse if rate-limited, otherwise null.
 */
export function rateLimitOrThrow(
  req: Request,
  opts: RateLimitOptions
): NextResponse | null {
  const ip =
    req.headers.get("x-forwarded-for") ||
    req.headers.get("x-real-ip") ||
    "local";

  const key = `${opts.max}:${opts.windowMs}:${ip}`;

  if (!rateLimit(key, opts)) {
    return NextResponse.json(
      { ok: false, error: "Rate limited" },
      { status: 429 }
    );
  }

  return null;
}
