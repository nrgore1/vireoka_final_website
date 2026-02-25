import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { getInvestorSession } from "@/lib/investorSession";
import { markNdaAccepted } from "@/agents/investor/investorManagerAgent";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST() {
  try {
    // 1️⃣ Require authenticated investor session
    const session = await getInvestorSession();
    if (!session?.email) {
      return NextResponse.json(
        { ok: false, error: "Not authenticated" },
        { status: 401 }
      );
    }

    const email = session.email.toLowerCase().trim();

    const supabase = supabaseAdmin();

    // 2️⃣ Fetch most recent investor_lead for this email
    const { data, error } = await supabase
      .from("investor_leads")
      .select("status")
      .eq("email", email)
      .order("created_at", { ascending: false })
      .limit(1);

    if (error) {
      return NextResponse.json(
        { ok: false, error: "Unable to verify approval status" },
        { status: 500 }
      );
    }

    const status = (data?.[0]?.status || "").toUpperCase();

    // 3️⃣ Enforce approval
    if (status !== "APPROVED") {
      return NextResponse.json(
        {
          ok: false,
          error:
            status === "REVOKED"
              ? "Access has been revoked."
              : "Access not approved yet.",
        },
        { status: 403 }
      );
    }

    // 4️⃣ Mark NDA accepted in your agent logic
    await markNdaAccepted(email);

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e?.message || "Server error" },
      { status: 500 }
    );
  }
}
