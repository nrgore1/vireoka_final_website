import { supabaseAdmin } from "@/lib/supabase/admin";

export async function recomputeEngagementScore(email: string) {
  const supabase = supabaseAdmin();

  const { data: events } = await supabase
    .from("email_tracking_events")
    .select("event")
    .eq("email", email);

  const opens = events?.filter(e => e.event === "open").length || 0;
  const clicks = events?.filter(e => e.event === "click").length || 0;

  const { data: investor } = await supabase
    .from("investors")
    .select("nda_signed")
    .eq("email", email)
    .single();

  const score =
    opens * 1 +
    clicks * 3 +
    (investor?.nda_signed ? 10 : 0);

  await supabase
    .from("investors")
    .update({ engagement_score: score })
    .eq("email", email);

  return score;
}
