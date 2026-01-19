import { NextResponse } from "next/server";
import { listAuditLog } from "@/lib/investorStore";
import { requireAdmin } from "@/lib/adminGuard";
import { rateLimitOrThrow } from "@/lib/rateLimit";

export async function GET(req: Request) {
  // Defense-in-depth: auth + rate limit in route too
  const ok = await requireAdmin(req);
  if (!ok) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });

  const limited = rateLimitOrThrow(req, { keyPrefix: "admin:audit", max: 120, windowMs: 60_000 });
  if (limited) return limited;

  const rows = await listAuditLog();
  return NextResponse.json({ ok: true, audit: rows });
}
