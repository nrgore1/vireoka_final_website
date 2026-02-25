export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { z } from "zod";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { requireAdminOrThrow } from "@/lib/adminGuard";
import { notifySlack } from "@/lib/slack/notify";
import { sendLeadApprovedEmail } from "@/lib/email/sendLeadApprovedEmail";

const Schema = z.object({
  id: z.string().uuid(),
  status: z.enum(["NEW", "APPROVED", "REVOKED"]),
});

export async function POST(req: Request) {
  try {
    await requireAdminOrThrow(req);

    const body = await req.json();
    const { id, status } = Schema.parse(body);

    const supabase = supabaseAdmin();

    // fetch current (for transitions + messaging)
    const before = await supabase
      .from("investor_leads")
      .select("id, full_name, email, company, investor_type, reference_code, status")
      .eq("id", id)
      .single();

    if (before.error || !before.data) {
      return NextResponse.json({ ok: false, error: before.error?.message || "Lead not found" }, { status: 404 });
    }

    const prevStatus = String(before.data.status || "NEW");
    const lead = before.data;

    const upd = await supabase
      .from("investor_leads")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select("id, status")
      .single();

    if (upd.error) return NextResponse.json({ ok: false, error: upd.error.message }, { status: 500 });

    // ✅ APPROVED transition side-effects (only on NEW/REVOKED -> APPROVED)
    const becameApproved = status === "APPROVED" && prevStatus !== "APPROVED";
    if (becameApproved) {
      // 1) Upsert into investors table so /api/investors/me can resolve role + approval
      //    (safe if your schema differs; remove fields you don't have)
      await supabase
        .from("investors")
        .upsert(
          {
            email: String(lead.email).toLowerCase(),
            full_name: lead.full_name || null,
            firm: lead.company || null,
            role: lead.investor_type || null,
            approved_at: new Date().toISOString(),
            rejected_at: null,
            revoked_at: null,
          } as any,
          { onConflict: "email" }
        );

      // 2) Slack notification (best effort)
      await notifySlack(
        `✅ Investor lead APPROVED\n• ${lead.full_name} (${lead.email})\n• role: ${lead.investor_type || "-"}\n• ref: ${lead.reference_code}`
      );

      // 3) Resend email (best effort)
      try {
        await sendLeadApprovedEmail({
          to: String(lead.email),
          name: lead.full_name || null,
          referenceCode: String(lead.reference_code || ""),
          role: lead.investor_type || null,
        });
      } catch {
        // ignore email failures here (admin can resend later)
      }
    }

    return NextResponse.json({ ok: true, id: upd.data.id, status: upd.data.status }, { status: 200 });
  } catch (e: any) {
    const msg = e?.message || "Invalid request";
    const status = e?.status || (msg.includes("uuid") || msg.includes("enum") ? 400 : 401);
    return NextResponse.json({ ok: false, error: msg }, { status });
  }
}
