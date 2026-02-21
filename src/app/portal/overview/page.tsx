import { supabaseServerClient } from "@/lib/supabase/serverClient";
import { logPortalEventServer } from "@/lib/portal/audit";

export const dynamic = "force-dynamic";

export default async function Page() {
  const sb = await supabaseServerClient();
  const { data: userRes } = await sb.auth.getUser();

  const email = String(userRes?.user?.email || "").toLowerCase();

  // best-effort log
  try {
    await logPortalEventServer({
      event_type: "portal_overview_view",
      entity_type: "page",
      entity_id: "/portal/overview",
      metadata: { email },
    });
  } catch {}

  return (
    <main className="max-w-6xl mx-auto px-4 py-10 space-y-8">
      <div className="space-y-2">
        <div className="text-xs tracking-wide uppercase text-neutral-500 font-semibold">
          Vireoka • Investor Portal
        </div>
        <h1 className="text-3xl font-semibold">Vireoka Intelligence</h1>
        <p className="text-neutral-700 max-w-3xl">
          Confidential diligence environment. Access is selective, time-bound, watermarked, and logged.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <a href="/portal/intelligence" className="rounded-xl border p-5 hover:bg-neutral-50">
          <div className="font-semibold">AI Insights</div>
          <div className="text-sm text-neutral-600 mt-1">
            Ask scenario questions and see deterministic financial projections rendered live.
          </div>
        </a>

        <a href="/portal/vdr" className="rounded-xl border p-5 hover:bg-neutral-50">
          <div className="font-semibold">Virtual Data Room</div>
          <div className="text-sm text-neutral-600 mt-1">
            Tiered diligence materials with audit logging and controlled access.
          </div>
        </a>

        <a href="/portal/cap-table" className="rounded-xl border p-5 hover:bg-neutral-50">
          <div className="font-semibold">Cap Table Simulator</div>
          <div className="text-sm text-neutral-600 mt-1">
            Model dilution and valuation outcomes for the $10M round.
          </div>
        </a>
      </div>

      <div className="rounded-xl border p-5">
        <div className="font-semibold">Your access</div>
        <div className="text-sm text-neutral-700 mt-1">
          Signed in as <span className="font-semibold">{email || "—"}</span>. Your access window and activity are tracked for security.
        </div>
      </div>
    </main>
  );
}
