import { SupabaseClient } from '@supabase/supabase-js';

export async function ensureInvestorAdminRole(supabase: SupabaseClient): Promise<void> {
  // RLS will enforce, but this provides a friendly client-side gate
  const { data, error } = await supabase.from('user_roles').select('role').eq('role', 'INVESTOR_ADMIN').maybeSingle();
  if (error || !data) throw new Error('FORBIDDEN_ROLE');
}

export async function adminApproveAndGrantAccess(
  supabase: SupabaseClient,
  application_id: string,
  duration_days = 30,
  scope: 'FULL' | 'LIMITED' = 'FULL'
) {
  const { data, error } = await supabase.rpc('admin_approve_application_and_grant_access', {
    application_id,
    duration_days,
    scope,
  });
  if (error) throw error;
  return data;
}

export async function adminRevokeAccess(supabase: SupabaseClient, grant_id: string, reason?: string) {
  const { data, error } = await supabase.rpc('admin_revoke_investor_access', {
    grant_id,
    reason: reason ?? 'Revoked by admin',
  });
  if (error) throw error;
  return data;
}

export async function adminExtendAccess(supabase: SupabaseClient, grant_id: string, additional_days = 30, reason?: string) {
  const { data, error } = await supabase.rpc('admin_extend_investor_access', {
    grant_id,
    additional_days,
    reason: reason ?? 'Extended by admin',
  });
  if (error) throw error;
  return data;
}

export async function adminActivateNdaTemplate(supabase: SupabaseClient, template_id: string) {
  const { data, error } = await supabase.rpc('activate_nda_template', { template_id });
  if (error) throw error;
  return data;
}

export async function adminListAuditEvents(supabase: SupabaseClient, limit = 250) {
  const { data, error } = await supabase
    .from('portal_audit_events')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data;
}
