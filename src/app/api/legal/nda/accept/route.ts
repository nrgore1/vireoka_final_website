import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { getSessionUser } from "@/lib/auth/session";
import { CURRENT_NDA_VERSION } from "@/lib/nda";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST() {
  try {
    const user = await getSessionUser();
    if (!user?.email) {
      return NextResponse.json({ ok: false, message: "Not authenticated" }, { status: 401 });
    }

    const email = user.email.toLowerCase();
    const supabase = supabaseAdmin();

    // ✅ must be APPROVED to proceed with NDA
    const lead = await supabase
      .from("investor_leads")
      .select("status")
      .eq("email", email)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    const status = lead.data?.status || "NEW";
    if (status !== "APPROVED") {
      return NextResponse.json(
        {
          ok: false,
          code: "NOT_APPROVED",
          message:
            status === "REVOKED"
              ? "Your access was revoked. If you believe this is a mistake, please contact info@vireoka.com."
              : "Your request is pending approval. Please wait for confirmation.",
          status,
        },
        { status: 403 }
      );
    }

    // Record NDA acceptance (cookie-based NDA agent should set cookie; DB record is optional here)
    // If you also store NDA acceptance in DB, do it here.
    await supabase
      .from("investor_leads")
      .update({
        nda_version_accepted: CURRENT_NDA_VERSION,
        nda_accepted_at: new Date().toISOString(),
      })
      .eq("email", email);

    return NextResponse.json({ ok: true, ndaVersion: CURRENT_NDA_VERSION });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, code: "SERVER_ERROR", message: "Something went wrong. Please try again.", detail: e?.message || null },
      { status: 500 }
    );
  }
}
