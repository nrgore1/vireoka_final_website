import { NextResponse } from "next/server";
import { revokeInvestor } from "@/lib/investorStore";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body?.email) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const rec = await revokeInvestor(body.email, body.reason);
  return NextResponse.json({ ok: true, investor: rec });
}
