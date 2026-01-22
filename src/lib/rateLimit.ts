import { NextResponse } from "next/server";

type RateLimitOptions = {
  max?: number;
  windowMs?: number;
};

const hits = new Map<string, { count: number; ts: number }>();

function getKeyFromRequest(req: Request) {
  const ip =
    req.headers.get("x-forwarded-for") ||
    req.headers.get("x-real-ip") ||
    "unknown";

  const url = new URL(req.url);
  return `${ip}:${url.pathname}`;
}

export function rateLimit(
  key: string,
  max: number,
  windowMs: number
) {
  const now = Date.now();
  const entry = hits.get(key);

  if (!entry || now - entry.ts > windowMs) {
    hits.set(key, { count: 1, ts: now });
    return true;
  }

  if (entry.count >= max) return false;

  entry.count++;
  return true;
}

export function rateLimitOrThrow(
  req: Request,
  options: RateLimitOptions = {}
) {
  const max = options.max ?? 10;
  const windowMs = options.windowMs ?? 60_000;

  const key = getKeyFromRequest(req);

  if (!rateLimit(key, max, windowMs)) {
    throw new Response(
      JSON.stringify({ error: "Rate limit exceeded" }),
      { status: 429 }
    );
  }
}
