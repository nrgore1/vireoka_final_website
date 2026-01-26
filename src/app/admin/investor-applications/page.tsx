import { supabaseAdmin } from '@/lib/supabase/admin'
import { updateInvestorApplicationStatus } from './actions'

export const dynamic = 'force-dynamic'

export default async function AdminInvestorApplicationsPage() {
  const supabase = supabaseAdmin()

  const { data: apps, error } = await supabase
    .from('investor_applications')
    .select('id,investor_name,email,organization,status,reference_code,created_at,updated_at,admin_notes,metadata')
    .order('created_at', { ascending: false })
    .limit(200)

  if (error) {
    return <pre>Failed to load applications: {error.message}</pre>
  }

  return (
    <div style={{ maxWidth: 1100, margin: '40px auto', padding: 16 }}>
      <h1 style={{ fontSize: 24, marginBottom: 16 }}>Admin — Investor Applications</h1>

      <p style={{ color: '#666' }}>
        This page reads via service role. In production, protect this route (middleware) and pass the logged-in admin user id to actions.
      </p>

      <div style={{ display: 'grid', gap: 12 }}>
        {apps?.map((a) => (
          <div key={a.id} style={{ border: '1px solid #ddd', borderRadius: 10, padding: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
              <div>
                <div><b>{a.investor_name}</b> — {a.email}</div>
                <div>{a.organization}</div>
                <div style={{ fontSize: 12, color: '#666' }}>
                  Ref: {a.reference_code} • Status: <b>{a.status}</b>
                </div>
                <div style={{ fontSize: 12, color: '#666' }}>
                  Created: {new Date(a.created_at).toLocaleString()} • Updated: {new Date(a.updated_at).toLocaleString()}
                </div>
                <div style={{ fontSize: 12, color: '#666' }}>
                  Role: {a.metadata?.role ?? '-'} • Type: {a.metadata?.investor_type ?? '-'}
                </div>
                {a.admin_notes ? <div style={{ marginTop: 8 }}><b>Admin notes:</b> {a.admin_notes}</div> : null}
              </div>

              {a.status === 'pending' ? (
                <div style={{ minWidth: 320 }}>
                  <AdminActions applicationId={a.id} />
                </div>
              ) : (
                <div style={{ alignSelf: 'center', color: '#666' }}>No actions available</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function AdminActions({ applicationId }: { applicationId: string }) {
  return (
    <div style={{ display: 'grid', gap: 8 }}>
      <form
        action={async (fd) => {
          'use server'
          const actor_user_id = String(fd.get('actor_user_id') || '')
          const admin_notes = String(fd.get('admin_notes') || '')
          await updateInvestorApplicationStatus({
            actor_user_id,
            application_id: applicationId,
            to_status: 'approved',
            admin_notes,
          })
        }}
        style={{ display: 'grid', gap: 8 }}
      >
        <input name="actor_user_id" placeholder="Admin user id (UUID)" required style={{ padding: 8 }} />
        <textarea name="admin_notes" placeholder="Optional notes" style={{ padding: 8 }} />
        <button type="submit" style={{ padding: 10 }}>Approve</button>
      </form>

      <form
        action={async (fd) => {
          'use server'
          const actor_user_id = String(fd.get('actor_user_id') || '')
          const admin_notes = String(fd.get('admin_notes') || '')
          await updateInvestorApplicationStatus({
            actor_user_id,
            application_id: applicationId,
            to_status: 'rejected',
            admin_notes,
          })
        }}
        style={{ display: 'grid', gap: 8 }}
      >
        <input name="actor_user_id" placeholder="Admin user id (UUID)" required style={{ padding: 8 }} />
        <textarea name="admin_notes" placeholder="Optional notes" style={{ padding: 8 }} />
        <button type="submit" style={{ padding: 10 }}>Reject</button>
      </form>
    </div>
  )
}
