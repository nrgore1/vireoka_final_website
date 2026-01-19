"use client";

import { useEffect, useState } from "react";

type Investor = {
  id: string;
  email: string;
  name: string;
  org: string;
  role: string;
  intent: string;
  status: string;
  ndaAcceptedAt: string | null;
  approvedAt: string | null;
  expiresAt: string | null;
  createdAt: string;
};

export default function InternalInvestorsAdminPage() {
  const [token, setToken] = useState("");
  const [rows, setRows] = useState<Investor[]>([]);
  const [msg, setMsg] = useState<string | null>(null);
  const [ttlDays, setTtlDays] = useState(30);

  async function load() {
    setMsg(null);
    const res = await fetch("/api/admin/investors", {
      headers: { "x-admin-token": token },
      cache: "no-store",
    }).catch(() => null);
    if (!res) return setMsg("Network error");
    const data = await res.json().catch(() => null);
    if (!res.ok || !data?.ok) return setMsg("Unauthorized or server error");
    setRows(data.investors || []);
  }

  async function action(email: string, kind: "approve" | "reject") {
    setMsg(null);
    const body: any = { action: kind, email };
    if (kind === "approve") body.ttlDays = ttlDays;

    const res = await fetch("/api/admin/investors", {
      method: "POST",
      headers: { "content-type": "application/json", "x-admin-token": token },
      body: JSON.stringify(body),
    }).catch(() => null);

    const data = await res?.json().catch(() => null);
    if (!res || !res.ok || !data?.ok) {
      setMsg("Action failed (check token, status, and NDA step).");
      return;
    }
    await load();
  }

  useEffect(() => {
    // no auto-load
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <div className="vk-pill">Internal</div>
        <h1 className="mt-3 text-3xl font-semibold">Investor approvals</h1>
        <p className="mt-2 text-sm" style={{ color: "var(--vk-muted)" }}>
          This page is for manual approvals. Set <code>VIREOKA_ADMIN_TOKEN</code> in your environment.
        </p>
      </div>

      <div className="vk-card p-6 grid gap-3 max-w-2xl">
        <label className="text-sm">
          <div style={{ color: "var(--vk-muted)" }}>Admin token</div>
          <input
            className="mt-1 w-full px-4 py-3 rounded-xl border"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            type="password"
            placeholder="VIREOKA_ADMIN_TOKEN"
            style={{ borderColor: "var(--vk-border)", background: "rgba(255,255,255,0.03)", color: "var(--vk-text)" }}
          />
        </label>

        <label className="text-sm">
          <div style={{ color: "var(--vk-muted)" }}>Approval TTL (days)</div>
          <input
            className="mt-1 w-full px-4 py-3 rounded-xl border"
            value={ttlDays}
            onChange={(e) => setTtlDays(parseInt(e.target.value || "30", 10))}
            type="number"
            min={1}
            max={60}
            style={{ borderColor: "var(--vk-border)", background: "rgba(255,255,255,0.03)", color: "var(--vk-text)" }}
          />
        </label>

        <button className="vk-btn vk-btn-primary" onClick={load} type="button">
          Load applications
        </button>

        {msg ? <div className="text-sm" style={{ color: "var(--vk-danger)" }}>{msg}</div> : null}
      </div>

      <div className="grid gap-4">
        {rows.map((r) => (
          <div key={r.id} className="vk-card p-6">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div>
                <div className="text-sm font-semibold">{r.email}</div>
                <div className="mt-1 text-sm" style={{ color: "var(--vk-muted)" }}>
                  {r.name} • {r.org} • {r.role}
                </div>
                <div className="mt-2 text-sm" style={{ color: "var(--vk-muted)" }}>{r.intent}</div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="vk-pill">{r.status}</span>
                  {r.ndaAcceptedAt ? <span className="vk-pill">NDA ✓</span> : <span className="vk-pill">NDA —</span>}
                  {r.expiresAt ? <span className="vk-pill">Expires {new Date(r.expiresAt).toLocaleDateString()}</span> : null}
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <button className="vk-btn vk-btn-primary" type="button" onClick={() => action(r.email, "approve")}>
                  Approve
                </button>
                <button className="vk-btn" type="button" onClick={() => action(r.email, "reject")}>
                  Reject
                </button>
              </div>
            </div>
          </div>
        ))}

        {!rows.length ? (
          <div className="text-sm" style={{ color: "var(--vk-muted)" }}>
            No rows loaded yet.
          </div>
        ) : null}
      </div>
    </div>
  );
}
