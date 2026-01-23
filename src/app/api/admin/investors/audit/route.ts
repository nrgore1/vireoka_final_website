export const runtime = "nodejs";

import { NextResponse } from "next/server";
<<<<<<< HEAD
import { listAuditLog } from "@/lib/investorStore";
import { requireAdmin } from "@/lib/supabase/requireAdmin";
=======
import { requireAdmin } from "@/lib/adminGuard";
>>>>>>> rebuild-forward
import { rateLimitOrThrow } from "@/lib/rateLimit";
import { listAuditLog } from "@/lib/investorStore";

export async function GET(req: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

<<<<<<< HEAD
  // 🔒 Rate limit (throws on violation)
=======
>>>>>>> rebuild-forward
  rateLimitOrThrow(req, {
    max: 120,
    windowMs: 60_000,
  });

  const data = await listAuditLog();
  return NextResponse.json({ data });
}
