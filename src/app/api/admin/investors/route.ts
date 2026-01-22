import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/adminGuard";
import { rateLimitOrThrow } from "@/lib/rateLimit";
import {
  listInvestors,
  approveInvestor,
  revokeInvestor,
} from "@/lib/investorStore";

const ApproveSchema = z.object({
  email: z.string().email(),
});

export async function GET(req: Request) {
  // Auth
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Rate limit
  rateLimitOrThrow(req, {
    max: 120,
    windowMs: 60_000,
  });

  const data = await listInvestors();
  return NextResponse.json({ data });
}

export async function POST(req: Request) {
  // Auth
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Rate limit
  rateLimitOrThrow(req, {
    max: 60,
    windowMs: 60_000,
  });

  const body = await req.json();
  const parsed = ApproveSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  await approveInvestor(parsed.data.email);
  return NextResponse.json({ ok: true });
}
