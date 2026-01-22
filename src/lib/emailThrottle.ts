import { supabaseAdmin } from "@/lib/supabase/admin";

export async function canSendEmail(email: string) {
  const supabase = supabaseAdmin();

  const perHour = Number(process.env.EMAIL_THROTTLE_PER_HOUR || 5);
  const perDay = Number(process.env.EMAIL_THROTTLE_PER_DAY || 15);
  const minInterval = Number(process.env.EMAIL_THROTTLE_MIN_INTERVAL_SECONDS || 60);

  const now = Date.now();
  const hourAgo = new Date(now - 60 * 60 * 1000).toISOString();
  const dayAgo = new Date(now - 24 * 60 * 60 * 1000).toISOString();

  // count in last hour/day
  const { count: hourCount } = await supabase
    .from("investor_comms")
    .select("id", { count: "exact", head: true })
    .eq("email", email)
    .gte("created_at", hourAgo)
    .in("status", ["queued", "sent"]);

  const { count: dayCount } = await supabase
    .from("investor_comms")
    .select("id", { count: "exact", head: true })
    .eq("email", email)
    .gte("created_at", dayAgo)
    .in("status", ["queued", "sent"]);

  // last sent timestamp
  const { data: last } = await supabase
    .from("investor_comms")
    .select("created_at")
    .eq("email", email)
    .in("status", ["queued", "sent"])
    .order("created_at", { ascending: false })
    .limit(1);

  const lastAt = last?.[0]?.created_at ? new Date(last[0].created_at).getTime() : 0;

  if ((hourCount || 0) >= perHour) return { ok: false, reason: "hour_limit" };
  if ((dayCount || 0) >= perDay) return { ok: false, reason: "day_limit" };
  if (lastAt && now - lastAt < minInterval * 1000) return { ok: false, reason: "min_interval" };

  return { ok: true as const };
}
