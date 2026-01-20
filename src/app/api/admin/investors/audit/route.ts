import { NextResponse } from "next/server";
import { listAuditLog } from "@/lib/investorStore";
import { requireAdmin } from "@/lib/adminGuard";
import { rateLimitOrThrow } from "@/lib/rateLimit";

export async function GET(req: Request) {
  requireAdmin(req);

  const limited = rateLimitOrThrow(req, {
    max: 120,
    windowMs: 60_000,
  });
  if (limited) return limited;

  const rows = await listAuditLog();
  return NextResponse.json({ ok: true, rows });
}
