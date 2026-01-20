import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyInvestorSession } from "@/lib/investorSession";
import { getInvestorByEmail } from "@/lib/investorStore";
import { expireIfNeeded } from "@/lib/investorExpiry";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("vireoka_investor_token")?.value;

  if (!token) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const email = await verifyInvestorSession(token);

  // ✅ CRITICAL TYPE GUARD
  if (typeof email !== "string") {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  let investor = await getInvestorByEmail(email);
  investor = await expireIfNeeded(investor);

  return NextResponse.json({ ok: true, investor });
}
