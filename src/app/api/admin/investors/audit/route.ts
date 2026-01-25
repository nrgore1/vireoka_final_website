import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminGuard";
import { rateLimitOrThrow } from "@/lib/rateLimit";
import { listAuditLog } from "@/lib/investorStore";

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // FIX: use correct rateLimitOrThrow signature
  rateLimitOrThrow("admin_audit_log", 120, 60_000);

  const rows = await listAuditLog();
  return NextResponse.json({ rows });
}
