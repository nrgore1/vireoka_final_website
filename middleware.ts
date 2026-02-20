import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;

  // Only protect admin pages
  if (!pathname.startsWith("/admin")) return NextResponse.next();
  if (pathname === "/admin/login" || pathname.startsWith("/admin/login/")) return NextResponse.next();
  if (pathname === "/admin/logout" || pathname.startsWith("/admin/logout/")) return NextResponse.next();

  const hasSession =
    !!req.cookies.get("sb-access-token") ||
    !!req.cookies.get("supabase-auth-token") ||
    [...req.cookies.getAll()].some((c) => c.name.includes("sb-") && c.name.includes("-auth-token"));

  if (!hasSession) {
    const url = req.nextUrl.clone();
    url.pathname = "/admin/login";
    url.searchParams.set("next", pathname + (search || ""));
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
