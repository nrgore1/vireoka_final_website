import { NextResponse } from "next/server";
import { z } from "zod";
import { createOrGetInvestor } from "@/lib/investorStore";

const Schema = z.object({
  email: z.string().email(),
  name: z.string().min(2),
  org: z.string().min(2),
  role: z.string().min(2),
  intent: z.string().min(10),
});

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = Schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: parsed.error.flatten() },
      { status: 400 }
    );
  }

  /**
   * createOrGetInvestor MUST:
   * - upsert by email
   * - preserve APPROVED / NDA_SIGNED state if present
   * - never downgrade status
   */
  const rec = createOrGetInvestor(parsed.data);

  return NextResponse.json({
    ok: true,
    investor: {
      email: rec.email,
      status: rec.status,
    },
  });
}
