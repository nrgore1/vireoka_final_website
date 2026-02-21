import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { fanoutInvestorLead } from "@/lib/investors/fanout";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } }
);

function normalizeEmail(email: unknown) {
  return String(email || "").trim().toLowerCase();
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const investor_name = String(body.investor_name || "").trim();
    const email = normalizeEmail(body.email);
    const organization = String(body.organization || "").trim();
    const role = String(body.role || "").trim();
    const investor_type = String(body.investor_type || "").trim();

    if (!investor_name || !email || !organization) {
      return NextResponse.json(
        { ok: false, error: "investor_name, email, and organization are required." },
        { status: 400 }
      );
    }

    // NOTE: best if you have UNIQUE(email) on investor_applications to prevent duplicates.
    const { data, error } = await supabase
      .from("investor_applications")
      .upsert(
        {
          investor_name,
          email,
          organization,
          status: "submitted",
          metadata: {
            role: role || null,
            investor_type: investor_type || null,
          },
        },
        { onConflict: "email" }
      )
      .select("id,reference_code")
      .single();

    if (error) {
      console.error("[investor-applications] supabase error:", error);
      return NextResponse.json({ ok: false, error: error.message }, { status: 400 });
    }

    // Audit (best-effort)
    await supabase.from("investor_application_audit_logs").insert({
      application_id: data.id,
      action: "submitted",
      performed_by: null,
      metadata: { via: "public_api" },
    });

    // Fanout (internal email + Airtable + HubSpot) — best-effort; never fail the applicant
    try {
      await fanoutInvestorLead({
        kind: "application",
        investor_name,
        full_name: investor_name,
        email,
        organization,
        company: organization,
        role,
        investor_type,
        reference_code: data.reference_code,
      });
    } catch (e) {
      console.error("[investor-applications] fanout error:", e);
    }

    return NextResponse.json({ ok: true, reference_code: data.reference_code });
  } catch (err: any) {
    console.error("[investor-applications] api error:", err);
    return NextResponse.json({ ok: false, error: "Server error" }, { status: 500 });
  }
}
