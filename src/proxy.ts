import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

/**
 * Proxy entrypoint (replaces middleware.ts in Next 16+)
 * Currently a no-op pass-through.
 */
export default function proxy(req: NextRequest) {
  return NextResponse.next();
}
