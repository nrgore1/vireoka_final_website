import "server-only";
import { supabaseAdmin } from "@/lib/supabase/admin";

export type InvestorEvent = {
  email: string;
  type: string;
  path?: string | null;
  meta?: any;
};

export async function recordInvestorEvent(ev: InvestorEvent) {
  const sb = supabaseAdmin();
  await sb.from("investor_events").insert({
    email: ev.email,
    type: ev.type,
    path: ev.path ?? null,
    meta: ev.meta ?? null,
  });
}

export async function listInvestorEvents() {
  const sb = supabaseAdmin();
  const { data } = await sb
    .from("investor_events")
    .select("*")
    .order("created_at", { ascending: false });
  return data ?? [];
}

export async function logInvestorEvent(ev: InvestorEvent) {
  return recordInvestorEvent(ev);
}
