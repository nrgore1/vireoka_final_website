import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { investorCookieName, verifyInvestorSession } from "@/lib/investorSession";
import { expireIfNeeded } from "@/lib/investorStore";

export async function GET() {
  const token = cookies().get(investorCookieName())?.value;
  if (!token) return NextResponse.json({ ok: false, error: "no_session" }, { status: 401 });

  const sess = await verifyInvestorSession(token);
  if (!sess) return NextResponse.json({ ok: false, error: "bad_session" }, { status: 401 });

  const rec = expireIfNeeded(sess.email);

  return NextResponse.json({
    ok: true,
    investor: {
      email: rec.email,
      status: rec.status,
      expiresAt: rec.expiresAt,
    },
  });
}
