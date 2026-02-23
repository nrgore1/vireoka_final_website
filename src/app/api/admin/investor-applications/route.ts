import { NextResponse } from "next/server";
import { getServiceSupabase } from "@/lib/supabase/serverClients";
import { requireAdminFromBearer } from "@/lib/auth/requireAdminFromBearer";
import { generateToken, sha256 } from "@/lib/security/tokens";
import { sendApprovalEmail } from "@/lib/email/sendApprovalEmail";

const TTL_HOURS = Number(process.env.NDA_LINK_TTL_HOURS || 72);

function getOriginFromReq(req: Request) {
  const h = req.headers;
  const proto = h.get("x-forwarded-proto") || "http";
  const host = h.get("x-forwarded-host") || h.get("host") || "localhost:3000";
  return `${proto}://${host}`;
}

export async function POST(req: Request) {
  const admin = await requireAdminFromBearer(req);
  if (!admin.ok) {
    return NextResponse.json({ ok: false, error: admin.error }, { status: admin.status });
  }

  const body = await req.json().catch(() => null);
  const id = body?.id as string | undefined;
  const action = body?.action as string | undefined;

  if (!id || !["approved", "rejected"].includes(String(action))) {
    return NextResponse.json({ ok: false, error: "Invalid payload" }, { status: 400 });
  }

  const supabase = getServiceSupabase();

  // Fetch application details (include organization + metadata for promotion)
  const { data: app, error: appErr } = await supabase
    .from("investor_applications")
    .select("id,email,investor_name,organization,metadata,status,user_id,created_at")
    .eq("id", id)
    .single();

  if (appErr || !app) {
    return NextResponse.json({ ok: false, error: appErr?.message || "Application not found" }, { status: 404 });
  }

  // If already in the target state, treat as idempotent (no-op) and continue flow safely
  const alreadyStatus = String(app.status || "");
  const targetStatus = String(action);

  if (alreadyStatus !== targetStatus) {
    const { error: updErr } = await supabase
      .from("investor_applications")
      .update({ status: targetStatus })
      .eq("id", id);

    if (updErr) {
      return NextResponse.json({ ok: false, error: updErr.message }, { status: 500 });
    }
  }

  // Audit log (always)
  await supabase.from("investor_application_audit_logs").insert({
    application_id: id,
    action: targetStatus,
    performed_by: admin.userId,
    metadata: { via: "admin_api" },
  });

  // If rejected: done
  if (targetStatus === "rejected") {
    return NextResponse.json({ ok: true });
  }

  // ✅ APPROVED FLOW (idempotent + promotes to investors + sends NDA email once)

  // 0) If we've already sent an NDA link for this application, do NOT resend on repeated approvals.
  // This prevents email spam and token churn.
  const { data: priorNdaSent } = await supabase
    .from("investor_application_audit_logs")
    .select("id,created_at")
    .eq("application_id", id)
    .eq("action", "nda_link_sent")
    .order("created_at", { ascending: false })
    .limit(1);

  if (priorNdaSent && priorNdaSent.length > 0) {
    // Still ensure the investor is promoted to the investors table (safe to upsert)
    const now = new Date().toISOString();
    const ttlMs = Number.isFinite(TTL_HOURS) ? TTL_HOURS * 60 * 60 * 1000 : 72 * 60 * 60 * 1000;
    const expiresAt = new Date(Date.now() + ttlMs).toISOString();

    // Upsert minimal + likely columns; email is the key in your schema.
    // NOTE: If your investors table uses different column names, adjust here.
    await supabase.from("investors").upsert(
      {
        email: String(app.email).toLowerCase(),
        full_name: app.investor_name ?? null,
        organization: app.organization ?? null,
        status: "approved",
        approved_at: now,
        expires_at: expiresAt,
      },
      { onConflict: "email" }
    );

    return NextResponse.json({ ok: true, note: "Already sent NDA link ранее; skipped resend." });
  }

  // 1) Ensure auth user exists (invite creates user + sends Supabase invite email)
  // Only do this if user_id is missing to avoid multiple Supabase invite emails.
  let userId = (app.user_id as string | null) || null;

  if (!userId) {
    const origin = process.env.APP_ORIGIN || getOriginFromReq(req);
    const redirectTo = `${origin}/intelligence/portal`;

    const { data: inviteData, error: inviteErr } = await supabase.auth.admin.inviteUserByEmail(
      String(app.email).toLowerCase(),
      {
        redirectTo,
        data: { investor_application_id: id },
      }
    );

    if (inviteErr) {
      return NextResponse.json({ ok: false, error: inviteErr.message }, { status: 500 });
    }

    userId = inviteData?.user?.id || null;

    if (userId) {
      await supabase.from("investor_applications").update({ user_id: userId }).eq("id", id);
    }
  }

  // 2) Promote to investors table (canonical portal gating)
  const now = new Date().toISOString();
  const expiresAt = new Date(Date.now() + TTL_HOURS * 60 * 60 * 1000).toISOString();

  // Upsert by email. Your investors table does NOT have `id`, so email is the stable key.
  const { error: invErr } = await supabase.from("investors").upsert(
    {
      email: String(app.email).toLowerCase(),
      full_name: app.investor_name ?? null,
      organization: app.organization ?? null,
      status: "approved",
      approved_at: now,
      expires_at: expiresAt,
      // optionally store linkage for debugging (only if these columns exist in your schema)
      // user_id: userId,
      // application_id: id,
    },
    { onConflict: "email" }
  );

  if (invErr) {
    // If this fails due to schema mismatch, we want a clear error instead of silent failure.
    return NextResponse.json({ ok: false, error: `Failed to upsert investors: ${invErr.message}` }, { status: 500 });
  }

  // 3) Create expiring NDA link token record
  const rawToken = generateToken(32);
  const tokenHash = sha256(rawToken);

  const { error: ndaErr } = await supabase.from("investor_nda_links").insert({
    application_id: id,
    token_hash: tokenHash,
    expires_at: expiresAt,
  });

  if (ndaErr) {
    return NextResponse.json({ ok: false, error: ndaErr.message }, { status: 500 });
  }

  // 4) Email NDA link (your email service)
  const origin = process.env.APP_ORIGIN || getOriginFromReq(req);
  const ndaUrl = `${origin}/intelligence/nda?token=${rawToken}`;

  await sendApprovalEmail({
    email: String(app.email).toLowerCase(),
    ndaUrl,
    expiresHours: TTL_HOURS,
  });

  await supabase.from("investor_application_audit_logs").insert({
    application_id: id,
    action: "nda_link_sent",
    performed_by: admin.userId,
    metadata: { expires_at: expiresAt },
  });

  return NextResponse.json({ ok: true });
}
