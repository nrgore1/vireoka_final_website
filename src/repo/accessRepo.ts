import { cookies, headers } from "next/headers";

/**
 * Build a safe origin for server-side "self fetch".
 * Next 16 dynamic APIs are async, so we await headers()/cookies().
 */
async function getBaseUrl() {
  const h = await headers();

  const host =
    h.get("x-forwarded-host") ||
    h.get("host") ||
    process.env.NEXT_PUBLIC_SITE_HOST ||
    "";

  const xfProto = h.get("x-forwarded-proto");

  let proto =
    xfProto ||
    (host.includes("localhost") || host.startsWith("127.0.0.1") ? "http" : "https");

  const originOverride =
    process.env.NEXT_PUBLIC_SITE_ORIGIN?.trim() ||
    process.env.SITE_ORIGIN?.trim() ||
    "";

  if (originOverride) return originOverride.replace(/\/$/, "");
  if (!host) return "";
  return `${proto}://${host}`;
}

async function getCookieHeader() {
  const store = await cookies();
  const all = store.getAll();
  return all.map((x) => `${x.name}=${x.value}`).join("; ");
}

export async function fetchMe() {
  const base = await getBaseUrl();
  const cookieHeader = await getCookieHeader();

  try {
    const res = await fetch(`${base}/api/investors/me`, {
      method: "GET",
      headers: cookieHeader ? { cookie: cookieHeader } : {},
      cache: "no-store",
    });

    if (!res.ok) return { ok: false as const, status: res.status };
    const data = await res.json().catch(() => ({}));
    return { ok: true as const, status: res.status, data };
  } catch (e: any) {
    return { ok: false as const, status: 0, error: String(e?.message || e) };
  }
}

export async function fetchExistingPortalAccessCheck() {
  const base = await getBaseUrl();
  const cookieHeader = await getCookieHeader();

  try {
    const res = await fetch(`${base}/api/portal/access-check`, {
      method: "GET",
      headers: cookieHeader ? { cookie: cookieHeader } : {},
      cache: "no-store",
    });

    if (!res.ok) return { ok: false as const, status: res.status };
    const data = await res.json().catch(() => ({}));
    return { ok: true as const, status: res.status, data };
  } catch (e: any) {
    return { ok: false as const, status: 0, error: String(e?.message || e) };
  }
}
