import { logPortalEventServer } from "@/lib/portal/audit";

export const dynamic = "force-dynamic";

export default async function Page() {
  try {
    await logPortalEventServer({
      event_type: "cap_table_view",
      entity_type: "page",
      entity_id: "/portal/cap-table",
    });
  } catch {}

  return (
    <main className="max-w-6xl mx-auto px-4 py-10 space-y-4">
      <h1 className="text-2xl font-semibold">Cap Table Simulator</h1>
      <p className="text-sm text-neutral-700">
        This module will implement the interactive dilution + valuation slider for the $10M raise.
      </p>
    </main>
  );
}
