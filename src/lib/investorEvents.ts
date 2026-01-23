<<<<<<< HEAD
=======
import "server-only";
>>>>>>> rebuild-forward
import { supabaseAdmin } from "@/lib/supabase/admin";

export type InvestorEvent = {
  email: string;
  type: string;
  path?: string | null;
<<<<<<< HEAD
  meta?: any | null;
};

/**
 * Canonical write function
 */
export async function recordInvestorEvent(event: InvestorEvent) {
  const supabase = supabaseAdmin();

  await supabase.from("investor_events").insert({
    email: event.email,
    type: event.type,
    path: event.path ?? null,
    meta: event.meta ?? null,
=======
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
>>>>>>> rebuild-forward
  });
}

/**
<<<<<<< HEAD
 * Alias used by API routes (semantic clarity)
 */
export const logInvestorEvent = recordInvestorEvent;

/**
 * Admin read access
 */
export async function listInvestorEvents(limit = 500) {
  const supabase = supabaseAdmin();

  const { data, error } = await supabase
    .from("investor_events")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data ?? [];
=======
 * List investor events (admin-only)
 */
export async function listInvestorEvents(): Promise<InvestorEvent[]> {
  const sb = supabaseAdmin();

  const { data } = await sb
    .from("investor_events")
    .select("*")
    .order("created_at", { ascending: false });

  return (data as InvestorEvent[]) ?? [];
>>>>>>> rebuild-forward
}
