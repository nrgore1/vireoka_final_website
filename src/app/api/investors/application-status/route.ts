import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } }
);

function normalizeCode(v: string | null) {
  return String(v || "").trim();
}

function computeNextStep(appStatus?: string | null, investor?: any | null) {
  const a = (appStatus || "").toLowerCase();
  const isApprovedInvestor =
    Boolean(investor?.approved_at) || (String(investor?.status || "").toLowerCase() === "approved");

  if (a === "rejected") return "Your application was not approved. If you believe this is an error, please contact us.";
  if (isApprovedInvestor) {
    if (!investor?.nda_accepted_at) return "Approved. Next step: sign the NDA to unlock portal access.";
    return "Access granted. You can use the investor portal.";
  }
  if (a === "approved") return "Approved. Check your email for the NDA link and portal instructions.";
  if (a === "submitted") return "Submitted. We are reviewing your request.";
  if (!a) return "No application found for that reference code.";
  return "We are processing your request.";
}

export async function GET(req: NextRequest) {
  try {
    const code = normalizeCode(req.nextUrl.searchParams.get("code"));
    if (!code) {
      return NextResponse.json({ ok: false, error: "Provide ?code=" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("investor_applications")
      .select("id,email,investor_name,organization,status,reference_code,created_at,updated_at")
      .eq("reference_code", code)
      .order("created_at", { ascending: false })
      .limit(1);

    if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });

    const app = data?.[0] ?? null;
    if (!app) {
      return NextResponse.json({ ok: true, found: false, application: null, investor: null, next_step: "No application found for that reference code." });
    }

    const invRes = await supabase.from("investors").select("*").eq("email", String(app.email).toLowerCase()).limit(1);
    const investor = invRes.data?.[0] ?? null;

    return NextResponse.json({
      ok: true,
      found: true,
      application: {
        email: app.email,
        investor_name: app.investor_name,
        organization: app.organization,
        status: app.status,
        reference_code: app.reference_code,
        created_at: app.created_at,
        updated_at: app.updated_at,
      },
      investor: investor
        ? {
            email: investor.email,
            status: investor.status ?? null,
            approved_at: investor.approved_at ?? null,
            nda_accepted_at: investor.nda_accepted_at ?? null,
            expires_at: investor.expires_at ?? null,
          }
        : null,
      next_step: computeNextStep(app.status, investor),
    });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message ?? "Server error" }, { status: 500 });
  }
}
