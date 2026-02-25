"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

type Lead = {
  id: string;
  full_name: string | null;
  email: string;
  company: string | null;
  kind: string;
  investor_type: string | null;
  status: "NEW" | "APPROVED" | "REVOKED";
  reference_code: string | null;
  created_at: string;
};

function badge(status: Lead["status"]) {
  if (status === "APPROVED") return "bg-emerald-50 text-emerald-700 border-emerald-200";
  if (status === "REVOKED") return "bg-rose-50 text-rose-700 border-rose-200";
  return "bg-amber-50 text-amber-800 border-amber-200";
}

export default function AdminLeadDashboard() {
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [err, setErr] = useState<string | null>(null);

  const sorted = useMemo(() => leads, [leads]);

  async function load() {
    setErr(null);
    setLoading(true);
    try {
      const res = await fetch("/api/admin/investor-leads", {
        headers: { "x-admin-token": token },
      });
      const j = await res.json().catch(() => ({}));
      if (!res.ok || !j.ok) throw new Error(j.error || "Failed to load leads");
      setLeads(j.leads || []);
    } catch (e: any) {
      setErr(String(e?.message || e));
    } finally {
      setLoading(false);
    }
  }

  async function setStatus(id: string, status: Lead["status"]) {
    setErr(null);
    try {
      const res = await fetch("/api/admin/investor-leads/status", {
        method: "POST",
        headers: { "content-type": "application/json", "x-admin-token": token },
        body: JSON.stringify({ id, status }),
      });
      const j = await res.json().catch(() => ({}));
      if (!res.ok || !j.ok) throw new Error(j.error || "Failed to update status");
      await load();
    } catch (e: any) {
      setErr(String(e?.message || e));
    }
  }

  useEffect(() => {
    // do nothing by default (avoid accidental calls without token)
  }, []);

  return (
    <main className="mx-auto max-w-6xl px-4 sm:px-6 py-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-vireoka-indigo">
            Admin · Intelligence Access Requests
          </h1>
          <p className="mt-1 text-sm text-neutral-600">
            Review requests and set status: <span className="font-medium">NEW → APPROVED → REVOKED</span>.
          </p>
        </div>
        <Link href="/admin/intelligence" className="text-sm underline underline-offset-4 text-vireoka-teal">
          Back to Admin Intelligence
        </Link>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <section className="rounded-2xl border border-vireoka-line bg-white shadow-sm">
          <div className="p-5 border-b border-vireoka-line">
            <div className="flex flex-wrap gap-3 items-end justify-between">
              <div className="min-w-[260px]">
                <label className="block text-xs font-medium text-neutral-700">Admin Token</label>
                <input
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  placeholder="Paste ADMIN token"
                  className="mt-1 w-full rounded-md border border-vireoka-line px-3 py-2 text-sm"
                />
              </div>
              <button
                onClick={load}
                disabled={!token || loading}
                className="rounded-md bg-vireoka-indigo px-4 py-2 text-sm font-medium text-white hover:opacity-95 disabled:opacity-50"
              >
                {loading ? "Loading…" : "Load Requests"}
              </button>
            </div>

            {err ? (
              <div className="mt-3 rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
                {err}
              </div>
            ) : null}
          </div>

          <div className="p-5 overflow-auto">
            <table className="min-w-full text-sm">
              <thead className="text-xs text-neutral-500">
                <tr className="border-b border-vireoka-line">
                  <th className="py-2 text-left font-medium">Name</th>
                  <th className="py-2 text-left font-medium">Email</th>
                  <th className="py-2 text-left font-medium">Company</th>
                  <th className="py-2 text-left font-medium">Role</th>
                  <th className="py-2 text-left font-medium">Status</th>
                  <th className="py-2 text-left font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sorted.map((l) => (
                  <tr key={l.id} className="border-b border-vireoka-line">
                    <td className="py-3 pr-4">{l.full_name || "—"}</td>
                    <td className="py-3 pr-4">{l.email}</td>
                    <td className="py-3 pr-4">{l.company || "—"}</td>
                    <td className="py-3 pr-4">{l.investor_type || "—"}</td>
                    <td className="py-3 pr-4">
                      <span className={`inline-flex items-center rounded-full border px-2 py-0.5 ${badge(l.status)}`}>
                        {l.status}
                      </span>
                    </td>
                    <td className="py-3">
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => setStatus(l.id, "APPROVED")}
                          className="rounded-md border border-vireoka-line px-3 py-1.5 text-xs hover:bg-vireoka-ash"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => setStatus(l.id, "REVOKED")}
                          className="rounded-md border border-vireoka-line px-3 py-1.5 text-xs hover:bg-vireoka-ash"
                        >
                          Revoke
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {sorted.length === 0 ? (
                  <tr>
                    <td className="py-6 text-neutral-500" colSpan={6}>
                      No requests loaded yet.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </section>

        <aside className="rounded-2xl border border-vireoka-line bg-vireoka-ash p-6">
          <h2 className="text-base font-semibold text-vireoka-indigo">How this workflow works</h2>
          <ol className="mt-3 space-y-3 text-sm text-neutral-700 list-decimal list-inside">
            <li>User submits the request form → lead is stored as <span className="font-medium">NEW</span>.</li>
            <li>Admin marks lead <span className="font-medium">APPROVED</span> to enable NDA flow.</li>
            <li>User can sign NDA + accept terms → portal access checks pass.</li>
            <li>Admin can <span className="font-medium">REVOKE</span> any time for governance control.</li>
          </ol>
          <p className="mt-4 text-xs text-neutral-500">
            This dashboard does not expose internal implementation details. It only manages approval state.
          </p>
        </aside>
      </div>
    </main>
  );
}
