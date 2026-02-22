import type { ReactNode } from "react";
import { supabaseServerClient } from "@/lib/supabase/serverClient";
import { guardInvestorPortal } from "@/lib/portal/guard";
import { getInvestorContext } from "@/lib/portal/context";

export const dynamic = "force-dynamic";

function tierLabel(rank: number) {
  if (rank >= 40) return "VC (Full Due Diligence)";
  if (rank >= 35) return "Family Office (Financial / Legacy)";
  if (rank >= 30) return "Corporate (Synergetic)";
  if (rank >= 20) return "Angel (Intermediate)";
  if (rank >= 15) return "Advisor / Contractor (Collaborative)";
  return "Crowd (Public-Private)";
}

export default async function PortalLayout({ children }: { children: ReactNode }) {
  const sb = await supabaseServerClient();

  // Redirects safely (login / pending / expired). Never throws into a Digest page.
  await guardInvestorPortal(sb as any);

  const ctx = await getInvestorContext(sb as any);

  const showCapTable = ctx.tierRank >= 20;    // Angel+
  const showScenarios = ctx.tierRank >= 30;   // Corporate/Family/VC
  const showIntelligence = ctx.tierRank >= 20; // Angel+
  const showVdr = true;
  const showActivity = true;

  return (
    <div className="min-h-screen">
      <header className="border-b bg-white">
        <div className="max-w-6xl mx-auto px-4 py-4 flex flex-wrap items-center justify-between gap-x-6 gap-y-2">
          <a href="/portal/overview" className="font-semibold whitespace-nowrap">
            Vireoka Investor Portal
          </a>

          <nav className="w-full md:w-auto flex flex-wrap gap-x-4 gap-y-2 text-sm md:justify-end">
            <a className="hover:underline" href="/portal/overview">Overview</a>
            {showIntelligence ? <a className="hover:underline" href="/portal/intelligence">Intelligence</a> : null}
            {showVdr ? <a className="hover:underline" href="/portal/vdr">Data Room</a> : null}
            {showScenarios ? <a className="hover:underline" href="/portal/scenarios">Scenarios</a> : null}
            {showCapTable ? <a className="hover:underline" href="/portal/cap-table">Cap Table</a> : null}
            {showActivity ? <a className="hover:underline" href="/portal/activity">Activity</a> : null}
          </nav>
        </div>

        <div className="border-t bg-neutral-50">
          <div className="max-w-6xl mx-auto px-4 py-3 text-xs text-neutral-700 flex flex-wrap gap-x-4 gap-y-1">
            <span>
              Signed in as <span className="font-semibold">{ctx.email || "—"}</span>
            </span>
            <span>
              Tier: <span className="font-semibold">{tierLabel(ctx.tierRank)}</span>
            </span>
            <span>
              Access window: <span className="font-semibold">{ctx.expiresAt ? new Date(ctx.expiresAt).toLocaleString() : "time-bound"}</span>
            </span>
            <span className="text-neutral-500">
              All activity is logged. Materials are confidential and watermarked.
            </span>
          </div>
        </div>
      </header>

      {children}
    </div>
  );
}
