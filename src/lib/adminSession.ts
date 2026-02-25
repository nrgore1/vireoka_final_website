import crypto from "crypto";
import { cookies } from "next/headers";
import type { NextResponse } from "next/server";

const COOKIE_NAME = "vireoka_admin";
const MAX_AGE_SEC = 60 * 60 * 8; // 8h

function secret(): string {
  const s = process.env.ADMIN_SESSION_SECRET;
  if (!s) throw new Error("ADMIN_SESSION_SECRET missing");
  return s;
}

function sign(payload: object): string {
  const data = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const sig = crypto
    .createHmac("sha256", secret())
    .update(data)
    .digest("base64url");
  return `${data}.${sig}`;
}

function verify<T>(token: string): T | null {
  const [data, sig] = token.split(".");
  if (!data || !sig) return null;

  const expected = crypto
    .createHmac("sha256", secret())
    .update(data)
    .digest("base64url");

  if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return null;

  try {
    return JSON.parse(Buffer.from(data, "base64url").toString("utf8")) as T;
  } catch {
    return null;
  }
}

/**
 * Create admin session cookie using Next's cookies() store (server components / actions).
 */
export async function createAdminSession(email: string) {
  const store = await cookies();
  const token = sign({ email, iat: Date.now() });
  store.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE_SEC,
  });
}

/**
 * Clear admin session cookie using Next's cookies() store.
 */
export async function clearAdminSession() {
  const store = await cookies();
  store.set(COOKIE_NAME, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
}

/**
 * Read admin session cookie.
 */
export async function readAdminSession(): Promise<{ email: string } | null> {
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;
  if (!token) return null;

  const payload = verify<{ email: string }>(token);
  if (!payload?.email) return null;

  const expected = (process.env.ADMIN_EMAIL || "").trim().toLowerCase();
  if (expected && payload.email.trim().toLowerCase() !== expected) return null;

  return { email: payload.email };
}

/**
 * ───────────────────────────────────────────────────────────────
 * Back-compat wrappers expected by some route handlers
 * ───────────────────────────────────────────────────────────────
 */

/**
 * Route-handler friendly: sets cookie onto the NextResponse object.
 * Signature matches calls like: createAdminSessionCookie(res, { email }).
 */
export function createAdminSessionCookie(res: NextResponse, opts: { email: string }) {
  const token = sign({ email: opts.email, iat: Date.now() });
  res.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE_SEC,
  });
}

/**
 * Route-handler friendly clear.
 */
export function clearAdminSessionCookie(res: NextResponse) {
  res.cookies.set(COOKIE_NAME, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
}
