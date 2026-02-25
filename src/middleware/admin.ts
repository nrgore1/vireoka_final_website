import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { requireAdmin } from "@/lib/adminAuth";

export async function adminMiddleware(req: NextRequest) {
  // Example: Authorization: Bearer <token>
  const auth = req.headers.get("authorization") || "";
  const token = auth.startsWith("Bearer ") ? auth.slice("Bearer ".length).trim() : "";

  if (!token) {
    return NextResponse.json(
      { ok: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  // ✅ requireAdmin expects a Request/NextRequest, not a raw token string
  const ok = await requireAdmin(req);
  if (!ok) {
    return NextResponse.json(
      { ok: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  return NextResponse.next();
}
