import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { investorCookieName, verifyInvestorSession } from "@/lib/investorSession";

export async function investorMiddleware(req: NextRequest) {
  const token = req.cookies.get(investorCookieName())?.value;
  if (!token) {
    return NextResponse.redirect(new URL("/investors/status", req.url));
  }

  const ok = await verifyInvestorSession(token);
  if (!ok) {
    const res = NextResponse.redirect(new URL("/investors/status", req.url));
    res.cookies.delete(investorCookieName());
    return res;
  }

  return NextResponse.next();
}
