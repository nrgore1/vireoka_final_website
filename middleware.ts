import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (!pathname.startsWith("/portal")) return NextResponse.next();

  // allow Next static assets
  if (pathname.startsWith("/_next") || pathname.startsWith("/favicon")) {
    return NextResponse.next();
  }

  // call server access-check using current cookies
  const checkUrl = req.nextUrl.clone();
  checkUrl.pathname = "/api/portal/access-check";
  checkUrl.search = "";

  let res: Response;
  try {
    res = await fetch(checkUrl, {
      headers: {
        cookie: req.headers.get("cookie") || "",
      },
    });
  } catch {
    const dest = req.nextUrl.clone();
    dest.pathname = "/investors/status";
    return NextResponse.redirect(dest);
  }

  const data = await res.json().catch(() => null);

  // if not logged in -> send to investor entry
  if (!res.ok || !data?.ok) {
    const dest = req.nextUrl.clone();
    dest.pathname = "/investors";
    return NextResponse.redirect(dest);
  }

  // logged in but not allowed -> route to reason page
  if (!data.allowed) {
    const dest = req.nextUrl.clone();
    dest.pathname =
      data.reason === "expired" ? "/portal/expired" :
      data.reason === "nda_required" ? "/portal/pending?step=nda" :
      data.reason === "grant_required" ? "/portal/pending?step=activation" :
      "/investors/status";
    return NextResponse.redirect(dest);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/portal/:path*"],
};
