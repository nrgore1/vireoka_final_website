import crypto from "crypto";

const COOKIE = "vireoka_admin_session";
const SECRET = process.env.ADMIN_SESSION_SECRET || "dev-admin-secret";
const TTL_MS = 7 * 24 * 60 * 60 * 1000;

export function adminCookieName() {
  return COOKIE;
}

export function signAdminSession(): string {
  const ts = Date.now().toString();
  const payload = `ts=${ts}`;
  const sig = crypto.createHmac("sha256", SECRET).update(payload).digest("hex");
  return `${payload}:${sig}`;
}

export function verifyAdminSession(token: string): boolean {
  try {
    const [payload, sig] = token.split(":");
    if (!payload || !sig) return false;

    const expected = crypto.createHmac("sha256", SECRET).update(payload).digest("hex");
    if (sig !== expected) return false;

    const m = /ts=(\d+)/.exec(payload);
    const ts = m ? Number(m[1]) : 0;
    if (!ts) return false;

    return Date.now() - ts < TTL_MS;
  } catch {
    return false;
  }
}
