import { NextResponse } from "next/server";
import { listInvestors, approveInvestor, revokeInvestor } from "@/lib/investorStore";
import { requireAdmin } from "@/lib/adminGuard";
import { rateLimitOrThrow } from "@/lib/rateLimit";

export async function GET(req: Request) {
  requireAdmin(req);

  const limited = rateLimitOrThrow(req, {
    max: 120,
    windowMs: 60_000,
  });
  if (limited) return limited;

  const rows = await listInvestors();
  return NextResponse.json({ ok: true, investors: rows });
}
