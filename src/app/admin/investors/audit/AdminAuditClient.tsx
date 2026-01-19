"use client";

import { useEffect, useMemo, useState } from "react";

type AuditRow = {
  id: number;
  email: string;
  action: string;
  meta?: any;
  createdAt: string;
};

export default function AdminAuditClient() {
  const [rows, setRows] = useState<AuditRow[]>([]);
  const [filter, setFilter] = useState<string>("ALL");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/investors/audit", { credentials: "include" })
      .then((r) => r.json())
      .then((d) => setRows(d.rows ?? []))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    if (filter === "ALL") return rows;
    return rows.filter((r) => r.action === filter);
  }, [rows, filter]);

  function exportCsv() {
    const header = ["id", "email", "action", "createdAt"];
    const lines = filtered.map((r) =>
      [r.id, r.email, r.action, r.createdAt].join(",")
    );
    const csv = [header.join(","), ...lines].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "investor-audit.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  if (loading) {
    return <div className="text-sm text-gray-500">Loading audit log…</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <select
          className="border rounded px-2 py-1 text-sm"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="ALL">All actions</option>
          <option value="APPLIED">Applied</option>
          <option value="APPROVED">Approved</option>
          <option value="REVOKED">Revoked</option>
          <option value="EXPIRED">Expired</option>
          <option value="NDA_ACCEPTED">NDA accepted</option>
        </select>

        <button
          onClick={exportCsv}
          className="text-sm px-3 py-1 rounded bg-black text-white hover:opacity-90"
        >
          Export CSV
        </button>
      </div>

      <div className="overflow-x-auto border rounded">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-2">Email</th>
              <th className="p-2">Action</th>
              <th className="p-2">Time</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => (
              <tr key={r.id} className="border-t">
                <td className="p-2 font-mono">{r.email}</td>
                <td className="p-2">{r.action}</td>
                <td className="p-2 text-gray-600">
                  {new Date(r.createdAt).toLocaleString()}
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={3} className="p-4 text-center text-gray-500">
                  No entries
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
