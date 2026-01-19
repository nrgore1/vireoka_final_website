"use client";

import { useEffect, useMemo, useState } from "react";

type AuditRow = {
  email: string;
  action: string;
  at: string;
  meta?: Record<string, any>;
};

export default function AdminAuditClient() {
  const [rows, setRows] = useState<AuditRow[]>([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setMsg(null);
    try {
      const res = await fetch("/api/admin/investors/audit", {
        credentials: "include",
      });
      const data = await res.json();
      if (!data?.ok) throw new Error("Unauthorized");
      setRows(data.audit || []);
    } catch (e: any) {
      setMsg(e?.message || "Failed to load audit log");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return rows;
    return rows.filter(
      (r) =>
        r.email.toLowerCase().includes(t) ||
        r.action.toLowerCase().includes(t)
    );
  }, [q, rows]);

  if (loading) return <div>Loading…</div>;
  if (msg) return <div className="text-red-600">{msg}</div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <input
          className="border rounded px-3 py-2 text-sm w-full max-w-md"
          placeholder="Search email or action…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <button className="border rounded px-3 py-2 text-sm" onClick={load}>
          Refresh
        </button>
      </div>

      <table className="w-full border text-sm">
        <thead>
          <tr className="bg-neutral-100">
            <th className="p-2 text-left">When</th>
            <th className="p-2 text-left">Email</th>
            <th className="p-2">Action</th>
            <th className="p-2 text-left">Meta</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((r, idx) => (
            <tr key={`${r.email}-${r.at}-${idx}`} className="border-t">
              <td className="p-2 whitespace-nowrap">
                {new Date(r.at).toLocaleString()}
              </td>
              <td className="p-2">{r.email}</td>
              <td className="p-2 text-center">{r.action}</td>
              <td className="p-2 text-neutral-600">
                {r.meta ? (
                  <pre className="text-xs whitespace-pre-wrap">
                    {JSON.stringify(r.meta, null, 2)}
                  </pre>
                ) : (
                  "—"
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
