import { NextResponse } from "next/server";
import { z } from "zod";
import { expireIfNeeded, getInvestorByEmail } from "@/lib/investorStore";

const Schema = z.object({ email: z.string().email() });

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = Schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ ok: false }, { status: 400 });

  const rec0 = getInvestorByEmail(parsed.data.email);
  if (!rec0) return NextResponse.json({ ok: true, exists: false });

  const rec = expireIfNeeded(parsed.data.email);
  return NextResponse.json({
    ok: true,
    exists: true,
    investor: {
      email: rec.email,
      status: rec.status,
      ndaAcceptedAt: rec.ndaAcceptedAt,
      approvedAt: rec.approvedAt,
      expiresAt: rec.expiresAt,
    },
  });
}
