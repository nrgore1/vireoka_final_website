import crypto from "crypto";
import { cookies } from "next/headers";

const COOKIE_NAME = "vireoka_admin_session";

function b64url(input: Buffer) {
  return input.toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function b64urlDecode(input: string) {
  input = input.replace(/-/g, "+").replace(/_/g, "/");
  const pad = input.length % 4;
  if (pad) input += "=".repeat(4 - pad);
  return Buffer.from(input, "base64");
}

function sign(payload: object, secret: string) {
  const body = b64url(Buffer.from(JSON.stringify(payload)));
  const sig = crypto.createHmac("sha256", secret).update(body).digest();
  return `${body}.${b64url(sig)}`;
}

function verify(token: string, secret: string): any | null {
  const [body, sig] = token.split(".");
  if (!body || !sig) return null;
  const expected = crypto.createHmac("sha256", secret).update(body).digest();
  const given = b64urlDecode(sig);
  if (given.length !== expected.length) return null;
  if (!crypto.timingSafeEqual(given, expected)) return null;
  try {
    return JSON.parse(Buffer.from(b64urlDecode(body)).toString("utf8"));
  } catch {
    return null;
  }
}

export async function setAdminSession(email: string) {
  const secret = process.env.ADMIN_SESSION_SECRET || "";
  if (!secret) throw new Error("ADMIN_SESSION_SECRET is missing");

  const token = sign(
    {
      email,
      iat: Date.now(),
    },
    secret
  );

  const jar = await cookies();
  jar.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 12, // 12h
  });
}

export async function clearAdminSession() {
  const jar = await cookies();
  jar.set(COOKIE_NAME, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
}

export async function getAdminSession(): Promise<{ ok: true; email: string } | { ok: false }> {
  const secret = process.env.ADMIN_SESSION_SECRET || "";
  if (!secret) return { ok: false };

  const jar = await cookies();
  const token = jar.get(COOKIE_NAME)?.value;
  if (!token) return { ok: false };

  const payload = verify(token, secret);
  if (!payload?.email) return { ok: false };

  return { ok: true, email: String(payload.email) };
}
