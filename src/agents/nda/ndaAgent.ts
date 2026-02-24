import { cookies } from "next/headers";

export type NdaStatus = "accepted" | "missing";

const NDA_COOKIE = "vireoka_nda_v";
const NDA_VERSION = process.env.NDA_VERSION || "v1";

/**
 * Next.js 16+: cookies() is async.
 */
export async function getNdaStatus(): Promise<{ status: NdaStatus; version?: string }> {
  const store = await cookies();
  const v = store.get(NDA_COOKIE)?.value;

  if (!v) return { status: "missing" };
  if (v === NDA_VERSION) return { status: "accepted", version: v };
  return { status: "missing" };
}

/**
 * Called from route handlers (e.g. /api/legal/nda/accept).
 * Sets the NDA acceptance cookie for the current session.
 */
export async function acceptNda(): Promise<{ ok: true; version: string }> {
  const store = await cookies();
  store.set(NDA_COOKIE, NDA_VERSION, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });
  return { ok: true, version: NDA_VERSION };
}

export function getNdaCookieMeta() {
  return { cookieName: NDA_COOKIE, version: NDA_VERSION };
}
