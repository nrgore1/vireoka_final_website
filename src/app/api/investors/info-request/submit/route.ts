import { NextRequest, NextResponse } from "next/server";
import { getServiceSupabase } from "@/lib/supabase/serverClients";
import { verifyInfoRequestToken } from "@/lib/security/inviteJwt";

function clampStr(v: any, max = 4000) {
  const s = String(v ?? "").trim();
  return s.length > max ? s.slice(0, max) : s;
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const token = String(body?.token || "").trim();

  if (!token) return NextResponse.json({ ok: false, error: "Missing token" }, { status: 400 });

  try {
    const { application_id, email } = await verifyInfoRequestToken(token);
    const svc = getServiceSupabase();

    const fields = body?.fields && typeof body.fields === "object" ? body.fields : {};
    const message = clampStr(body?.message, 8000);

    const cleaned = {
      role: clampStr(fields.role, 300),
      firm: clampStr(fields.firm, 300),
      website: clampStr(fields.website, 500),
      accreditation: clampStr(fields.accreditation, 500),
    };

    const { data: app, error: appErr } = await svc
      .from("investor_applications")
      .select("id,email,status,metadata")
      .eq("id", application_id)
      .maybeSingle();

    if (appErr) return NextResponse.json({ ok: false, error: appErr.message }, { status: 500 });
    if (!app) return NextResponse.json({ ok: false, error: "Application not found" }, { status: 404 });

    if (String(app.email).toLowerCase() !== email) {
      return NextResponse.json({ ok: false, error: "Token does not match application" }, { status: 403 });
    }

    const md: any = app.metadata || {};
    const responses = Array.isArray(md.info_responses) ? md.info_responses : [];

    const nowIso = new Date().toISOString();
    responses.push({
      submitted_at: nowIso,
      email,
      fields: cleaned,
      message,
    });

    const nextMeta = {
      ...md,
      info_responses: responses,
      last_info_response_at: nowIso,
      last_info_response_email: email,
    };

    // Move back to review queue (so admin sees it as needing action again)
    const nextStatus = "submitted";

    const { error: updErr } = await svc
      .from("investor_applications")
      .update({ metadata: nextMeta, status: nextStatus, updated_at: nowIso })
      .eq("id", application_id);

    if (updErr) return NextResponse.json({ ok: false, error: updErr.message }, { status: 500 });

    // Audit log (performed_by nullable)
    try {
      await svc.from("investor_application_audit_logs").insert({
        application_id,
        action: "info_response_received",
        performed_by: null,
        metadata: {
          email,
          fields: cleaned,
          message: message ? message.slice(0, 2000) : "",
        },
      });
    } catch {}

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    const msg = String(e?.message || e);
    return NextResponse.json(
      { ok: false, error: msg.includes("exp") ? "This link has expired" : "Invalid link" },
      { status: 401 }
    );
  }
}
