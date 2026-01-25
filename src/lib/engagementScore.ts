import { supabaseAdmin } from "@/lib/supabase/admin";
import { hotInvestorThreshold } from "@/lib/investorPolicy";
import {
  getInvestorByEmail,
  markHotAlerted,
  setEngagementScore,
} from "@/lib/investorStore";
import { notifyHotInvestor } from "@/lib/notify/hotInvestor";

/**
 * Tracks engagement using explicit path counts.
 */
export async function trackEngagementScore(
  email: string,
  pathCounts: Map<string, number>
) {
  const threshold = hotInvestorThreshold();

  const score = [...pathCounts.values()].reduce((a, b) => a + b, 0);

  await setEngagementScore(email, score);

  const inv = await getInvestorByEmail(email);

  if (inv && score >= threshold && !inv.hot_alerted_at) {
    const topPaths = [...pathCounts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([path]) => path);

    // ✅ FIX: positional arguments, not object
    await notifyHotInvestor(email, score, topPaths);

    await markHotAlerted(email);
  }
}

/**
 * Recomputes engagement score from stored events.
 */
export async function recomputeEngagementScore(email: string) {
  const supabase = supabaseAdmin();

  const { data } = await supabase
    .from("investor_events")
    .select("path")
    .eq("email", email);

  const pathCounts = new Map<string, number>();

  for (const row of data ?? []) {
    pathCounts.set(row.path, (pathCounts.get(row.path) ?? 0) + 1);
  }

  await trackEngagementScore(email, pathCounts);
}
