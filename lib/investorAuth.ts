import crypto from "crypto";
import { prisma } from "./db";
import { cookies } from "next/headers";

const COOKIE_NAME = "vireoka_investor_token";

export function randomToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

export async function setInvestorCookie(token: string) {
  const jar = await cookies();
  jar.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // cookie lifetime; real access is expiresAt in DB
  });
}

export async function clearInvestorCookie() {
  const jar = await cookies();
  jar.set(COOKIE_NAME, "", { httpOnly: true, path: "/", maxAge: 0 });
}

export async function getInvestorFromCookie() {
  const jar = await cookies();
  const token = jar.get(COOKIE_NAME)?.value;
  if (!token) return null;

  const app = await prisma.investorApplication.findFirst({
    where: { accessToken: token },
  });

  if (!app) return null;

  // Enforce expiry + revoked
  const now = new Date();
  if (app.status === "REVOKED") return null;
  if (app.expiresAt && app.expiresAt <= now) return null;
  if (app.status !== "APPROVED") return null;

  return app;
}
