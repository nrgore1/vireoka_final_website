import "server-only";

import { cookies } from "next/headers";
import { getInvestorByEmail, touchInvestor } from "./service";

export const investorCookieName = "vireoka_investor";

export async function getInvestorEmailFromCookie() {
  const store = await cookies();
  const v = store.get(investorCookieName)?.value;
  return v || null;
}

export async function requireApprovedInvestor(): Promise<{ ok: true; email: string } | { ok: false }> {
  const email = await getInvestorEmailFromCookie();
  if (!email) return { ok: false };

  const inv = await getInvestorByEmail(email);
  if (!inv || inv.status !== "approved") return { ok: false };

  await touchInvestor(email);
  return { ok: true, email };
}
