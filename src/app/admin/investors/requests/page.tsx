"use client";

import { useEffect, useMemo, useState } from "react";

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
const [rows, setRows] = useState<ReqRow[]>([]);
const [msg, setMsg] = useState<string | null>(null);
const [q, setQ] = useState("");

async function load() {
setMsg(null);
const res = await fetch("/api/admin/investors/requests/list");
const data = await res.json().catch(() => ({}));
if (!res.ok) return setMsg(Error: ${data.error || "Unknown"});
setRows(data.requests || data.rows || []);
}

async function approveInvite(r: ReqRow) {
setMsg(null);
const res = await fetch("/api/admin/investors/approve", {
method: "POST",
headers: { "content-type": "application/json" },
body: JSON.stringify({ email: r.email }),
});
const data = await res.json().catch(() => ({}));
if (!res.ok) return setMsg(Approve failed: ${data.error || "Unknown"});
setMsg(Approved + invited: ${r.email});
await load();
}

async function reject(r: ReqRow) {
setMsg(null);
const res = await fetch("/api/admin/investors/reject", {
method: "POST",
headers: { "content-type": "application/json" },
body: JSON.stringify({ email: r.email }),
});
const data = await res.json().catch(() => ({}));
if (!res.ok) return setMsg(Reject failed: ${data.error || "Unknown"});
setMsg(Rejected: ${r.email});
await load();
}

useEffect(() => {
load();
}, []);

const filtered = useMemo(() => {
const s = q.trim().toLowerCase();
if (!s) return rows;
return rows.filter((r) => {
const blob = ${r.email} ${r.name ?? ""} ${r.firm ?? ""} ${r.status ?? ""}.toLowerCase();
return blob.includes(s);
});
}, [rows, q]);

return (
<div className="space-y-4">
<div className="flex items-end justify-between gap-4">
<div>
<h1 className="text-xl font-semibold">Investor Requests</h1>
<p className="text-sm text-slate-500">
People who submitted the investor form. Approve sends an invite token email; reject closes the request.
</p>
</div>
<button className="rounded-xl border bg-white px-3 py-2 text-sm hover:bg-slate-50" onClick={load} >
Refresh
</button>
</div>

  <div className="flex items-center gap-3">
    <input
      className="w-full rounded-xl border bg-white px-3 py-2 text-sm"
      placeholder="Search by email / name / firm / status…"
      value={q}
      onChange={(e) => setQ(e.target.value)}
    />
  </div>

  {msg && (
    <div className="rounded-xl border bg-white p-3 text-sm">
      {msg}
    </div>
  )}

  <div className="rounded-2xl border bg-white overflow-hidden">
    <div className="grid grid-cols-12 gap-2 border-b bg-slate-50 px-4 py-2 text-xs font-medium text-slate-600">
      <div className="col-span-4">Email</div>
      <div className="col-span-2">Name</div>
      <div className="col-span-2">Firm</div>
      <div className="col-span-2">Status</div>
      <div className="col-span-2 text-right">Actions</div>
    </div>

    {filtered.map((r) => (
      <div key={r.id} className="grid grid-cols-12 gap-2 px-4 py-3 border-b last:border-b-0 text-sm">
        <div className="col-span-4 font-medium">{r.email}</div>
        <div className="col-span-2 text-slate-700">{r.name ?? "—"}</div>
        <div className="col-span-2 text-slate-700">{r.firm ?? "—"}</div>
        <div className="col-span-2">
          <span className="text-xs rounded bg-slate-100 px-2 py-1">{r.status ?? "pending"}</span>
        </div>
        <div className="col-span-2 flex justify-end gap-2">
          <button
            className="rounded-lg bg-emerald-600 text-white px-3 py-1.5 text-xs hover:bg-emerald-700"
            onClick={() => approveInvite(r)}
          >
            Approve
          </button>
          <button
            className="rounded-lg border px-3 py-1.5 text-xs hover:bg-slate-50"
            onClick={() => reject(r)}
          >
            Reject
          </button>
        </div>
      </div>
    ))}

    {!filtered.length && (
      <div className="p-6 text-sm text-slate-500">No requests found.</div>
    )}
  </div>
</div>


);
}
