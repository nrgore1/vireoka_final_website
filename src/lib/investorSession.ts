import crypto from "crypto";

const COOKIE_NAME = "vireoka_investor_token";
const SECRET = process.env.INVESTOR_SESSION_SECRET || "dev-secret";

/**
 * Sign an investor session token.
 * MUST return the token string.
 */
export async function signInvestorSession(email: string): Promise<string> {
  const payload = `${email}:${Date.now()}`;
  const hmac = crypto.createHmac("sha256", SECRET).update(payload).digest("hex");
  return `${payload}:${hmac}`;
}

/**
 * Verify investor session token.
 */
export async function verifyInvestorSession(token: string): Promise<boolean> {
  try {
    const [email, ts, sig] = token.split(":");
    if (!email || !ts || !sig) return false;

    const payload = `${email}:${ts}`;
    const expected = crypto
      .createHmac("sha256", SECRET)
      .update(payload)
      .digest("hex");

    return crypto.timingSafeEqual(
      Buffer.from(sig),
      Buffer.from(expected)
    );
  } catch {
    return false;
  }
}

export function investorCookieName() {
  return COOKIE_NAME;
}
