import { NextResponse } from "next/server";
import { requireAdminFromBearer } from "@/lib/auth/requireAdminFromBearer";
import { createClient } from "@supabase/supabase-js";
import { sendNdaInviteEmail } from "@/lib/email/investorEmailService";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const admin = await requireAdminFromBearer(req);
    if (!admin) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });

    const body = await req.json().catch(() => ({}));
    const email = String(body?.email || "").trim();
    const ndaUrl = String(body?.ndaUrl || "").trim();
    const leadId = String(body?.leadId || "").trim(); // optional but recommended

    if (!email || !ndaUrl) {
      return NextResponse.json({ ok: false, error: "Missing email or ndaUrl" }, { status: 400 });
    }

    const result = await sendNdaInviteEmail({ to: email, ndaUrl });

    // best-effort audit write
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (supabaseUrl && serviceKey && leadId) {
      const supabase = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false } });
      const patch: any = {};
      if (result.ok) patch.nda_email_sent_at = new Date().toISOString();
      else patch.nda_email_error = result.error;
      await supabase.from("investor_leads").update(patch).eq("id", leadId);
    }

    if (!result.ok) {
      return NextResponse.json({ ok: false, error: "Email failed", detail: result.error }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: String(err?.message || err) }, { status: 500 });
  }
}
