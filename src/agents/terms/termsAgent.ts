import { cookies } from "next/headers";

export type TermsStatus = "accepted" | "missing";

const TERMS_COOKIE = "vireoka_terms_v";
const TERMS_VERSION = process.env.TERMS_VERSION || "v1";

/**
 * Next.js 16+: cookies() is async.
 */
export async function getTermsStatus(): Promise<{ status: TermsStatus; version?: string }> {
  const store = await cookies();
  const v = store.get(TERMS_COOKIE)?.value;

  if (!v) return { status: "missing" };
  if (v === TERMS_VERSION) return { status: "accepted", version: v };
  return { status: "missing" };
}

/**
 * Sets Terms acceptance cookie for current session.
 */
export async function acceptTerms(): Promise<{ ok: true; version: string }> {
  const store = await cookies();
  store.set(TERMS_COOKIE, TERMS_VERSION, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });
  return { ok: true, version: TERMS_VERSION };
}

export function getTermsCookieMeta() {
  return { cookieName: TERMS_COOKIE, version: TERMS_VERSION };
}
