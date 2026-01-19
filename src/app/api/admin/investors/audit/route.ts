import { NextResponse } from "next/server";
import { listAuditLog } from "@/lib/investorStore";
import { requireAdmin } from "@/lib/adminGuard";
import { rateLimitOrThrow } from "@/lib/rateLimit";

export async function GET(req: Request) {
  // Auth
  requireAdmin(req);

  // Rate limit (Phase-1: simple key-based)
  const ip =
    req.headers.get("x-forwarded-for") ??
    req.headers.get("x-real-ip") ??
    "local";

  const key = `admin:audit:${ip}`;
  rateLimitOrThrow(key, 120, 60_000);

  // Fetch audit log
  const rows = await listAuditLog();

  return NextResponse.json({
    ok: true,
    rows,
  });
}
