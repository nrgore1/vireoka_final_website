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
      event_type: "intelligence_view",
      entity_type: "page",
      entity_id: "/portal/intelligence",
      metadata: { tierRank: ctx.tierRank, preview: ctx.previewTier || null },
    });
  } catch {}

  const required = requiredRankForFeature("intelligence");
  const locked = ctx.tierRank < required;

  if (locked) {
    return (
      <main className="max-w-6xl mx-auto px-4 py-10 space-y-4">
        <h1 className="text-2xl font-semibold">Vireoka Intelligence</h1>
        <p className="text-sm text-neutral-700">
          Current tier: <span className="font-semibold">{tierLabel(ctx.tierRank)}</span>. This module requires Angel+ access.
        </p>

        <LockedCard
          title="AI Data Room Search (Cited Answers)"
          subtitle="Angel+"
          description="Ask: “What is Vireoka’s moat vs Palantir?” Get a cited answer from diligence materials."
          href="/portal/intelligence"
          locked={true}
          ctaHref="/portal/request-extension"
        />
      </main>
    );
  }

  return (
    <main className="max-w-6xl mx-auto px-4 py-10 space-y-4">
      <h1 className="text-2xl font-semibold">Vireoka Intelligence</h1>
      <p className="text-sm text-neutral-700">
        This module will contain the AI query bar + deterministic scenario modeling + SVG charts.
      </p>

      <div className="rounded-xl border p-5 text-sm text-neutral-700">
        Next: wire /api/portal/scenario/run and render charts from computed results.
      </div>
    </main>
  );
}
