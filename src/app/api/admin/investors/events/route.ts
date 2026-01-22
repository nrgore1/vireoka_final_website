export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/supabase/requireAdmin";
import { rateLimitOrThrow } from "@/lib/rateLimit";
import { listInvestorEvents } from "@/lib/investorEvents";

export async function GET(req: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 🔒 Rate limit (throws automatically)
  rateLimitOrThrow(req, {
    max: 120,
    windowMs: 60_000,
  });

  const rows = await listInvestorEvents();
  return NextResponse.json({ ok: true, rows });
}
