import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";
import { getServiceSupabase } from "@/lib/supabase/serverClients";

async function requireAdminSession() {
  const sb = await supabaseServer();
  const { data: auth } = await sb.auth.getUser();
  if (!auth?.user) return { ok: false as const, status: 401, error: "Unauthorized" };

  const { data: profile } = await sb.from("profiles").select("role").eq("id", auth.user.id).single();
  if (!profile || profile.role !== "admin") return { ok: false as const, status: 403, error: "Forbidden" };

  return { ok: true as const };
}

function daysBetween(now: Date, future: Date) {
  const ms = future.getTime() - now.getTime();
  return Math.ceil(ms / (1000 * 60 * 60 * 24));
}

function latestFromArray(arr: any[]) {
  if (!Array.isArray(arr) || arr.length === 0) return null;
  return arr[arr.length - 1];
}

export async function GET(req: NextRequest) {
  const admin = await requireAdminSession();
  if (!admin.ok) return NextResponse.json({ ok: false, error: admin.error }, { status: admin.status });

  const svc = getServiceSupabase();

  const status = (req.nextUrl.searchParams.get("status") || "all").trim();
  const q = (req.nextUrl.searchParams.get("q") || "").trim();

  let appsQ = svc
    .from("investor_applications")
    .select("id,email,investor_name,organization,status,reference_code,created_at,updated_at,metadata")
    .order("created_at", { ascending: false })
    .limit(500);

  if (status !== "all") appsQ = appsQ.eq("status", status);
  if (q) appsQ = appsQ.or(`investor_name.ilike.%${q}%,email.ilike.%${q}%,organization.ilike.%${q}%`);

  const { data: apps, error: appsErr } = await appsQ;
  if (appsErr) return NextResponse.json({ ok: false, error: appsErr.message }, { status: 500 });

  const emails = Array.from(new Set((apps ?? []).map((a) => String(a.email).toLowerCase())));
  const appIds = (apps ?? []).map((a) => a.id);

  const { data: investors, error: invErr } = await svc
    .from("investors")
    .select("email,status,approved_at,expires_at,access_expires_at,invited_at,invite_expires_at,nda_signed,nda_signed_at,nda_accepted_at,last_access")
    .in("email", emails);

  if (invErr) return NextResponse.json({ ok: false, error: invErr.message }, { status: 500 });

  const investorsByEmail = new Map((investors ?? []).map((i) => [String(i.email).toLowerCase(), i]));

  const { data: logs, error: logErr } = await svc
    .from("investor_application_audit_logs")
    .select("application_id,action,created_at,metadata")
    .in("application_id", appIds)
    .in("action", ["nda_link_sent", "nda_signwell_sent", "info_response_received"])
    .order("created_at", { ascending: false })
    .limit(8000);

  if (logErr) return NextResponse.json({ ok: false, error: logErr.message }, { status: 500 });

  const latestNdaSentAtByApp = new Map<string, string>();
  const latestInfoResponseAtByApp = new Map<string, string>();

  for (const l of logs ?? []) {
    if ((l.action === "nda_link_sent" || l.action === "nda_signwell_sent") && !latestNdaSentAtByApp.has(l.application_id)) {
      latestNdaSentAtByApp.set(l.application_id, l.created_at);
    }
    if (l.action === "info_response_received" && !latestInfoResponseAtByApp.has(l.application_id)) {
      latestInfoResponseAtByApp.set(l.application_id, l.created_at);
    }
  }

  const { data: sigs, error: sigErr } = await svc
    .from("investor_nda_signatures")
    .select("application_id,signed_at")
    .in("application_id", appIds)
    .order("signed_at", { ascending: false })
    .limit(5000);

  if (sigErr) return NextResponse.json({ ok: false, error: sigErr.message }, { status: 500 });

  const signedAtByApp = new Map<string, string>();
  for (const s of sigs ?? []) {
    if (!signedAtByApp.has(s.application_id)) signedAtByApp.set(s.application_id, s.signed_at);
  }

  const { data: reqs, error: reqErr } = await svc
    .from("investor_access_extension_requests")
    .select("id,email,requested_until,reason,status,created_at,reviewed_at,admin_note")
    .in("email", emails)
    .order("created_at", { ascending: false })
    .limit(2000);

  if (reqErr) return NextResponse.json({ ok: false, error: reqErr.message }, { status: 500 });

  const latestPendingExtByEmail = new Map<string, any>();
  for (const r of reqs ?? []) {
    const em = String(r.email).toLowerCase();
    if (r.status === "pending" && !latestPendingExtByEmail.has(em)) latestPendingExtByEmail.set(em, r);
  }

  const now = new Date();

  const rows = (apps ?? []).map((app) => {
    const email = String(app.email).toLowerCase();
    const inv = investorsByEmail.get(email);

    const ndaSentAt = latestNdaSentAtByApp.get(app.id) || null;
    const signedAt = signedAtByApp.get(app.id) || inv?.nda_signed_at || inv?.nda_accepted_at || null;

    const accessExpiry = inv?.access_expires_at || inv?.expires_at || null;
    const daysOutstanding = accessExpiry ? daysBetween(now, new Date(accessExpiry)) : null;

    const accessApproved = Boolean(inv && (inv.status === "approved" || inv.approved_at));
    const ndaSigned = Boolean(inv?.nda_signed || signedAt);

    const pendingExt = latestPendingExtByEmail.get(email) || null;

    const md: any = app.metadata || {};
    const latestReq = latestFromArray(md.info_requests || []);
    const latestResp = latestFromArray(md.info_responses || []);

    return {
      application_id: app.id,
      reference_code: app.reference_code,
      email,
      investor_name: app.investor_name,
      organization: app.organization,
      application_status: app.status,
      application_created_at: app.created_at,

      nda_email_sent_at: ndaSentAt,

      access_approved: accessApproved,
      access_expires_at: accessExpiry,
      days_outstanding: daysOutstanding,

      nda_signed: ndaSigned,
      nda_signed_at: signedAt,

      invited_at: inv?.invited_at ?? null,
      last_access: inv?.last_access ?? null,

      pending_extension_request: pendingExt,

      latest_info_request_message: latestReq?.message ?? null,
      latest_info_request_at: latestReq?.requested_at ?? null,

      latest_info_response_at: latestInfoResponseAtByApp.get(app.id) || latestResp?.submitted_at || null,
      latest_info_response_message: latestResp?.message ?? null,
      latest_info_response_fields: latestResp?.fields ?? null,
    };
  });

  return NextResponse.json({ ok: true, rows });
}
