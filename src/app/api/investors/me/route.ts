import { NextResponse } from "next/server";
import { verifyInvestorSession } from "@/lib/investorSession";
import { getInvestorByEmail } from "@/lib/investorStore";

export async function GET() {
  const session = await verifyInvestorSession();
  if (!session) {
    return NextResponse.json(
      { error: "Not authenticated" },
      { status: 401 }
    );
  }

  // ✅ Correct: resolve investor via email
  const investor = await getInvestorByEmail(session.email);
  if (!investor) {
    return NextResponse.json(
      { error: "Investor not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({
    id: investor.id,
    name: investor.full_name,
    approved: Boolean(investor.approved_at),
  });
}
