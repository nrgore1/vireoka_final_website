export const runtime = "nodejs";

import { NextResponse } from "next/server";
import {
  listInvestors,
  approveInvestor,
  revokeInvestor,
} from "@/lib/investorStore";
import { requireAdmin } from "@/lib/supabase/requireAdmin";
import { rateLimitOrThrow } from "@/lib/rateLimit";

export async function GET(req: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  rateLimitOrThrow(req, { max: 120, windowMs: 60_000 });

  const rows = await listInvestors();
  return NextResponse.json({ ok: true, rows });
}

export async function POST(req: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  rateLimitOrThrow(req, { max: 30, windowMs: 60_000 });

  const { action, email } = await req.json();

  if (action === "approve") {
    await approveInvestor(email);
  } else if (action === "revoke") {
    await revokeInvestor(email);
  }

  return NextResponse.json({ ok: true });
}
