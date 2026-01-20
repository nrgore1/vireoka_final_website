import { NextResponse } from "next/server";
import { expireExpiredInvestors } from "@/lib/investorTtl";
import { requireCron } from "@/lib/cronGuard";
import { rateLimitOrThrow } from "@/lib/rateLimit";

export async function POST(req: Request) {
  requireCron(req);

  const limited = rateLimitOrThrow(req, {
    max: 60,
    windowMs: 60_000,
  });
  if (limited) return limited;

  const result = await expireExpiredInvestors();
  return NextResponse.json({ ok: true, ...result });
}
