import { NextResponse } from "next/server";
import { z } from "zod";
import { acceptNda } from "@/lib/investorStore";
import { signInvestorSession, investorCookieName } from "@/lib/investorSession";

const Schema = z.object({
  email: z.string().email(),
  ndaAccepted: z.literal(true),
});

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = Schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: parsed.error.flatten() }, { status: 400 });
  }

  const rec = acceptNda(parsed.data.email);

  // Create a session cookie so user can check status easily.
  const token = await signInvestorSession({ email: rec.email });

  const res = NextResponse.json({ ok: true, investor: { email: rec.email, status: rec.status } });
  res.cookies.set(investorCookieName(), token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });
  return res;
}
