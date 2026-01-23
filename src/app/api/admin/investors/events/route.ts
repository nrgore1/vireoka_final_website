import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminGuard";
import { rateLimitOrThrow } from "@/lib/rateLimit";
import { listInvestorEvents } from "@/lib/investorEvents";

export async function GET(req: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  rateLimitOrThrow(req, { max: 120, windowMs: 60_000 });

  const data = await listInvestorEvents();
  return NextResponse.json({ data });
}
