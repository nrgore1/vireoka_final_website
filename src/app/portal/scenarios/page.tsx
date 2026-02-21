import { logPortalEventServer } from "@/lib/portal/audit";

export const dynamic = "force-dynamic";

export default async function Page() {
  try {
    await logPortalEventServer({
      event_type: "scenarios_view",
      entity_type: "page",
      entity_id: "/portal/scenarios",
    });
  } catch {}

  return (
    <main className="max-w-6xl mx-auto px-4 py-10 space-y-4">
      <h1 className="text-2xl font-semibold">Saved Scenarios</h1>
      <p className="text-sm text-neutral-700">
        This will show your saved scenario runs and comparisons.
      </p>
    </main>
  );
}
