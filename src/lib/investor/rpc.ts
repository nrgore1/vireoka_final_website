import { SupabaseClient } from '@supabase/supabase-js';

export type InvestorAccessStatus = {
  user_id: string;
  application: null | {
    id: string;
    status: string;
    submitted_at: string | null;
    updated_at: string | null;
  };
  access: {
    status: 'NONE' | 'ACTIVE' | 'EXPIRED' | 'REVOKED';
    grant_id?: string;
    starts_at?: string;
    expires_at?: string;
    revoked_at?: string | null;
    revoked_reason?: string | null;
    scope?: string;
  };
};

export type ActiveNdaTemplate = {
  id: string;
  version: string;
  title: string;
  content_html: string;
  effective_date: string;
};

export async function getInvestorAccessStatus(supabase: SupabaseClient): Promise<InvestorAccessStatus> {
  const { data, error } = await supabase.rpc('get_investor_access_status');
  if (error) throw error;
  return data as InvestorAccessStatus;
}

export async function getActiveNdaTemplate(supabase: SupabaseClient): Promise<ActiveNdaTemplate | null> {
  const { data, error } = await supabase.rpc('get_active_nda_template');
  if (error) throw error;
  // RPC returns a setof table; supabase-js may return array
  if (Array.isArray(data)) return (data[0] ?? null) as any;
  return (data ?? null) as any;
}

export async function hasActiveInvestorAccess(supabase: SupabaseClient): Promise<boolean> {
  const { data, error } = await supabase.rpc('has_active_investor_access');
  if (error) throw error;
  return Boolean(data);
}

export async function logPortalEvent(
  supabase: SupabaseClient,
  args: { event_type: string; entity_type?: string | null; entity_id?: string | null; metadata?: any }
): Promise<void> {
  const { error } = await supabase.rpc('log_portal_event', {
    event_type: args.event_type,
    entity_type: args.entity_type ?? null,
    entity_id: args.entity_id ?? null,
    metadata: args.metadata ?? {},
  });
  if (error) throw error;
}
