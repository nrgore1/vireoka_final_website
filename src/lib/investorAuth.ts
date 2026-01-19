import crypto from "crypto";
import { prisma } from "./db";
import { cookies } from "next/headers";

const COOKIE_NAME = "vireoka_investor_token";

/**
 * App Router cookies() is async in Next 15+/16
 */
export async function getInvestorToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(COOKIE_NAME)?.value ?? null;
}

/**
 * While Prisma is disabled, this function safely no-ops.
 */
export async function getInvestorFromToken(token?: string) {
  if (!token) return null;

  // Prisma intentionally disabled
  if (!prisma) {
    return null;
  }

  // Future Prisma implementation:
  // return prisma.investorApplication.findFirst({
  //   where: { accessToken: token },
  // });

  return null;
}

export function signInvestorToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

export async function setInvestorCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  });
}

export async function clearInvestorCookie() {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, "", {
    maxAge: 0,
    path: "/",
  });
}
