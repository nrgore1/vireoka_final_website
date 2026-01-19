import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  investorCookieName,
  verifyInvestorSession,
} from "@/lib/investorSession";
import {
  getInvestorByEmail,
  expireIfNeeded,
} from "@/lib/investorStore";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get(investorCookieName())?.value;

  if (!token) {
    return NextResponse.json({ ok: false });
  }

  const valid = await verifyInvestorSession(token);
  if (!valid) {
    return NextResponse.json({ ok: false });
  }

  // Extract email from token: email:timestamp:hmac
  const email = token.split(":")[0];
  if (!email) {
    return NextResponse.json({ ok: false });
  }

  const investor = await getInvestorByEmail(email);
  if (!investor) {
    return NextResponse.json({ ok: false });
  }

  const finalInvestor = await expireIfNeeded(investor);

  return NextResponse.json({
    ok: true,
    investor: finalInvestor,
  });
}
