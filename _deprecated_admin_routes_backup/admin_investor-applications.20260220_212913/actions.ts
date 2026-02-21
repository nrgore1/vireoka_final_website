'use server'

import { supabaseAdmin } from '@/lib/supabase/admin'
import { sendEmail } from '@/lib/email/resend'

type Status = 'pending' | 'approved' | 'rejected'

async function assertAdmin(userId: string) {
  const supabase = supabaseAdmin()
  const { data, error } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', userId)
    .in('role', ['admin', 'investor_admin'])
    .maybeSingle()

  if (error || !data) throw new Error('Not authorized')
}

function allowedTransition(from: Status, to: Status) {
  // only allow pending -> approved/rejected
  if (from === 'pending' && (to === 'approved' || to === 'rejected')) return true
  return false
}

export async function updateInvestorApplicationStatus(params: {
  actor_user_id: string
  application_id: string
  to_status: Status
  admin_notes?: string
}) {
  const supabase = supabaseAdmin()

  await assertAdmin(params.actor_user_id)

  const { data: app, error: fetchErr } = await supabase
    .from('investor_applications')
    .select('id,status,email,investor_name,reference_code')
    .eq('id', params.application_id)
    .single()

  if (fetchErr) throw new Error('Application not found')

  const from_status = app.status as Status
  if (!allowedTransition(from_status, params.to_status)) {
    throw new Error(`Invalid transition: ${from_status} -> ${params.to_status}`)
  }

  const { error: updErr } = await supabase
    .from('investor_applications')
    .update({
      status: params.to_status,
      admin_notes: params.admin_notes ?? null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', params.application_id)

  if (updErr) throw new Error('Update failed')

  // Audit log
  await supabase.from('investor_application_audit_logs').insert({
    application_id: params.application_id,
    actor_user_id: params.actor_user_id,
    actor_type: 'admin',
    action: params.to_status === 'approved' ? 'approve' : 'reject',
    from_status,
    to_status: params.to_status,
    meta: { admin_notes: params.admin_notes ?? null },
  })

  // Email applicant
  await sendEmail({
    to: app.email,
    subject: `Your investor application was ${params.to_status}`,
    html: `
      <p>Hi ${escapeHtml(app.investor_name)},</p>
      <p>Your investor application (ref: <b>${escapeHtml(app.reference_code)}</b>) was <b>${escapeHtml(params.to_status)}</b>.</p>
      ${params.admin_notes ? `<p><b>Notes:</b> ${escapeHtml(params.admin_notes)}</p>` : ''}
      <p>Thanks,</p>
    `,
  })

  return { ok: true }
}

function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c] as string))
}
