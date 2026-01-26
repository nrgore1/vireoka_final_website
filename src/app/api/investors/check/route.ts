import { NextResponse } from "next/server";
import { getInvestorByEmail } from "@/lib/investors/service";

export async function POST(req: Request) {
  const { email } = await req.json();
  if (!email) {
    return NextResponse.json({ eligible: false });
  }

  const investor = await getInvestorByEmail(email);

  return NextResponse.json({
    eligible: Boolean(investor && investor.status === "approved"),
  });
}
