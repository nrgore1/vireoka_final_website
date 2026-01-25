import "server-only";
import { supabaseAdmin } from "@/lib/supabase/admin";

export type InvestorEvent = {
  email: string;
  type: string;
  path?: string | null;
  ip?: string | null;
  user_agent?: string | null;
  meta?: any | null;
};

export async function recordInvestorEvent(evt: InvestorEvent) {
  const sb = supabaseAdmin();
  const { error } = await sb.from("investor_events").insert({
    email: evt.email,
    type: evt.type,
    path: evt.path ?? null,
    ip: evt.ip ?? null,
    user_agent: evt.user_agent ?? null,
    meta: evt.meta ?? null,
  });
  if (error) throw error;
}

export async function listInvestorEvents(email?: string) {
  const sb = supabaseAdmin();
  let q = sb
    .from("investor_events")
    .select("id,created_at,email,type,path,ip,user_agent,meta")
    .order("created_at", { ascending: false })
    .limit(500);

  if (email) q = q.eq("email", email);
  const { data, error } = await q;
  if (error) throw error;
  return (data as any[]) || [];
}
