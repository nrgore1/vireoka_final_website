import "server-only";
import crypto from "crypto";

export const adminCookieName = "vireoka_admin";

function mustGet(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env var: ${name}`);
  return v;
}

function b64url(buf: Buffer) {
  return buf
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

function sign(payload: string, secret: string) {
  const mac = crypto.createHmac("sha256", secret).update(payload).digest();
  return b64url(mac);
}

export async function signAdminSession(email: string): Promise<string> {
  const secret = mustGet("ADMIN_SESSION_SECRET");
  const now = Date.now();
  const expMs = Number(process.env.ADMIN_SESSION_TTL_MS || 7 * 24 * 60 * 60 * 1000);

  const payloadObj = { email, iat: now, exp: now + expMs };
  const payload = b64url(Buffer.from(JSON.stringify(payloadObj)));
  const sig = sign(payload, secret);

  return `${payload}.${sig}`;
}

export async function verifyAdminSession(token: string | null): Promise<{ email: string } | null> {
  if (!token) return null;
  const secret = mustGet("ADMIN_SESSION_SECRET");

  const parts = token.split(".");
  if (parts.length !== 2) return null;

  const [payload, sig] = parts;
  const expected = sign(payload, secret);
  if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return null;

  let obj: any = null;
  try {
    obj = JSON.parse(Buffer.from(payload.replace(/-/g, "+").replace(/_/g, "/"), "base64").toString("utf8"));
  } catch {
    return null;
  }

  if (!obj?.email || !obj?.exp) return null;
  if (Date.now() > Number(obj.exp)) return null;

  return { email: String(obj.email) };
}
