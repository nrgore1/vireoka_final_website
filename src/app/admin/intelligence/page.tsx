import Link from "next/link";
import { InvestorLeadsAdminTable } from "@/components/admin/InvestorLeadsAdminTable";

async function fetchLeads() {
  const res = await fetch("/api/admin/investor-leads", { cache: "no-store" }).catch(() => null);
  if (!res) return { ok: false as const, leads: [], error: "fetch failed" };

  const data = await res.json().catch(() => null);
  if (!res.ok || !data?.ok) return { ok: false as const, leads: [], error: data?.error || "unauthorized" };

  return { ok: true as const, leads: data.leads || [], error: null };
}

export default async function AdminIntelligencePage() {
  const r = await fetchLeads();

  return (
    <main className="mx-auto max-w-6xl px-4 sm:px-6 py-10 sm:py-14">
      <h1 className="text-3xl font-semibold tracking-tight text-vireoka-indigo">Admin · Intelligence</h1>
      <p className="mt-2 text-neutral-700">Review requests and manage access status.</p>

      {!r.ok ? (
        <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900">
          {r.error || "Unable to load leads."}
        </div>
      ) : null}

      <div className="mt-6">
        <Link className="text-sm text-vireoka-indigo underline underline-offset-4" href="/intelligence">
          View Intelligence →
        </Link>
      </div>

      <InvestorLeadsAdminTable initialLeads={r.leads as any[]} />
    </main>
  );
}
