export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { listAuditLog } from "@/lib/investorStore";
import { requireAdmin } from "@/lib/supabase/requireAdmin";
import { rateLimitOrThrow } from "@/lib/rateLimit";

export async function GET(req: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 🔒 Rate limit (throws on violation)
  rateLimitOrThrow(req, {
    max: 120,
    windowMs: 60_000,
  });

  const rows = await listAuditLog();
  return NextResponse.json({ ok: true, rows });
}
