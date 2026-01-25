import { NextRequest, NextResponse } from "next/server";

/**
 * Next.js 16+ uses "proxy.ts" instead of "middleware.ts".
 * The exported function MUST be named `proxy`.
 */
export function proxy(_req: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
