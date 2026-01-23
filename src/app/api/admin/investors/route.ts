import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/adminGuard";
import { rateLimitOrThrow } from "@/lib/rateLimit";
import {
  listInvestors,
  approveInvestor,
  revokeInvestor,
} from "@/lib/investorStore";

export async function GET(req: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  rateLimitOrThrow(req, { max: 120, windowMs: 60_000 });

  const rows = await listInvestors();
  return NextResponse.json({ rows });
}

const Schema = z.object({
  action: z.enum(["approve", "revoke"]),
  email: z.string().email(),
});

export async function POST(req: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  rateLimitOrThrow(req, { max: 60, windowMs: 60_000 });

  const parsed = Schema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  if (parsed.data.action === "approve") {
    await approveInvestor(parsed.data.email);
  } else {
    await revokeInvestor(parsed.data.email);
  }

  return NextResponse.json({ ok: true });
}
