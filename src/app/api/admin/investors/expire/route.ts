import { NextResponse } from "next/server";
import { rateLimitOrThrow } from "@/lib/rateLimit";
import { expireExpiredInvestors } from "@/lib/investorTtl";
import { requireCron } from "@/lib/cronGuard";

export async function POST(req: Request) {
  try {
    requireCron(req);
  } catch {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const ip =
    req.headers.get("x-forwarded-for") ??
    req.headers.get("x-real-ip") ??
    "local";

  rateLimitOrThrow(`cron:expire:${ip}`, 60, 60_000);

  const result = await expireExpiredInvestors();
  return NextResponse.json({ ok: true, ...result });
}
