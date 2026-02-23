import type { ReactNode } from "react";
import { supabaseServerClient } from "@/lib/supabase/serverClient";
import { guardInvestorPortal } from "@/lib/portal/guard";
import { getInvestorContext } from "@/lib/portal/context";
import { tierLabel, requiredRankForFeature } from "@/lib/portal/tier";
import PreviewTierControl from "./PreviewTierControl";

export const dynamic = "force-dynamic";

function NavLink(props: { href: string; label: string; locked?: boolean }) {
  const { href, label, locked } = props;
  return (
    <a
      className={"hover:underline " + (locked ? "text-neutral-400" : "text-neutral-900")}
      href={href}
      title={locked ? "Locked for your tier" : undefined}
    >
      {locked ? `🔒 ${label}` : label}
    </a>
  );
}

export default async function PortalLayout({ children }: { children: ReactNode }) {
  const sb = await supabaseServerClient();
  await guardInvestorPortal(sb as any);

  const ctx = await getInvestorContext(sb as any);

  const canCapTable = ctx.tierRank >= requiredRankForFeature("cap_table");
  const canScenarios = ctx.tierRank >= requiredRankForFeature("scenarios");
  const canIntelligence = ctx.tierRank >= requiredRankForFeature("intelligence");

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b bg-white">
        <div className="max-w-6xl mx-auto px-4 py-4 flex flex-wrap items-center justify-between gap-x-6 gap-y-2">
          <a href="/portal/overview" className="font-semibold whitespace-nowrap text-lg">
            Vireoka Intelligence
          </a>

          <nav className="w-full md:w-auto flex flex-wrap gap-x-4 gap-y-2 text-sm md:justify-end">
            <NavLink href="/portal/overview" label="Overview" />
            <NavLink href="/portal/intelligence" label="AI Intelligence" locked={!canIntelligence} />
            <NavLink href="/portal/vdr" label="Data Room" />
            <NavLink href="/portal/scenarios" label="Scenarios" locked={!canScenarios} />
            <NavLink href="/portal/cap-table" label="Capital Modeling" locked={!canCapTable} />
            <NavLink href="/portal/activity" label="Activity" />
          </nav>
        </div>

        <div className="border-t bg-neutral-50">
          <div className="max-w-6xl mx-auto px-4 py-3 text-xs text-neutral-700 flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
            <div className="flex flex-wrap gap-x-4 gap-y-1">
              <span>
                Signed in as <span className="font-semibold">{ctx.email || "—"}</span>
              </span>
              <span>
                Tier: <span className="font-semibold">{tierLabel(ctx.tierRank)}</span>
              </span>
              <span>
                Access window:{" "}
                <span className="font-semibold">
                  {ctx.expiresAt ? new Date(ctx.expiresAt).toLocaleString() : "time-bound"}
                </span>
              </span>
              <span className="text-neutral-500">
                Controlled environment. Activity logged. Materials confidential.
              </span>
            </div>

            {ctx.isAdmin ? <PreviewTierControl initial={ctx.previewTier || ""} /> : null}
          </div>
        </div>
      </header>

      {children}
    </div>
  );
}
