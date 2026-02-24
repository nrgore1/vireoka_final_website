import { cookies, headers } from "next/headers";

/**
 * Next 16+: headers() and cookies() are async.
 * This file centralizes "server session" helpers used by protected layouts/routes.
 */

async function getBaseUrl() {
  const h = await headers();
  const proto = h.get("x-forwarded-proto") || "https";
  const host = h.get("x-forwarded-host") || h.get("host") || "";
  if (!host) return "";
  return `${proto}://${host}`;
}

export async function getServerBaseUrl(): Promise<string> {
  return await getBaseUrl();
}

function safeCookieHeader(all: { name: string; value: string }[]) {
  // Build a Cookie header string: "a=1; b=2"
  return all.map((c) => `${c.name}=${c.value}`).join("; ");
}

async function safeReadText(res: Response) {
  try {
    return await res.text();
  } catch {
    return "";
  }
}

/**
 * getInvestorSession()
 * Used by: src/app/intelligence/(protected)/layout.tsx
 *
 * Strategy:
 * - Reuse your existing /api/investors/me endpoint (single source of truth)
 * - Forward cookies so the API can authenticate
 * - Return a minimal, stable shape
 */
export type InvestorSession =
  | { ok: true; user: { email: string }; raw?: any }
  | { ok: false; user: null; error?: string; status?: number };

export async function getInvestorSession(): Promise<InvestorSession> {
  const c = await cookies();
  const cookieHeader = safeCookieHeader(c.getAll());

  // Prefer absolute URL when running behind a host; fallback to relative locally
  const base = await getBaseUrl();
  const url = base ? `${base}/api/investors/me` : "/api/investors/me";

  const res = await fetch(url, {
    method: "GET",
    headers: cookieHeader ? { cookie: cookieHeader } : undefined,
    cache: "no-store",
  });

  if (!res.ok) {
    const body = await safeReadText(res);
    return { ok: false, user: null, status: res.status, error: body || "Not authenticated" };
  }

  const data: any = await res.json().catch(() => ({}));

  const email =
    data?.user?.email ||
    data?.email ||
    data?.session?.user?.email ||
    null;

  if (!email) {
    return { ok: false, user: null, status: 401, error: "No user email in session payload" };
  }

  return { ok: true, user: { email }, raw: data };
}
