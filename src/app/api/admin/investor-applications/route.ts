import { NextResponse } from 'next/server';
import { getServiceSupabase } from '@/lib/supabase/serverClients';
import { requireAdminFromBearer } from '@/lib/auth/requireAdminFromBearer';
import { generateToken, sha256 } from '@/lib/security/tokens';
import { sendApprovalEmail } from '@/lib/email/sendApprovalEmail';

const TTL_HOURS = Number(process.env.NDA_LINK_TTL_HOURS || 72);

export async function POST(req: Request) {
  const admin = await requireAdminFromBearer(req);
  if (!admin.ok) {
    return NextResponse.json({ ok: false, error: admin.error }, { status: admin.status });
  }

  const body = await req.json().catch(() => null);
  const id = body?.id as string | undefined;
  const action = body?.action as string | undefined;

  if (!id || !['approved', 'rejected'].includes(String(action))) {
    return NextResponse.json({ ok: false, error: 'Invalid payload' }, { status: 400 });
  }

  const supabase = getServiceSupabase();

  // Fetch application details
  const { data: app, error: appErr } = await supabase
    .from('investor_applications')
    .select('id,email,investor_name,status,user_id')
    .eq('id', id)
    .single();

  if (appErr || !app) {
    return NextResponse.json({ ok: false, error: appErr?.message || 'Application not found' }, { status: 404 });
  }

  // Update status
  const { error: updErr } = await supabase
    .from('investor_applications')
    .update({ status: action })
    .eq('id', id);

  if (updErr) {
    return NextResponse.json({ ok: false, error: updErr.message }, { status: 500 });
  }

  // Audit log
  await supabase.from('investor_application_audit_logs').insert({
    application_id: id,
    action,
    performed_by: admin.userId,
    metadata: { via: 'admin_api' },
  });

  // If rejected: done
  if (action === 'rejected') {
    return NextResponse.json({ ok: true });
  }

  // APPROVED FLOW:
  // 1) Ensure auth user exists (invite creates user + sends login email)
  // 2) Link user_id on investor_applications
  // 3) Create expiring NDA link token record
  // 4) Email NDA link (Resend)

  let userId = app.user_id as string | null;

  if (!userId) {
    // Invite user by email. This sends Supabase's invite/magic link email.
    // You can customize email templates in Supabase Auth settings.
    const redirectTo = `${process.env.APP_ORIGIN || 'http://localhost:3000'}/investors/portal`;
    const { data: inviteData, error: inviteErr } = await supabase.auth.admin.inviteUserByEmail(app.email, {
      redirectTo,
      data: { investor_application_id: id },
    });

    if (inviteErr) {
      return NextResponse.json({ ok: false, error: inviteErr.message }, { status: 500 });
    }

    userId = inviteData?.user?.id || null;

    if (userId) {
      await supabase.from('investor_applications').update({ user_id: userId }).eq('id', id);
    }
  }

  // NDA link token
  const rawToken = generateToken(32);
  const tokenHash = sha256(rawToken);
  const expiresAt = new Date(Date.now() + TTL_HOURS * 60 * 60 * 1000).toISOString();

  const { error: ndaErr } = await supabase.from('investor_nda_links').insert({
    application_id: id,
    token_hash: tokenHash,
    expires_at: expiresAt,
  });

  if (ndaErr) {
    return NextResponse.json({ ok: false, error: ndaErr.message }, { status: 500 });
  }

  const origin = process.env.APP_ORIGIN || 'http://localhost:3000';
  const ndaUrl = `${origin}/investors/nda?token=${rawToken}`;

  await sendApprovalEmail({
    email: app.email,
    ndaUrl,
    expiresHours: TTL_HOURS,
  });

  await supabase.from('investor_application_audit_logs').insert({
    application_id: id,
    action: 'nda_link_sent',
    performed_by: admin.userId,
    metadata: { expires_at: expiresAt },
  });

  return NextResponse.json({ ok: true });
}
