import { NextResponse } from "next/server";
import { verifyInvestorSession } from "@/lib/investorSession";
import {
  getInvestorByEmail,
  isExpired,
  needsNdaReaccept,
} from "@/lib/investorStore";

export async function GET() {
  const sess = await verifyInvestorSession();
  if (!sess) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const inv = await getInvestorByEmail(sess.email);
  if (!inv) {
    return NextResponse.json({ error: "Investor not found" }, { status: 404 });
  }

  return NextResponse.json({
    email: inv.email,
    approved: !!inv.approved_at,
    expired: isExpired(inv),
    needsNda: needsNdaReaccept(inv),
  });
}
