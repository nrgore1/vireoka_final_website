import { getInvestorContext } from "@/lib/portal/context";
import { supabaseServerClient } from "@/lib/supabase/serverClient";
import { logPortalEventServer } from "@/lib/portal/audit";
import { LockedCard } from "@/components/portal/LockedCard";
import { requiredRankForFeature, tierLabel } from "@/lib/portal/tier";

export const dynamic = "force-dynamic";

export default async function Page() {
  const sb = await supabaseServerClient();
  const ctx = await getInvestorContext(sb as any);

  try {
    await logPortalEventServer({
      event_type: "scenarios_view",
      entity_type: "page",
      entity_id: "/portal/scenarios",
      metadata: { tierRank: ctx.tierRank, preview: ctx.previewTier || null },
    });
  } catch {}

  const required = requiredRankForFeature("scenarios");
  const locked = ctx.tierRank < required;

  if (locked) {
    return (
      <main className="max-w-6xl mx-auto px-4 py-10 space-y-4">
        <h1 className="text-2xl font-semibold">Scenario Simulator</h1>
        <p className="text-sm text-neutral-700">
          Current tier: <span className="font-semibold">{tierLabel(ctx.tierRank)}</span>. This module is available for Corporate/Family/VC tiers.
        </p>

        <LockedCard
          title="Deterministic Scenarios (CAC • Churn • ARPU • EBITDA)"
          subtitle="Corporate/Family/VC"
          description="Stress test growth, burn, and valuation under downside and upside assumptions."
          href="/portal/scenarios"
          locked={true}
          ctaHref="/portal/request-extension"
        />
      </main>
    );
  }

  return (
    <main className="max-w-6xl mx-auto px-4 py-10 space-y-4">
      <h1 className="text-2xl font-semibold">Saved Scenarios</h1>
      <p className="text-sm text-neutral-700">
        This will show your saved scenario runs and comparisons.
      </p>
    </main>
  );
}
