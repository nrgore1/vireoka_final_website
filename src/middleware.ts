import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { investorMiddleware } from "./middleware/investor";
import { adminMiddleware } from "./middleware/admin";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Investor-only pages
  if (pathname.startsWith("/investors/portal")) {
    return investorMiddleware(req);
  }

  // Admin APIs
  if (pathname.startsWith("/api/admin")) {
    return adminMiddleware(req);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/investors/:path*", "/api/admin/:path*"],
};
