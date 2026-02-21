import { logPortalEventServer } from "@/lib/portal/audit";

export const dynamic = "force-dynamic";

export default async function Page() {
  try {
    await logPortalEventServer({
      event_type: "intelligence_view",
      entity_type: "page",
      entity_id: "/portal/intelligence",
    });
  } catch {}

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
