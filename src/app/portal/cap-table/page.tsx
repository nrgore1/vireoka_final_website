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
      event_type: "cap_table_view",
      entity_type: "page",
      entity_id: "/portal/cap-table",
      metadata: { tierRank: ctx.tierRank, preview: ctx.previewTier || null },
    });
  } catch {}

  const required = requiredRankForFeature("cap_table");
  const locked = ctx.tierRank < required;

  if (locked) {
    return (
      <main className="max-w-6xl mx-auto px-4 py-10 space-y-4">
        <h1 className="text-2xl font-semibold">Cap Table Simulator</h1>
        <p className="text-sm text-neutral-700">
          Current tier: <span className="font-semibold">{tierLabel(ctx.tierRank)}</span>. This module requires Angel+ access.
        </p>

        <LockedCard
          title="Interactive Dilution + Valuation Slider"
          subtitle="Angel+"
          description="Model dilution, pre/post, and ownership outcomes for the $10M round."
          href="/portal/cap-table"
          locked={true}
          ctaHref="/portal/request-extension"
        />
      </main>
    );
  }

  return (
    <main className="max-w-6xl mx-auto px-4 py-10 space-y-4">
      <h1 className="text-2xl font-semibold">Cap Table Simulator</h1>
      <p className="text-sm text-neutral-700">
        This module will implement the interactive dilution + valuation slider for the $10M raise.
      </p>
    </main>
  );
}
