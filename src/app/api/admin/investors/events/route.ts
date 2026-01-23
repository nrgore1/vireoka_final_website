export const runtime = "nodejs";

import { NextResponse } from "next/server";
<<<<<<< HEAD
import { requireAdmin } from "@/lib/supabase/requireAdmin";
=======
import { requireAdmin } from "@/lib/adminGuard";
>>>>>>> rebuild-forward
import { rateLimitOrThrow } from "@/lib/rateLimit";
import { listInvestorEvents } from "@/lib/investorEvents";

export async function GET(req: Request) {
<<<<<<< HEAD
=======
  // Auth
>>>>>>> rebuild-forward
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

<<<<<<< HEAD
  // 🔒 Rate limit (throws automatically)
=======
  // Rate limit
>>>>>>> rebuild-forward
  rateLimitOrThrow(req, {
    max: 120,
    windowMs: 60_000,
  });

<<<<<<< HEAD
  const rows = await listInvestorEvents();
  return NextResponse.json({ ok: true, rows });
=======
  const data = await listInvestorEvents();
  return NextResponse.json({ data });
>>>>>>> rebuild-forward
}
