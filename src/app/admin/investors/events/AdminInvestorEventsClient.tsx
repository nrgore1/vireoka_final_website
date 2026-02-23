"use client";

import { useEffect, useState } from "react";

type Row = {
  id: number;
  email: string | null;
  event: string;
  path: string;
  ip: string | null;
  meta: any;
  created_at: string;
};

export default function AdminInvestorEventsClient() {
  const [email, setEmail] = useState("");
  const [rows, setRows] = useState<Row[]>([]);
  const [msg, setMsg] = useState<string | null>(null);

  async function load() {
    setMsg(null);
    const qs = email.trim() ? `?email=${encodeURIComponent(email.trim())}` : "";
    const res = await fetch(`/api/admin/intelligence/events${qs}`, { credentials: "include" }).catch(() => null);
    if (!res) return setMsg("Network error.");
    const data = await res.json().catch(() => null);
    if (!data?.ok) return setMsg("Unauthorized or error.");
    setRows(data.rows ?? []);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex gap-2 items-end">
        <label className="text-sm">
          <div className="text-gray-600">Filter by email (optional)</div>
          <input className="border rounded px-2 py-1 w-80" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="investor@firm.com" />
        </label>
        <button onClick={load} className="px-3 py-2 rounded bg-black text-white text-sm hover:opacity-90">
          Refresh
        </button>
      </div>

      {msg ? <div className="text-sm text-red-600">{msg}</div> : null}

      <div className="border rounded overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-2">Time</th>
              <th className="p-2">Email</th>
              <th className="p-2">Event</th>
              <th className="p-2">Path</th>
              <th className="p-2">IP</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-t">
                <td className="p-2 text-gray-600">{new Date(r.created_at).toLocaleString()}</td>
                <td className="p-2 font-mono">{r.email ?? "—"}</td>
                <td className="p-2">{r.event}</td>
                <td className="p-2 font-mono">{r.path}</td>
                <td className="p-2 font-mono">{r.ip ?? "—"}</td>
              </tr>
            ))}
            {rows.length === 0 ? (
              <tr>
                <td className="p-4 text-center text-gray-500" colSpan={5}>
                  No events yet
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
