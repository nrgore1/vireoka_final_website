"use client";

import { useEffect, useMemo, useState } from "react";

type Investor = {
  email: string;
  status: string;
  approvedAt?: string;
  expiresAt?: string;
  ndaAcceptedAt?: string;
  deletedAt?: string;
};

export default function AdminInvestorsClient() {
  const [rows, setRows] = useState<Investor[]>([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState<string | null>(null);

  const [ttlDays, setTtlDays] = useState(30);
  const [filter, setFilter] = useState<"ALL" | "PENDING" | "APPROVED" | "REVOKED" | "DELETED">("ALL");
  const [q, setQ] = useState("");

  async function load() {
    setLoading(true);
    setMsg(null);
    try {
      const res = await fetch("/api/admin/investors", { credentials: "include" });
      const data = await res.json();
      if (!data?.ok) throw new Error("Unauthorized");
      setRows(data.investors || []);
    } catch (e: any) {
      setMsg(e?.message || "Failed to load");
    } finally {
      setLoading(false);
    }
  }

  async function approve(email: string) {
    await fetch("/api/admin/investors", {
      method: "POST",
      credentials: "include",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email, ttlDays }),
    });
    load();
  }

  async function revoke(email: string) {
    const reason = prompt("Reason for revoke (optional):") || undefined;
    await fetch("/api/admin/investors", {
      method: "PATCH",
      credentials: "include",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email, reason }),
    });
    load();
  }

  async function restore(email: string) {
    await fetch("/api/admin/investors", {
      method: "PUT",
      credentials: "include",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email }),
    });
    load();
  }

  async function softDelete(email: string) {
    if (!confirm(`Soft-delete ${email}? This revokes access and hides from default views.`)) return;
    await fetch("/api/admin/investors", {
      method: "DELETE",
      credentials: "include",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email }),
    });
    load();
  }

  useEffect(() => {
    load();
  }, []);

  const visible = useMemo(() => {
    const t = q.trim().toLowerCase();
    return rows.filter((r) => {
      if (t && !r.email.toLowerCase().includes(t)) return false;
      if (filter === "ALL") return true;
      if (filter === "PENDING") return r.status.startsWith("PENDING");
      if (filter === "APPROVED") return r.status === "APPROVED";
      if (filter === "REVOKED") return r.status === "REVOKED" || r.status === "EXPIRED";
      if (filter === "DELETED") return !!r.deletedAt;
      return true;
    });
  }, [rows, filter, q]);

  if (loading) return <div>Loading…</div>;
  if (msg) return <div className="text-red-600">{msg}</div>;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <input
          className="border rounded px-3 py-2 text-sm w-full max-w-xs"
          placeholder="Search email…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <select className="border rounded px-3 py-2 text-sm" value={filter} onChange={(e) => setFilter(e.target.value as any)}>
          <option value="ALL">All</option>
          <option value="PENDING">Pending</option>
          <option value="APPROVED">Approved</option>
          <option value="REVOKED">Revoked/Expired</option>
          <option value="DELETED">Soft-deleted</option>
        </select>

        <label className="text-sm flex items-center gap-2">
          TTL (days)
          <input
            type="number"
            className="border rounded px-2 py-1 text-sm w-20"
            value={ttlDays}
            onChange={(e) => setTtlDays(Number(e.target.value))}
          />
        </label>

        <a className="text-sm underline underline-offset-4" href="/admin/investors/audit">
          View audit log →
        </a>

        <button className="border rounded px-3 py-2 text-sm" onClick={load}>
          Refresh
        </button>
      </div>

      <table className="w-full border text-sm">
        <thead>
          <tr className="bg-neutral-100">
            <th className="p-2 text-left">Email</th>
            <th className="p-2">Status</th>
            <th className="p-2 text-left">Dates</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {visible.map((r) => (
            <tr key={r.email} className="border-t">
              <td className="p-2">
                <div className="font-medium">{r.email}</div>
                {r.deletedAt ? <div className="text-xs text-red-700">Soft-deleted</div> : null}
              </td>
              <td className="p-2 text-center">{r.status}</td>
              <td className="p-2 text-neutral-600">
                <div className="text-xs">NDA: {r.ndaAcceptedAt ? new Date(r.ndaAcceptedAt).toLocaleString() : "—"}</div>
                <div className="text-xs">Approved: {r.approvedAt ? new Date(r.approvedAt).toLocaleString() : "—"}</div>
                <div className="text-xs">Expires: {r.expiresAt ? new Date(r.expiresAt).toLocaleString() : "—"}</div>
              </td>
              <td className="p-2 text-center space-x-2">
                <button className="px-3 py-1 border rounded" disabled={r.status === "APPROVED"} onClick={() => approve(r.email)}>
                  Approve
                </button>
                <button className="px-3 py-1 border rounded" onClick={() => revoke(r.email)}>
                  Revoke
                </button>
                <button className="px-3 py-1 border rounded" onClick={() => restore(r.email)}>
                  Restore
                </button>
                <button className="px-3 py-1 border rounded" onClick={() => softDelete(r.email)}>
                  Soft-delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
