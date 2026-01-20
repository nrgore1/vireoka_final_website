import { NextResponse } from "next/server";
import { z } from "zod";
import { signAdminSession, adminCookieName } from "@/lib/adminSession";
import { rateLimitOrThrow } from "@/lib/rateLimit";

const Schema = z.object({
  password: z.string().min(1),
});

export async function POST(req: Request) {
  // ✅ Correct usage: pass Request, not a string key
  rateLimitOrThrow(req, {
    max: 20,
    windowMs: 60_000,
  });

  const body = await req.json().catch(() => null);
  const parsed = Schema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "Invalid request" },
      { status: 400 }
    );
  }

  const token = await signAdminSession(parsed.data.password);
  if (!token) {
    return NextResponse.json(
      { ok: false, error: "Unauthorized" },
      { status: 401 }
    );
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
