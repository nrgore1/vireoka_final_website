import { NextRequest, NextResponse } from "next/server";
import { investorCookieName, verifyInvestorSession } from "./lib/investorSession";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Protect investor portal pages
  if (pathname.startsWith("/investors/portal")) {
    const token = req.cookies.get(investorCookieName())?.value;
    if (!token) {
      const url = req.nextUrl.clone();
      url.pathname = "/investors/status";
      return NextResponse.redirect(url);
    }
    const sess = await verifyInvestorSession(token);
    if (!sess) {
      const url = req.nextUrl.clone();
      url.pathname = "/investors/status";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/investors/portal/:path*"],
};
