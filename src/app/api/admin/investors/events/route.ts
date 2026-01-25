import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminGuard";
import { rateLimitOrThrow } from "@/lib/rateLimit";
import { listInvestorEvents } from "@/lib/investorStore";

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // FIX: correct rate limiter signature
  rateLimitOrThrow("admin_investor_events", 120, 60_000);

  const data = await listInvestorEvents();
  return NextResponse.json({ data });
}
