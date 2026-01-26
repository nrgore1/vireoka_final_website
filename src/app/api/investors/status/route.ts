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

  // ✅ Correct: resolve investor via session.email
  const investor = await getInvestorByEmail(session.email);
  if (!investor) {
    return NextResponse.json(
      { error: "Investor not found" },
      { status: 404 }
    );
  }

  // ❌ Not approved → no status visibility
  if (!investor.approved_at) {
    return NextResponse.json(
      { error: "NDA access not enabled" },
      { status: 403 }
    );
  }

  // ✅ Approved investor only
  return NextResponse.json({
    ok: true,
    investor: {
      id: investor.id,
      name: investor.full_name,
      nda_signed: Boolean(investor.nda_accepted_at),
    },
  });
}
