import Link from "next/link";

async function fetchLeads() {
  const token = process.env.ADMIN_TOKEN_VALUE || process.env.ADMIN_TOKEN || "";
  const base = process.env.NEXT_PUBLIC_SITE_URL || ""; // optional
  // In-app fetch uses relative URL; token required via headers
  const res = await fetch(`${base}/api/admin/investor-leads`, {
    headers: { "x-admin-token": token },
    cache: "no-store",
  }).catch(() => null);

  if (!res) return { ok: false, leads: [], error: "fetch failed" };
  const data = await res.json().catch(() => null);
  if (!data?.ok) return { ok: false, leads: [], error: data?.error || "unauthorized" };
  return { ok: true, leads: data.leads || [], error: null };
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

      <div className="mt-8 overflow-hidden rounded-2xl border border-vireoka-line bg-white shadow-sm">
        <div className="px-6 py-4 border-b border-vireoka-line flex items-center justify-between">
          <p className="font-medium text-neutral-900">Investor leads</p>
          <Link className="text-sm text-vireoka-indigo underline underline-offset-4" href="/intelligence">
            View Intelligence →
          </Link>
        </div>

        <div className="divide-y divide-vireoka-line">
          {(r.leads || []).map((lead: any) => (
            <div key={lead.id} className="px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <p className="text-sm font-semibold text-neutral-900">
                  {lead.full_name} <span className="font-normal text-neutral-500">({lead.email})</span>
                </p>
                <p className="text-xs text-neutral-600">
                  {lead.company || "—"} · role: {lead.investor_type || "—"} · ref:{" "}
                  <span className="font-mono">{lead.reference_code}</span>
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs rounded-full border border-vireoka-line bg-vireoka-ash px-3 py-1">
                  {lead.status}
                </span>
              </div>
            </div>
          ))}

          {r.ok && (r.leads || []).length === 0 ? (
            <div className="px-6 py-10 text-sm text-neutral-600">No requests yet.</div>
          ) : null}
        </div>
      </div>

      <div className="mt-6 text-xs text-neutral-500">
        Use the API to approve/revoke: <code className="font-mono">/api/admin/investor-leads/status</code>
      </div>
    </main>
  );
}
