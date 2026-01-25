"use client";

import { useEffect, useState } from "react";

export default function AdminInvestors() {
  const [investors, setInvestors] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);

  async function load() {
    const inv = await fetch("/api/admin/investors").then((r) => r.json());
    const s = await fetch("/api/admin/investors/analytics").then((r) => r.json());
    setInvestors(inv);
    setStats(s);
  }

  useEffect(() => { load(); }, []);

  async function approve(email: string) {
    await fetch("/api/admin/investors/approve", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    await load();
    alert("Approved and invite sent.");
  }

  return (
    <main style={{ padding: 40 }}>
      <h1>Investor Requests</h1>

      {stats && (
        <p>
          Total: <strong>{stats.total}</strong> · Approved: <strong>{stats.approved}</strong> · NDA accepted: <strong>{stats.ndaAccepted}</strong>
        </p>
      )}

      <div style={{ marginTop: 16 }}>
        {investors.map((i) => (
          <div key={i.email} style={{ padding: 12, borderBottom: "1px solid #eee" }}>
            <div><strong>{i.full_name || "-"}</strong></div>
            <div>{i.email}</div>
            <div>{i.role || "-"} · {i.firm || "-"}</div>
            <div>
              Approved: {i.approved_at ? "Yes" : "No"} · NDA: {i.nda_accepted_at ? "Yes" : "No"}
            </div>

            {!i.approved_at && (
              <button style={{ marginTop: 8 }} onClick={() => approve(i.email)}>
                Approve & Send Invite
              </button>
            )}
          </div>
        ))}
      </div>
    </main>
  );
}
