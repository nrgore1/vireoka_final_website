import { NextResponse } from "next/server";
import { z } from "zod";
import { getInvestorByEmail } from "@/lib/investorStore";
import { expireIfNeeded } from "@/lib/investorExpiry";

const Schema = z.object({
  email: z.string().email(),
});

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = Schema.safeParse(body);
  if (!parsed.success)
    return NextResponse.json({ ok: false }, { status: 400 });

  const investor = await getInvestorByEmail(parsed.data.email);
  if (!investor)
    return NextResponse.json({ ok: true, exists: false });

  const finalInvestor = await expireIfNeeded(investor);
  return NextResponse.json({
    ok: true,
    exists: true,
    investor: finalInvestor,
  });
}
