import { SignJWT, jwtVerify } from "jose";

const COOKIE_NAME = "vireoka_investor";
const ALG = "HS256";

function secretKey() {
  const raw = process.env.INVESTOR_SESSION_SECRET;
  if (!raw) throw new Error("INVESTOR_SESSION_SECRET not set");
  return new TextEncoder().encode(raw);
}

export function investorCookieName() {
  return COOKIE_NAME;
}

export async function signInvestorSession(payload: { email: string }) {
  const jwt = await new SignJWT({ email: payload.email })
    .setProtectedHeader({ alg: ALG })
    .setIssuedAt()
    .setExpirationTime("14d")
    .sign(secretKey());
  return jwt;
}

export async function verifyInvestorSession(token: string): Promise<{ email: string } | null> {
  try {
    const { payload } = await jwtVerify(token, secretKey());
    const email = typeof payload.email === "string" ? payload.email : null;
    return email ? { email } : null;
  } catch {
    return null;
  }
}
