import { NextResponse } from "next/server";
import { z } from "zod";
import { revokeInvestor, audit } from "@/lib/investorStore";
import { requireAdmin } from "@/lib/adminGuard";
import { rateLimitOrThrow } from "@/lib/rateLimit";

const Schema = z.object({
  email: z.string().email(),
  reason: z.string().optional(),
});

export async function POST(req: Request) {
  requireAdmin(req);

  const ip =
    req.headers.get("x-forwarded-for") ??
    req.headers.get("x-real-ip") ??
    "local";

  rateLimitOrThrow(`admin:revoke:${ip}`, 60, 60_000);

  const body = await req.json();
  const parsed = Schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: parsed.error.flatten() },
      { status: 400 }
    );
  }

  // Phase-1: revoke uses email only
  const rec = await revokeInvestor(parsed.data.email);

  // Audit keeps the reason (important)
  await audit(parsed.data.email, "REVOKE", {
    reason: parsed.data.reason ?? "ADMIN_REVOKE",
  });

  return NextResponse.json({ ok: true, investor: rec });
}
