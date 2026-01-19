import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Investor portal is gated by a short-lived session cookie.
// Full validation (status + expiry) happens server-side in /api/investors/me.
const protectedPrefixes = ["/investors/portal"];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (!protectedPrefixes.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  // We only check for cookie presence in middleware.
  // Full validation happens server-side in the demo page itself.
  const token = req.cookies.get("vireoka_investor")?.value;

  if (!token) {
    const url = req.nextUrl.clone();
    url.pathname = "/investors";
    url.searchParams.set("reason", "login_required");
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/investors/:path*"],
};
