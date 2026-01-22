"use client";

import { useEffect, useState } from "react";

type ReqRow = {
  id: string;
  email: string;
  name: string | null;
  firm: string | null;
  message: string | null;
  status: string;
  created_at: string;
};

export default function InvestorRequestsPage() {
  const [adminToken, setAdminToken] = useState("");
  const [rows, setRows] = useState<ReqRow[]>([]);
  const [msg, setMsg] = useState<string | null>(null);

  async function load() {
    setMsg(null);
    const res = await fetch("/api/admin/investors/requests/list", {
      headers: { "x-admin-token": adminToken },
    });
    const data = await res.json();
    if (!res.ok) return setMsg(`Error: ${data.error || "Unknown"}`);
    setRows(data.rows || []);
  }

  async function approveInvite(r: ReqRow) {
    setMsg(null);
    const res = await fetch("/api/admin/investors/approve", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-admin-token": adminToken,
      },
      body: JSON.stringify({ requestId: r.id, email: r.email }),
    });
    const data = await res.json();
    if (!res.ok) return setMsg(`Error: ${data.error || "Unknown"}`);
    setMsg(`Approved & invited: ${r.email}`);
    await load();
  }

  useEffect(() => {}, []);

  return (
    <div className="max-w-6xl space-y-6">
      <h1 className="text-2xl font-semibold">Investor Access Requests</h1>

      <div className="rounded-xl border p-4 space-y-3">
        <label className="block text-sm font-medium">Admin Token</label>
        <input
          className="w-full rounded border px-3 py-2"
          value={adminToken}
          onChange={(e) => setAdminToken(e.target.value)}
          placeholder="INVESTOR_ADMIN_TOKEN"
        />
        <button className="rounded bg-black px-4 py-2 text-white" onClick={load}>
          Load requests
        </button>
        {msg && <p className="text-sm text-neutral-700">{msg}</p>}
      </div>

      <div className="overflow-auto rounded border">
        <table className="w-full text-sm">
          <thead className="bg-neutral-50">
            <tr>
              <th className="p-2 text-left">Email</th>
              <th className="p-2 text-left">Name</th>
              <th className="p-2 text-left">Firm</th>
              <th className="p-2 text-left">Message</th>
              <th className="p-2 text-left">Status</th>
              <th className="p-2 text-left">Requested</th>
              <th className="p-2 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-t">
                <td className="p-2">{r.email}</td>
                <td className="p-2">{r.name || "-"}</td>
                <td className="p-2">{r.firm || "-"}</td>
                <td className="p-2">{r.message || "-"}</td>
                <td className="p-2">{r.status}</td>
                <td className="p-2">{r.created_at}</td>
                <td className="p-2">
                  {r.status === "pending" ? (
                    <button
                      className="rounded bg-black px-3 py-1 text-white"
                      onClick={() => approveInvite(r)}
                    >
                      Approve & Invite
                    </button>
                  ) : (
                    <span className="text-neutral-500">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
