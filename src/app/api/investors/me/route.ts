import { NextResponse } from "next/server";
import { verifyInvestorSession } from "@/lib/investorSession";
import { getInvestorByEmail } from "@/lib/investorStore";

export async function GET() {
  const session = await verifyInvestorSession();
  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const investor = await getInvestorByEmail(session.email);
  if (!investor) {
    return NextResponse.json({ error: "Investor not found" }, { status: 404 });
  }

  const approved = Boolean((investor as any).approved_at) && !Boolean((investor as any).revoked_at) && !Boolean((investor as any).rejected_at);

  return NextResponse.json({
    email: session.email,
    name: (investor as any).full_name || null,
    role: (investor as any).role || "investor",
    firm: (investor as any).firm || null,
    approved,
  });
}
