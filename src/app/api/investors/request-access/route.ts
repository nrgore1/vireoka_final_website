import { NextResponse } from "next/server";
import { z } from "zod";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { randomUUID } from "crypto";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const Schema = z.object({
  fullName: z.string().min(2),
  email: z.string().email(),
  company: z.string().min(1),
  role: z.enum(["advisor", "angel", "crowd", "partner", "vc"]),
  message: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    const parsed = Schema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          ok: false,
          code: "INVALID_INPUT",
          message: "Please check your details and try again.",
          detail: parsed.error.issues.map((i) => i.message).join(" · "),
        },
        { status: 400 }
      );
    }

    const { fullName, email, company, role, message } = parsed.data;
    const em = email.trim().toLowerCase();

    const supabase = supabaseAdmin();

    // If an existing lead exists for this email, return it (avoid duplicates)
    const existing = await supabase
      .from("investor_leads")
      .select("id, reference_code, status, investor_type")
      .eq("email", em)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (existing.data?.id) {
      return NextResponse.json(
        {
          ok: true,
          id: existing.data.id,
          referenceCode: existing.data.reference_code,
          status: existing.data.status,
          role: existing.data.investor_type ?? role,
          message:
            "We already have a request on file for this email. If you need to update details, reply to the confirmation email or submit again with a different email.",
        },
        { status: 200 }
      );
    }

    const referenceCode = randomUUID();

    // IMPORTANT:
    // - kind must satisfy investor_leads_kind_check (typically APPLY/INVITE/etc.)
    // - investor_type stores your role (advisor/angel/crowd/partner/vc)
    const ins = await supabase
      .from("investor_leads")
      .insert({
        kind: "APPLY",
        full_name: fullName,
        email: em,
        company,
        investor_type: role,
        reference_code: referenceCode,
        status: "NEW",
        message: message || null,
      })
      .select("id, reference_code, status, investor_type")
      .single();

    if (ins.error) {
      return NextResponse.json(
        {
          ok: false,
          code: "LEAD_INSERT_FAILED",
          message:
            "We couldn’t save your request. Please try again, or contact us if this persists.",
          detail: String(ins.error.message || ins.error),
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        ok: true,
        id: ins.data.id,
        referenceCode: ins.data.reference_code,
        status: ins.data.status,
        role: ins.data.investor_type,
      },
      { status: 200 }
    );
  } catch (e: any) {
    return NextResponse.json(
      {
        ok: false,
        code: "SERVER_ERROR",
        message: "Something went wrong. Please try again.",
        detail: String(e?.message || e),
      },
      { status: 500 }
    );
  }
}
