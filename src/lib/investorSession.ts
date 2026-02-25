import { cookies } from "next/headers";

export const investorCookieName = "vireoka_investor_session";
const COOKIE = investorCookieName;

/**
 * Existing helpers (keep these stable)
 */
export async function clearInvestorSession() {
  const c = await cookies();
  c.set(COOKIE, "", { httpOnly: true, sameSite: "lax", path: "/", maxAge: 0 });
}

export async function setInvestorSession(payload: { email: string }) {
  const c = await cookies();
  c.set(COOKIE, payload.email.toLowerCase(), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function getInvestorEmail(): Promise<string | null> {
  const c = await cookies();
  return c.get(COOKIE)?.value || null;
}

/**
 * Session getter used across routes
 */
export async function getInvestorSession(): Promise<
  | { ok: true; email: string }
  | { ok: false; error: "not_authenticated" }
> {
  const email = await getInvestorEmail();
  if (!email) return { ok: false, error: "not_authenticated" };
  return { ok: true, email };
}

/**
 * ✅ Compatibility: older code imports createInvestorSession() with either:
 *   - (payload: { email })
 *   - (email: string, token?: string)
 * Token is ignored here because session is stored as httpOnly cookie (email only).
 */
export async function createInvestorSession(
  payloadOrEmail: { email: string } | string,
  _token?: string
): Promise<{ ok: true; email: string }> {
  const email =
    typeof payloadOrEmail === "string" ? payloadOrEmail : payloadOrEmail.email;

  await setInvestorSession({ email });
  return { ok: true, email: email.toLowerCase() };
}

/**
 * ✅ Compatibility: older code imports verifyInvestorSession()
 */
export async function verifyInvestorSession(): Promise<{ email: string }> {
  const session = await getInvestorSession();

  if (!session.ok) {
    throw new Error("Unauthorized: missing investor session");
  }

  return { email: session.email };
}
