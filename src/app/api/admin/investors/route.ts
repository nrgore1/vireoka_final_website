import { NextResponse } from "next/server";
import { listInvestors, approveInvestor, revokeInvestor } from "@/lib/investorStore";
import { requireAdmin } from "@/lib/adminGuard";
import { rateLimitOrThrow } from "@/lib/rateLimit";

export async function GET(req: Request) {
  requireAdmin(req);

  const key =
    "admin:" + (req.headers.get("x-forwarded-for") || "local");
  rateLimitOrThrow(key);

  const rows = await listInvestors();
  return NextResponse.json({ ok: true, investors: rows });
}

export async function POST(req: Request) {
  requireAdmin(req);

  const key =
    "admin:" + (req.headers.get("x-forwarded-for") || "local");
  rateLimitOrThrow(key);

  const body = await req.json();
  const rec = await approveInvestor(body.email, body.ttlDays);
  return NextResponse.json({ ok: true, investor: rec });
}

export async function DELETE(req: Request) {
  requireAdmin(req);

  const key =
    "admin:" + (req.headers.get("x-forwarded-for") || "local");
  rateLimitOrThrow(key);

  const body = await req.json();
  const rec = await revokeInvestor(body.email);
  return NextResponse.json({ ok: true, investor: rec });
}
