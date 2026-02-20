import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Only protect admin pages (not login, not logout, not API export endpoints)
  if (!pathname.startsWith("/admin")) return NextResponse.next();
  if (pathname.startsWith("/admin/login")) return NextResponse.next();
  if (pathname.startsWith("/admin/logout")) return NextResponse.next();

  // If there's no supabase session cookie, send to login quickly.
  // Cookie names vary; check common patterns.
  const hasSession =
    req.cookies.get("sb-access-token") ||
    req.cookies.get("supabase-auth-token") ||
    // Newer @supabase/ssr typically uses a project ref prefix like: sb-<ref>-auth-token
    [...req.cookies.getAll()].some((c) => c.name.includes("sb-") && c.name.includes("-auth-token"));

  if (!hasSession) {
    const url = req.nextUrl.clone();
    url.pathname = "/admin/login";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
