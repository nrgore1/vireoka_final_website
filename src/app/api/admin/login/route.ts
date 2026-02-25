import { NextResponse } from "next/server";
import { z } from "zod";
import { createAdminSessionCookie } from "@/lib/adminSession";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const Body = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function POST(req: Request) {
  try {
    const { email, password } = Body.parse(await req.json());

    const expectedEmail = (process.env.ADMIN_EMAIL || "").trim().toLowerCase();
    const expectedPass = (process.env.INVESTOR_ADMIN_PASSWORD || "").trim();

    if (!expectedEmail || !expectedPass) {
      return NextResponse.json(
        { ok: false, error: "Admin is not configured (missing env vars)" },
        { status: 500 }
      );
    }

    if (email.trim().toLowerCase() !== expectedEmail || password !== expectedPass) {
      return NextResponse.json({ ok: false, error: "Invalid credentials" }, { status: 401 });
    }

    const res = NextResponse.json({ ok: true }, { status: 200 });
    createAdminSessionCookie(res, { email: expectedEmail });
    return res;
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: "Bad request", detail: String(e?.message || e) },
      { status: 400 }
    );
  }
}
