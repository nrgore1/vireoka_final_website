"use client";

import { useEffect, useState } from "react";

export default function AdminInvestorRequestsPage() {
  const [rows, setRows] = useState<any[]>([]);
  const [msg, setMsg] = useState<string>("");

  async function load() {
    setMsg("");
    const res = await fetch("/api/admin/intelligence/requests/list");
    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      return setMsg(`Error: ${data?.error || "Unknown"}`);
    }

    setRows(data.requests || data.rows || []);
  }

  useEffect(() => {
    load().catch((e) => setMsg(`Error: ${String(e?.message || e)}`));
  }, []);

  return (
    <div style={{ padding: 24, fontFamily: "system-ui" }}>
      <h2>Investor Requests</h2>
      {msg ? <div style={{ color: "crimson", marginBottom: 12 }}>{msg}</div> : null}

      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              {["Created", "Email", "Name", "Kind", "Status", "Reference"].map((h) => (
                <th key={h} style={{ textAlign: "left", padding: 8, borderBottom: "1px solid #ddd" }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, idx) => (
              <tr key={r.id || idx}>
                <td style={{ padding: 8, borderBottom: "1px solid #f0f0f0" }}>{r.created_at || ""}</td>
                <td style={{ padding: 8, borderBottom: "1px solid #f0f0f0" }}>{r.email || ""}</td>
                <td style={{ padding: 8, borderBottom: "1px solid #f0f0f0" }}>{r.full_name || ""}</td>
                <td style={{ padding: 8, borderBottom: "1px solid #f0f0f0" }}>{r.kind || ""}</td>
                <td style={{ padding: 8, borderBottom: "1px solid #f0f0f0" }}>{r.status || ""}</td>
                <td style={{ padding: 8, borderBottom: "1px solid #f0f0f0", fontFamily: "monospace", fontSize: 11 }}>
                  {r.reference_code || r.id || ""}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
