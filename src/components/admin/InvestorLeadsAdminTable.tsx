"use client";

import { useState } from "react";

type Lead = {
  id: string;
  full_name: string;
  email: string;
  company: string;
  investor_type: string | null;
  reference_code: string;
  status: "NEW" | "APPROVED" | "REVOKED";
};

export function InvestorLeadsAdminTable({ initialLeads }: { initialLeads: Lead[] }) {
  const [leads, setLeads] = useState<Lead[]>(initialLeads || []);
  const [err, setErr] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  async function refresh() {
    const r = await fetch("/api/admin/investor-leads", { cache: "no-store" });
    const j = await r.json().catch(() => ({}));
    if (!r.ok || !j?.ok) {
      setErr(j?.error || "Failed to load leads.");
      return;
    }
    setLeads(j.leads || []);
  }

  async function setStatus(id: string, status: "NEW" | "APPROVED" | "REVOKED") {
    setErr(null);
    setBusyId(id);
    try {
      const r = await fetch("/api/admin/investor-leads/status", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      const j = await r.json().catch(() => ({}));
      if (!r.ok || !j?.ok) {
        setErr(j?.error || "Failed to update status.");
        return;
      }
      await refresh();
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="mt-8 overflow-hidden rounded-2xl border border-vireoka-line bg-white shadow-sm">
      <div className="px-6 py-4 border-b border-vireoka-line flex items-center justify-between">
        <p className="font-medium text-neutral-900">Investor leads</p>
        <button className="text-sm underline" onClick={refresh} type="button">
          Refresh
        </button>
      </div>

      {err ? (
        <div className="px-6 py-3 text-sm text-red-800 bg-red-50 border-b border-red-200">{err}</div>
      ) : null}

      <div className="divide-y divide-vireoka-line">
        {leads.map((lead) => (
          <div key={lead.id} className="px-6 py-4 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-neutral-900">
                {lead.full_name} <span className="font-normal text-neutral-500">({lead.email})</span>
              </p>
              <p className="text-xs text-neutral-600">
                {lead.company || "—"} · role: {lead.investor_type || "—"} · ref:{" "}
                <span className="font-mono">{lead.reference_code}</span>
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs rounded-full border border-vireoka-line bg-vireoka-ash px-3 py-1">
                {lead.status}
              </span>

              <button
                disabled={busyId === lead.id || lead.status === "NEW"}
                className="rounded-md border border-vireoka-line bg-white px-3 py-1.5 text-xs font-semibold disabled:opacity-50"
                onClick={() => setStatus(lead.id, "NEW")}
                type="button"
              >
                Mark NEW
              </button>

              <button
                disabled={busyId === lead.id || lead.status === "APPROVED"}
                className="rounded-md border border-vireoka-line bg-white px-3 py-1.5 text-xs font-semibold text-vireoka-indigo disabled:opacity-50"
                onClick={() => setStatus(lead.id, "APPROVED")}
                type="button"
              >
                Approve
              </button>

              <button
                disabled={busyId === lead.id || lead.status === "REVOKED"}
                className="rounded-md border border-vireoka-line bg-white px-3 py-1.5 text-xs font-semibold text-red-700 disabled:opacity-50"
                onClick={() => setStatus(lead.id, "REVOKED")}
                type="button"
              >
                Revoke
              </button>
            </div>
          </div>
        ))}

        {leads.length === 0 ? (
          <div className="px-6 py-10 text-sm text-neutral-600">No requests yet.</div>
        ) : null}
      </div>
    </div>
  );
}
