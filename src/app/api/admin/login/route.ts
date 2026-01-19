import { NextResponse } from "next/server";
import { z } from "zod";
import { adminCookieName, signAdminSession } from "@/lib/adminSession";
import { rateLimitOrThrow } from "@/lib/rateLimit";

const Schema = z.object({ password: z.string().min(1) });

export async function POST(req: Request) {
  const limited = rateLimitOrThrow(req, { keyPrefix: "admin:login", max: 20, windowMs: 60_000 });
  if (limited) return limited;

  const body = await req.json().catch(() => null);
  const parsed = Schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const expected = process.env.ADMIN_LOGIN_PASSWORD;
  if (!expected || parsed.data.password !== expected) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const token = signAdminSession();
  const res = NextResponse.json({ ok: true });

  res.cookies.set(adminCookieName(), token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: process.env.NODE_ENV === "production",
  });

  return res;
}
