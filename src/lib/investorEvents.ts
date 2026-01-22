import { supabaseAdmin } from "@/lib/supabase/admin";

export type InvestorEvent = {
  email: string;
  type: string;
  path?: string | null;
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
  });
}

/**
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
}
