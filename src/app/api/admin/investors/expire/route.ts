export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { expireExpiredInvestors } from "@/lib/investorTtl";
import { requireCron } from "@/lib/cronGuard";
import { rateLimitOrThrow } from "@/lib/rateLimit";

export async function POST(req: Request) {
  requireCron(req);
  rateLimitOrThrow(req, { max: 10, windowMs: 60_000 });

  await expireExpiredInvestors();
  return NextResponse.json({ ok: true });
}
