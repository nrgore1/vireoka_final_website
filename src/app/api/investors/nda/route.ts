import { NextResponse } from "next/server";
import { z } from "zod";
import { acceptNda } from "@/lib/investorStore";
import {
  signInvestorSession,
  investorCookieName,
} from "@/lib/investorSession";

const Schema = z.object({
  email: z.string().email(),
});

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = Schema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const rec = await acceptNda(parsed.data.email);

  // ✅ FIX: pass string, not object
  const token = await signInvestorSession(rec.email);

  const res = NextResponse.json({
    ok: true,
    investor: {
      email: rec.email,
      status: rec.status,
    },
  });

  res.cookies.set(investorCookieName(), token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  });

  return res;
}
