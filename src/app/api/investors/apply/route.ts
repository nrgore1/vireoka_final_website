import { NextResponse } from "next/server";
import { z } from "zod";
import { createOrGetInvestor } from "@/lib/investorStore";

const ApplySchema = z.object({
  email: z.string().email(),
  name: z.string().min(1),
  org: z.string().min(1),
  role: z.string().min(1),
  intent: z.string().min(1),
});

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = ApplySchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: parsed.error.flatten() },
      { status: 400 }
    );
  }

  // ✅ THIS IS THE FIX
  const rec = await createOrGetInvestor(parsed.data);

  return NextResponse.json({
    ok: true,
    investor: {
      email: rec.email,
      status: rec.status,
    },
  });
}
