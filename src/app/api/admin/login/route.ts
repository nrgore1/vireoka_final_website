import { NextResponse } from "next/server";
import { z } from "zod";
import { rateLimitOrThrow } from "@/lib/rateLimit";
import { signAdminSession, adminCookieName } from "@/lib/adminSession";

const Schema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function POST(req: Request) {
  rateLimitOrThrow(req, {
    max: 20,
    windowMs: 60_000,
  });

  const body = await req.json();
  const parsed = Schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const { email } = parsed.data;

  // 🔐 Create signed admin session bound to email
  const token = await signAdminSession(email);
  if (!token) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });

  res.cookies.set(adminCookieName, token, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/",
  });

  return res;
}
