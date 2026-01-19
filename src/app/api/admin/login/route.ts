import { NextResponse } from "next/server";
import { z } from "zod";
import { signAdminSession, adminCookieName } from "@/lib/adminSession";
import { rateLimitOrThrow } from "@/lib/rateLimit";

const Schema = z.object({
  password: z.string().min(1),
});

export async function POST(req: Request) {
  // Rate limit
  const ip =
    req.headers.get("x-forwarded-for") ??
    req.headers.get("x-real-ip") ??
    "local";

  rateLimitOrThrow(`admin:login:${ip}`, 20, 60_000);

  const body = await req.json().catch(() => null);
  const parsed = Schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "Invalid request" },
      { status: 400 }
    );
  }

  // Phase-1 admin password check (env-based)
  if (parsed.data.password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json(
      { ok: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  // Issue session (no args)
  const token = await signAdminSession();

  const res = NextResponse.json({ ok: true });
  res.cookies.set(adminCookieName(), token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  });

  return res;
}
