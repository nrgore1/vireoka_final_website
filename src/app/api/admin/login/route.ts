export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { z } from "zod";
import { createAdminSessionCookie } from "@/lib/adminSession";

const Schema = z.object({
  email: z.string().email(),
  password: z.string().min(3),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = Schema.parse(body);

    const expectedEmail = (process.env.ADMIN_EMAIL || "").trim().toLowerCase();
    const expectedPass = process.env.INVESTOR_ADMIN_PASSWORD || "";

    if (!expectedEmail || !expectedPass) {
      return NextResponse.json(
        { ok: false, error: "Admin is not configured (missing ADMIN_EMAIL or INVESTOR_ADMIN_PASSWORD)." },
        { status: 500 }
      );
    }

    if (email.trim().toLowerCase() !== expectedEmail || password !== expectedPass) {
      return NextResponse.json({ ok: false, error: "Invalid email or password." }, { status: 401 });
    }

    const res = NextResponse.json({ ok: true }, { status: 200 });
    createAdminSessionCookie(res, { email: expectedEmail });
    return res;
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || "Bad request" }, { status: 400 });
  }
}
