import { NextResponse } from "next/server";
import { z } from "zod";
import {
  getInvestorByEmail,
  expireIfNeeded,
} from "@/lib/investorStore";

const Schema = z.object({
  email: z.string().email(),
});

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = Schema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const investor = await getInvestorByEmail(parsed.data.email);
  if (!investor) {
    return NextResponse.json({ ok: true, exists: false });
  }

  const finalInvestor = await expireIfNeeded(investor);

  return NextResponse.json({
    ok: true,
    exists: true,
    investor: finalInvestor,
  });
}
