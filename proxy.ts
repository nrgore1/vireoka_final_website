import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// If you already have a config.matcher below, keep it.
// If not, you can add one later.
export async function proxy(req: NextRequest) {
  try {
    // ---- YOUR EXISTING MIDDLEWARE LOGIC GOES HERE ----
    // If you do auth checks for /intelligence, do them here.
    // Make sure you do NOT throw uncaught errors.

    return NextResponse.next();
  } catch (err) {
    // Fail closed: redirect to login instead of 500
    const url = req.nextUrl.clone();
    url.pathname = "/intelligence/login";
    url.searchParams.set("error", "middleware");
    return NextResponse.redirect(url);
  }
}

// Keep your existing matcher if you already have one.
// Example (ONLY if you need it):
// export const config = { matcher: ["/intelligence/:path*", "/portal/:path*", "/admin/:path*"] };
