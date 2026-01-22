import "server-only";
import { supabaseAdmin } from "@/lib/supabase/admin";

export type InvestorEvent = {
  email: string;
  type: string;
  path?: string | null;
  created_at?: string;
};

/**
 * Record a single investor event (used by public APIs)
 */
export async function recordInvestorEvent(ev: InvestorEvent) {
  const sb = supabaseAdmin();

  await sb.from("investor_events").insert({
    email: ev.email,
    type: ev.type,
    path: ev.path ?? null,
  });
}

/**
 * List investor events (admin-only)
 */
export async function listInvestorEvents(): Promise<InvestorEvent[]> {
  const sb = supabaseAdmin();

  const { data } = await sb
    .from("investor_events")
    .select("*")
    .order("created_at", { ascending: false });

  return (data as InvestorEvent[]) ?? [];
}
