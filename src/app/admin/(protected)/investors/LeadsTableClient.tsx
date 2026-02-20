"use client";

import { useMemo, useState } from "react";

type Lead = {
  id: string;
  kind: string;
  status: "NEW" | "CONTACTED" | "QUALIFIED" | string;
  full_name: string;
  email: string;
  company: string | null;
  message: string | null;
  ip: string | null;
  created_at: string;
};

export default function LeadsTableClient({ leads }: { leads: Lead[] }) {
  const [query, setQuery] = useState("");
  const [statusMap, setStatusMap] = useState<Record<string, string>>(
    () => Object.fromEntries(leads.map((l) => [l.id, l.status ?? "NEW"]))
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return leads;
    return leads.filter((l) => {
      return (
        (l.full_name ?? "").toLowerCase().includes(q) ||
        (l.email ?? "").toLowerCase().includes(q) ||
        (l.company ?? "").toLowerCase().includes(q) ||
        (l.kind ?? "").toLowerCase().includes(q) ||
        (l.status ?? "").toLowerCase().includes(q)
      );
    });
  }, [leads, query]);

  async function updateLeadStatus(id: string, status: string) {
    // optimistic UI
    setStatusMap((m) => ({ ...m, [id]: status }));

    const res = await fetch("/api/admin/investors/status", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });

    if (!res.ok) {
      const j = await res.json().catch(() => null);
      alert("Failed to update: " + (j?.error || res.status));
      // revert on failure
      const original = leads.find((x) => x.id === id)?.status ?? "NEW";
      setStatusMap((m) => ({ ...m, [id]: original }));
    }
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center" }}>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search name, email, company, kind, status…"
            style={{ padding: 10, border: "1px solid #ccc", borderRadius: 10, minWidth: 320 }}
          />
          <div style={{ fontSize: 12, opacity: 0.7 }}>
            Showing {filtered.length} / {leads.length}
          </div>
        </div>

        <a
          href="/api/admin/investors/export"
          style={{ padding: "8px 12px", border: "1px solid #ccc", borderRadius: 10, textDecoration: "none" }}
        >
          Export CSV
        </a>
      </div>

      <div style={{ overflowX: "auto", marginTop: 12 }}>
        <table style={{ borderCollapse: "collapse", width: "100%" }}>
          <thead>
            <tr>
              {["Created", "Status", "Kind", "Name", "Email", "Company", "Message", "IP", "ID"].map((h) => (
                <th key={h} style={{ textAlign: "left", padding: 8, borderBottom: "1px solid #ddd" }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((l) => (
              <tr key={l.id}>
                <td style={{ padding: 8, borderBottom: "1px solid #f0f0f0", whiteSpace: "nowrap" }}>
                  {new Date(l.created_at).toLocaleString()}
                </td>

                <td style={{ padding: 8, borderBottom: "1px solid #f0f0f0" }}>
                  <select
                    value={statusMap[l.id] ?? "NEW"}
                    onChange={(e) => updateLeadStatus(l.id, e.target.value)}
                    style={{ padding: 6, borderRadius: 8 }}
                  >
                    <option value="NEW">NEW</option>
                    <option value="CONTACTED">CONTACTED</option>
                    <option value="QUALIFIED">QUALIFIED</option>
                  </select>
                </td>

                <td style={{ padding: 8, borderBottom: "1px solid #f0f0f0" }}>{l.kind}</td>
                <td style={{ padding: 8, borderBottom: "1px solid #f0f0f0" }}>{l.full_name}</td>
                <td style={{ padding: 8, borderBottom: "1px solid #f0f0f0" }}>{l.email}</td>
                <td style={{ padding: 8, borderBottom: "1px solid #f0f0f0" }}>{l.company ?? ""}</td>

                <td style={{ padding: 8, borderBottom: "1px solid #f0f0f0", maxWidth: 420 }}>
                  <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {l.message ?? ""}
                  </div>
                </td>

                <td style={{ padding: 8, borderBottom: "1px solid #f0f0f0" }}>{l.ip ?? ""}</td>

                <td style={{ padding: 8, borderBottom: "1px solid #f0f0f0", fontFamily: "monospace", fontSize: 11 }}>
                  {l.id}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
