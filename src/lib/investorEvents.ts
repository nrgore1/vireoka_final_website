import { supabase } from "./supabase";

export async function recordInvestorEvent(input: {
  email: string | null;
  event: string;
  path: string;
  meta: any | null;
  ip: string;
}) {
  await supabase.from("investor_events").insert({
    email: input.email,
    event: input.event,
    path: input.path,
    meta: input.meta,
    ip: input.ip,
  });
}

export async function listInvestorEvents(email?: string) {
  let q = supabase.from("investor_events").select("*").order("created_at", { ascending: false }).limit(500);
  if (email) q = q.eq("email", email);
  const { data } = await q;
  return data ?? [];
}
