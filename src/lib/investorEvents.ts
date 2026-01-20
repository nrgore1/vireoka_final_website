import { getSupabase } from "./supabase";
import { EVENT_TYPES } from "./eventTypes";

export async function recordInvestorEvent(input: {
  email: string;
  event: (typeof EVENT_TYPES)[number];
  path?: string;
  ip: string;
}) {
  let supabase;
  try {
    supabase = getSupabase();
  } catch {
    // Allow dev without analytics infra
    return { ok: true, skipped: "no_supabase" };
  }

  await supabase.from("investor_events").insert({
    email: input.email,
    event: input.event,
    path: input.path ?? null,
    ip: input.ip,
  });

  return { ok: true };
}
