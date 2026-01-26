import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

/**
 * Global proxy (formerly middleware).
 * This is a no-op pass-through proxy.
 * Required by Next.js when proxy.ts exists.
 */
export function proxy(req: NextRequest) {
  return NextResponse.next();
}
