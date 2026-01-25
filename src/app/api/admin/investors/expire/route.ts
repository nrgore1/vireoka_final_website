import { NextResponse } from "next/server";
import { requireCron } from "@/lib/cronGuard";
import { rateLimitOrThrow } from "@/lib/rateLimit";
import { expireExpiredInvestors } from "@/lib/investorTtl";

export async function POST() {
  // Cron auth already validated
  rateLimitOrThrow("cron_expire_investors", 10, 60_000);

  await expireExpiredInvestors();
  return NextResponse.json({ ok: true });
}
