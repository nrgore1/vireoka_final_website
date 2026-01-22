import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminGuard";
import { rateLimitOrThrow } from "@/lib/rateLimit";
import { listAuditLog } from "@/lib/investorStore";

export async function GET(req: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  rateLimitOrThrow(req, {
    max: 120,
    windowMs: 60_000,
  });

  const data = await listAuditLog();
  return NextResponse.json({ data });
}
