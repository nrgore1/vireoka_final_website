import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { randomUUID } from "crypto";
import {
  sendInvestorRequestConfirmation,
  sendInternalNewLeadNotification,
} from "@/lib/email/investorEmailService";

export const runtime = "nodejs";

function getIp(req: Request) {
  const xf = req.headers.get("x-forwarded-for");
  if (xf) return xf.split(",")[0].trim();
  return req.headers.get("x-real-ip") || null;
}

function isMissingColumnError(errMsg: string) {
  const msg = (errMsg || "").toLowerCase();
  return msg.includes("schema cache") || msg.includes("could not find the");
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));

    const fullName = String(body.fullName || "").trim();
    const email = String(body.email || "").trim();
    const company = String(body.company || "").trim() || null;
    const message = String(body.message || "").trim() || null;

    if (!fullName || !email) {
      return NextResponse.json({ ok: false, error: "Missing name or email" }, { status: 400 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!supabaseUrl || !serviceKey) {
      return NextResponse.json({ ok: false, error: "Server misconfigured" }, { status: 500 });
    }

    const supabase = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false } });

    const id = randomUUID();
    const referenceCode = randomUUID();
    const ip = getIp(req);
    const userAgent = req.headers.get("user-agent") || null;

    const baseRow: any = {
      id,
      kind: "REQUEST_ACCESS",
      status: "NEW",
      full_name: fullName,
      email,
      company,
      message,
      ip,
      user_agent: userAgent,
    };

    const extendedRow: any = {
      ...baseRow,
      reference_code: referenceCode,
      environment: process.env.NODE_ENV === "production" ? "production" : "development",
    };

    let { error } = await supabase.from("investor_leads").insert(extendedRow);
    if (error && isMissingColumnError(error.message)) {
      ({ error } = await supabase.from("investor_leads").insert(baseRow));
    }
    if (error) {
      return NextResponse.json({ ok: false, error: "Insert failed", detail: error.message }, { status: 500 });
    }

    // Email fanout (do not fail lead capture if email fails)
    const [investorRes, internalRes] = await Promise.all([
      sendInvestorRequestConfirmation({
        to: email,
        fullName,
        kind: "REQUEST_ACCESS",
        referenceCode,
      }),
      sendInternalNewLeadNotification({
        fullName,
        email,
        company,
        message,
        kind: "REQUEST_ACCESS",
        referenceCode,
      }),
    ]);

    // Best-effort DB audit updates (ignore failures)
    const updatePatch: any = {};
    if (investorRes.ok) updatePatch.investor_confirm_email_sent_at = new Date().toISOString();
    else updatePatch.investor_confirm_email_error = investorRes.error;

    if (internalRes.ok) updatePatch.internal_notify_email_sent_at = new Date().toISOString();
    else updatePatch.internal_notify_email_error = internalRes.error;

    if (Object.keys(updatePatch).length) {
      await supabase.from("investor_leads").update(updatePatch).eq("id", id);
    }

    return NextResponse.json({
      ok: true,
      id,
      referenceCode,
      fanout: {
        investorEmail: investorRes,
        internalEmail: internalRes,
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: "Server error", detail: String(err?.message || err) },
      { status: 500 }
    );
  }
}
