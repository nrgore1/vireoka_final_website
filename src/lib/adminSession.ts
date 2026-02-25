export const runtime = "nodejs";

import crypto from "crypto";
import type { NextResponse } from "next/server";
import { cookies } from "next/headers";

const COOKIE_NAME = "vireoka_admin";
const MAX_AGE_SECONDS = 60 * 60 * 12; // 12h

function secret() {
  const s = process.env.ADMIN_SESSION_SECRET;
  if (!s) throw new Error("Missing env: ADMIN_SESSION_SECRET");
  return s;
}

function base64url(input: Buffer | string) {
  const b = Buffer.isBuffer(input) ? input : Buffer.from(input);
  return b
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

function sign(payload: object) {
  const body = base64url(JSON.stringify(payload));
  const mac = crypto.createHmac("sha256", secret()).update(body).digest();
  return `${body}.${base64url(mac)}`;
}

function verify(token: string): any | null {
  const parts = token.split(".");
  if (parts.length !== 2) return null;
  const [body, sig] = parts;
  const mac = base64url(crypto.createHmac("sha256", secret()).update(body).digest());
  if (mac !== sig) return null;
  try {
    return JSON.parse(Buffer.from(body.replace(/-/g, "+").replace(/_/g, "/"), "base64").toString("utf8"));
  } catch {
    return null;
  }
}

/**
 * Server components / route handlers can read this.
 */
export async function readAdminSession(): Promise<{ email: string } | null> {
  const c = await cookies();
  const token = c.get(COOKIE_NAME)?.value || "";
  const data = token ? verify(token) : null;
  if (!data?.email) return null;
  return { email: String(data.email) };
}

/**
 * Used in server contexts (sets cookie via next/headers cookies()).
 */
export async function createAdminSession(session: { email: string }) {
  const c = await cookies();
  c.set(COOKIE_NAME, sign({ email: session.email, iat: Date.now() }), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE_SECONDS,
  });
}

export async function clearAdminSession() {
  const c = await cookies();
  c.set(COOKIE_NAME, "", { path: "/", maxAge: 0 });
}

/**
 * Route-handler friendly helpers (mutate a NextResponse).
 */
export function createAdminSessionCookie(res: NextResponse, session: { email: string }) {
  res.cookies.set(COOKIE_NAME, sign({ email: session.email, iat: Date.now() }), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE_SECONDS,
  });
}

export function clearAdminSessionCookie(res: NextResponse) {
  res.cookies.set(COOKIE_NAME, "", { path: "/", maxAge: 0 });
}
