import { cookies, headers } from "next/headers";

function getBaseUrl() {
  const h = headers();
  const proto = h.get("x-forwarded-proto") || "https";
  const host = h.get("x-forwarded-host") || h.get("host");
  if (!host) return "";
  return `${proto}://${host}`;
}

export async function getInvestorSession() {
  try {
    const base = getBaseUrl();
    const cookieStore = cookies();
    const cookieHeader = cookieStore
      .getAll()
      .map((c) => `${c.name}=${c.value}`)
      .join("; ");

    const res = await fetch(`${base}/api/investors/me`, {
      method: "GET",
      headers: cookieHeader ? { cookie: cookieHeader } : {},
      cache: "no-store",
    });

    if (!res.ok) return { ok: false as const, status: res.status };
    const data = await res.json().catch(() => ({}));
    return { ok: true as const, status: res.status, data };
  } catch {
    return { ok: false as const, status: 500 };
  }
}
