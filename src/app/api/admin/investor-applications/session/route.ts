import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";
import { getServiceSupabase } from "@/lib/supabase/serverClients";
import { generateToken, sha256 } from "@/lib/security/tokens";
import { signInfoRequestToken } from "@/lib/security/inviteJwt";
import { sendApprovalEmail } from "@/lib/email/sendApprovalEmail";
import { sendRequestInfoEmail } from "@/lib/email/sendRequestInfoEmail";
import { createNdaFromTemplate } from "@/lib/nda/signwell";

const TTL_HOURS = Number(process.env.NDA_LINK_TTL_HOURS || 72);

async function requireAdminSession() {
  const sb = await supabaseServer();
  const { data: auth } = await sb.auth.getUser();
  if (!auth?.user) return { ok: false as const, status: 401, error: "Unauthorized" };

  const { data: profile } = await sb.from("profiles").select("role").eq("id", auth.user.id).single();
  if (!profile || profile.role !== "admin") return { ok: false as const, status: 403, error: "Forbidden" };

  return { ok: true as const, userId: auth.user.id };
}

function originFromReq(req: NextRequest) {
  const proto = req.headers.get("x-forwarded-proto") || "http";
  const host = req.headers.get("x-forwarded-host") || req.headers.get("host") || "localhost:3000";
  return `${proto}://${host}`;
}

async function upsertInvestorFlexible(args: {
  svc: ReturnType<typeof getServiceSupabase>;
  email: string;
  name: string | null;
  org: string | null;
  expiresAt: string;
}) {
  const { svc, email, name, org, expiresAt } = args;

  const base = {
    email,
    status: "approved",
    approved_at: new Date().toISOString(),
    expires_at: expiresAt,
  };

  const candidates: any[] = [
    { ...base, full_name: name, organization: org },
    { ...base, name, organization: org },
    { ...base, name, org },
    { ...base, full_name: name, company: org },
    { ...base },
  ];

  let lastErr: any = null;
  for (const payload of candidates) {
    const { error } = await svc.from("investors").upsert(payload, { onConflict: "email" });
    if (!error) return { ok: true as const };
    lastErr = error;
    const msg = String(error.message || "");
    const schemaErr = msg.includes("schema cache") || msg.includes("column") || msg.includes("does not exist");
    if (!schemaErr) break;
  }
  return { ok: false as const, error: lastErr?.message || "Investor upsert failed" };
}

export async function GET(req: NextRequest) {
  const admin = await requireAdminSession();
  if (!admin.ok) return NextResponse.json({ ok: false, error: admin.error }, { status: admin.status });

  const q = (req.nextUrl.searchParams.get("q") || "").trim();
  const status = (req.nextUrl.searchParams.get("status") || "submitted").trim();

  const svc = getServiceSupabase();

  let query = svc
    .from("investor_applications")
    .select("id,email,investor_name,organization,status,reference_code,created_at,updated_at,user_id,metadata")
    .order("created_at", { ascending: false })
    .limit(300);

  if (status && status !== "all") query = query.eq("status", status);
  if (q) query = query.or(`investor_name.ilike.%${q}%,email.ilike.%${q}%,organization.ilike.%${q}%`);

  const { data, error } = await query;
  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true, applications: data ?? [] });
}

export async function POST(req: NextRequest) {
  const admin = await requireAdminSession();
  if (!admin.ok) return NextResponse.json({ ok: false, error: admin.error }, { status: admin.status });

  const body = await req.json().catch(() => null);
  const id = body?.id as string | undefined;
  const action = body?.action as string | undefined;
  const message = body?.message != null ? String(body.message) : "";

  if (!id || !["approve", "reject", "request_info", "resend_nda"].includes(String(action))) {
    return NextResponse.json({ ok: false, error: "Invalid payload" }, { status: 400 });
  }

  const svc = getServiceSupabase();

  const { data: app, error: appErr } = await svc
    .from("investor_applications")
    .select("id,email,investor_name,organization,status,user_id,metadata,created_at")
    .eq("id", id)
    .single();

  if (appErr || !app) return NextResponse.json({ ok: false, error: appErr?.message || "Not found" }, { status: 404 });

  async function audit(act: string, metadata: any = {}) {
    try {
      await svc.from("investor_application_audit_logs").insert({
        application_id: id,
        action: act,
        performed_by: admin.userId,
        metadata,
      });
    } catch {}
  }

  const email = String(app.email).toLowerCase();
  const origin = process.env.APP_ORIGIN || originFromReq(req);

  if (action === "reject") {
    await svc.from("investor_applications").update({ status: "rejected" }).eq("id", id);
    await audit("rejected");
    return NextResponse.json({ ok: true });
  }

  if (action === "request_info") {
    const nowIso = new Date().toISOString();

    const md: any = app.metadata || {};
    const info_requests = Array.isArray(md.info_requests) ? md.info_requests : [];
    info_requests.push({
      requested_at: nowIso,
      requested_by: admin.userId,
      message: message ? String(message).slice(0, 8000) : "",
    });

    await svc
      .from("investor_applications")
      .update({ status: "info_requested", metadata: { ...md, info_requests }, updated_at: nowIso })
      .eq("id", id);

    await audit("info_requested", { message: message ? String(message).slice(0, 4000) : "" });

    const jwt = await signInfoRequestToken(
      { purpose: "info_request", application_id: id, email },
      "7d"
    );

    const respondUrl = `${origin}/investors/respond?token=${encodeURIComponent(jwt)}`;
    const statusUrl = `${origin}/investors/status`;

    await sendRequestInfoEmail({
      email,
      name: app.investor_name ?? null,
      message,
      respondUrl,
      statusUrl,
      reviewSlaHours: 24,
    });

    await audit("info_request_email_sent", { requested_at: nowIso });

    return NextResponse.json({ ok: true });
  }

  if (action === "approve") {
    await svc.from("investor_applications").update({ status: "approved" }).eq("id", id);
    await audit("approved");
  }

  const { data: priorNda } = await svc
    .from("investor_application_audit_logs")
    .select("id,created_at")
    .eq("application_id", id)
    .in("action", ["nda_link_sent", "nda_signwell_sent"])
    .order("created_at", { ascending: false })
    .limit(1);

  const alreadySent = Boolean(priorNda && priorNda.length > 0);
  if (alreadySent && action !== "resend_nda") {
    return NextResponse.json({ ok: true, note: "NDA already sent; skipped resend." });
  }

  const expiresAt = new Date(Date.now() + TTL_HOURS * 60 * 60 * 1000).toISOString();

  const up = await upsertInvestorFlexible({
    svc,
    email,
    name: app.investor_name ?? null,
    org: app.organization ?? null,
    expiresAt,
  });

  if (!up.ok) {
    await audit("investor_upsert_failed", { error: up.error });
    return NextResponse.json({ ok: false, error: up.error }, { status: 500 });
  }

  const signwellKey = process.env.SIGNWELL_API_KEY || "";
  const templateId = process.env.SIGNWELL_TEMPLATE_ID || "";

  if (signwellKey && templateId) {
    try {
      const doc = await createNdaFromTemplate({
        templateId,
        signerEmail: email,
        signerName: app.investor_name || email,
        redirectUrl: `${origin}/investors/nda-signed`,
        metadata: { application_id: id, email },
      });

      await audit("nda_signwell_sent", { document_id: doc.id });
      return NextResponse.json({ ok: true, nda: "signwell", document_id: doc.id });
    } catch (e: any) {
      await audit("nda_signwell_failed", { error: String(e?.message || e) });
    }
  }

  const rawToken = generateToken(32);
  const tokenHash = sha256(rawToken);

  const { error: ndaErr } = await svc.from("investor_nda_links").insert({
    application_id: id,
    token_hash: tokenHash,
    expires_at: expiresAt,
  });

  if (ndaErr) return NextResponse.json({ ok: false, error: ndaErr.message }, { status: 500 });

  const ndaUrl = `${origin}/investors/nda?token=${encodeURIComponent(rawToken)}`;
  await sendApprovalEmail({ email, ndaUrl, expiresHours: TTL_HOURS, name: app.investor_name ?? null });

  await audit("nda_link_sent", { expires_at: expiresAt });

  return NextResponse.json({ ok: true, nda: "internal" });
}
