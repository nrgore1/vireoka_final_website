import type { NextRequest } from "next/server";
<<<<<<< HEAD
import { updateSession } from "@/lib/supabase/proxy";

export async function proxy(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)",
  ],
};
=======
import { NextResponse } from "next/server";

/**
 * Proxy entrypoint (replaces middleware.ts in Next 16+)
 * Currently a no-op pass-through.
 */
export default function proxy(req: NextRequest) {
  return NextResponse.next();
}
>>>>>>> rebuild-forward
