"use client";

import { useEffect, useState } from "react";

type Lead = {
  id: string;
  full_name: string;
  email: string;
  company: string;
  investor_type: string | null;
  reference_code: string;
  status: "NEW" | "APPROVED" | "REVOKED";
  created_at: string;
  updated_at: string;
};

export default function AdminInvestorLeadsPage() {
  const [token, setToken] = useState("");
  const [leads, setLeads] = useState<Lead[]>([]);
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const t = localStorage.getItem("vireoka_admin_token") || "";
    setToken(t);
  }, []);

  async function load() {
    setErr(null);
    setBusy(true);
    try {
      const res = await fetch("/api/admin/investor-leads", {
        headers: { "x-admin-token": token },
      });
      const data = await res.json().catch(() => null);
      if (!res.ok || !data?.ok) {
        setErr(data?.error || "Unauthorized or failed to load leads.");
        setLeads([]);
        return;
      }
      setLeads(data.leads || []);
    } finally {
      setBusy(false);
    }
  }

  async function setStatus(id: string, status: "APPROVED" | "REVOKED") {
    setErr(null);
    const res = await fetch("/api/admin/investor-leads/status", {
      method: "POST",
      headers: { "content-type": "application/json", "x-admin-token": token },
      body: JSON.stringify({ id, status }),
    });
    const data = await res.json().catch(() => null);
    if (!res.ok || !data?.ok) {
      setErr(data?.error || "Failed to update status.");
      return;
    }
    await load();
  }

  return (
    <main className="mx-auto max-w-6xl px-4 sm:px-6 py-10">
      <h1 className="text-2xl font-semibold text-vireoka-indigo">Admin · Investor Leads</h1>
      <p className="mt-2 text-sm text-neutral-700">
        Approve or revoke access requests. Only APPROVED users can proceed to NDA and portal materials.
      </p>

      <div className="mt-6 rounded-2xl border border-vireoka-line bg-white p-5 shadow-sm">
        <label className="block text-sm font-medium text-neutral-800">
          Admin token (stored in your browser)
        </label>
        <div className="mt-2 flex flex-col sm:flex-row gap-3">
          <input
            value={token}
            onChange={(e) => setToken(e.target.value)}
            className="w-full rounded-md border border-vireoka-line px-3 py-2 text-sm"
            placeholder="Paste ADMIN_TOKEN_VALUE here"
          />
          <button
            className="rounded-md bg-vireoka-indigo px-4 py-2 text-sm font-semibold text-white"
            onClick={() => {
              localStorage.setItem("vireoka_admin_token", token);
              load();
            }}
          >
            Save & Load
          </button>
        </div>

        {err ? (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
            {err}
          </div>
        ) : null}

        <div className="mt-5 overflow-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-neutral-600">
              <tr className="border-b border-vireoka-line">
                <th className="py-2 pr-4">Name</th>
                <th className="py-2 pr-4">Email</th>
                <th className="py-2 pr-4">Company</th>
                <th className="py-2 pr-4">Role</th>
                <th className="py-2 pr-4">Status</th>
                <th className="py-2 pr-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((l) => (
                <tr key={l.id} className="border-b border-vireoka-line">
                  <td className="py-2 pr-4">{l.full_name}</td>
                  <td className="py-2 pr-4">{l.email}</td>
                  <td className="py-2 pr-4">{l.company}</td>
                  <td className="py-2 pr-4">{l.investor_type || "-"}</td>
                  <td className="py-2 pr-4">{l.status}</td>
                  <td className="py-2 pr-4">
                    <div className="flex flex-wrap gap-2">
                      <button
                        disabled={busy || l.status === "APPROVED"}
                        className="rounded-md border border-vireoka-line bg-white px-3 py-1.5 text-xs font-semibold text-vireoka-indigo disabled:opacity-50"
                        onClick={() => setStatus(l.id, "APPROVED")}
                      >
                        Approve
                      </button>
                      <button
                        disabled={busy || l.status === "REVOKED"}
                        className="rounded-md border border-vireoka-line bg-white px-3 py-1.5 text-xs font-semibold text-red-700 disabled:opacity-50"
                        onClick={() => setStatus(l.id, "REVOKED")}
                      >
                        Revoke
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {leads.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-4 text-neutral-600">
                    No leads loaded.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
