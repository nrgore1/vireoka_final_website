import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { sendInvestorApprovalEmail } from "@/lib/email/investorEmailService";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));

    const leadId = String(body?.leadId || "").trim(); // recommended
    const email = String(body?.email || "").trim();
    const token = String(body?.token || "").trim();

    if (!email || !token) {
      return NextResponse.json({ ok: false, error: "Missing email or token" }, { status: 400 });
    }

    const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");
    const verifyUrl = `${baseUrl}/investors/verify?token=${encodeURIComponent(token)}`;

    const emailRes = await sendInvestorApprovalEmail({ to: email, verifyUrl });

    // Best-effort DB audit/status update
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (supabaseUrl && serviceKey && leadId) {
      const supabase = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false } });
      const patch: any = {
        status: "QUALIFIED",
      };
      if (emailRes.ok) patch.approval_email_sent_at = new Date().toISOString();
      else patch.approval_email_error = emailRes.error;
      await supabase.from("investor_leads").update(patch).eq("id", leadId);
    }

    if (!emailRes.ok) {
      return NextResponse.json({ ok: false, error: "Approval email failed", detail: emailRes.error }, { status: 500 });
    }

    return NextResponse.json({ ok: true, verifyUrl });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: String(err?.message || err) }, { status: 500 });
  }
}
