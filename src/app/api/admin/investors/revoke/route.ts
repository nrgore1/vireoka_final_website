import { NextResponse } from "next/server";
import { z } from "zod";
import { revokeInvestor } from "@/lib/investorStore";
import { requireAdmin } from "@/lib/adminGuard";
import { rateLimitOrThrow } from "@/lib/rateLimit";

const Schema = z.object({
  email: z.string().email(),
  reason: z.string().optional(),
});

export async function POST(req: Request) {
  requireAdmin(req);

  const limited = rateLimitOrThrow(req, {
    max: 60,
    windowMs: 60_000,
  });
  if (limited) return limited;

  const body = await req.json();
  const parsed = Schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "Invalid payload" },
      { status: 400 }
    );
  }

  const investor = await revokeInvestor(parsed.data.email);
  return NextResponse.json({ ok: true, investor });
}
