import { cookies } from "next/headers";

export const investorCookieName = "vireoka_investor";

export type InvestorSess = {
  email: string;
  token: string;
};

export async function createInvestorSession(email: string, token: string) {
  const cookieStore = await cookies();
  const value = JSON.stringify({ email, token } satisfies InvestorSess);

  cookieStore.set({
    name: investorCookieName,
    value,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });
}

export async function verifyInvestorSession(): Promise<InvestorSess | null> {
  const cookieStore = await cookies();
  const c = cookieStore.get(investorCookieName);
  if (!c) return null;

  try {
    const parsed = JSON.parse(c.value) as InvestorSess;
    if (!parsed?.email || !parsed?.token) return null;
    return parsed;
  } catch {
    return null;
  }
}

export async function clearInvestorSession() {
  const cookieStore = await cookies();
  cookieStore.delete(investorCookieName);
}
