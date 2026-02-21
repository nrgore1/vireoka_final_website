"use client";

import { useEffect, useMemo, useState } from "react";

type AppRow = {
  id: string;
  email: string;
  investor_name: string | null;
  organization: string | null;
  status: string | null;
  reference_code: string | null;
  created_at: string | null;
  metadata?: any;
};

type RowState = {
  busy?: boolean;
  note?: string | null;
  error?: string | null;
};

function fmtDate(v: string | null) {
  if (!v) return "-";
  try {
    return new Date(v).toLocaleString();
  } catch {
    return v;
  }
}

export default function InboxClient() {
  const [status, setStatus] = useState("submitted");
  const [q, setQ] = useState("");
  const [rows, setRows] = useState<AppRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [globalMsg, setGlobalMsg] = useState<string | null>(null);
  const [rowState, setRowState] = useState<Record<string, RowState>>({});

  const filteredCount = useMemo(() => rows.length, [rows]);

  async function load() {
    setGlobalMsg(null);
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("status", status);
      if (q.trim()) params.set("q", q.trim());

      const res = await fetch(`/api/admin/investor-applications/session?${params.toString()}`, {
        cache: "no-store",
      });

      const data = await res.json().catch(() => null);
      if (!res.ok || !data?.ok) {
        setGlobalMsg(data?.error ?? "Failed to load applications");
        setRows([]);
        return;
      }
      setRows(data.applications || []);
    } catch (e: any) {
      setGlobalMsg(e?.message ?? "Network error");
    } finally {
      setLoading(false);
    }
  }

  async function act(id: string, action: "approve" | "reject" | "request_info" | "resend_nda") {
    setRowState((s) => ({ ...s, [id]: { busy: true, note: null, error: null } }));
    try {
      const res = await fetch("/api/admin/investor-applications/session", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ id, action }),
      });

      const data = await res.json().catch(() => null);
      if (!res.ok || !data?.ok) {
        setRowState((s) => ({ ...s, [id]: { busy: false, note: null, error: data?.error ?? "Action failed" } }));
        return;
      }

      const note =
        action === "approve"
          ? (data?.nda === "signwell" ? "Approved. NDA sent via SignWell." : "Approved. NDA sent (internal).")
          : action === "resend_nda"
          ? (data?.nda === "signwell" ? "Resent NDA via SignWell." : "Resent NDA (internal).")
          : action === "request_info"
          ? "Requested more info (email sent)."
          : "Rejected.";

      setRowState((s) => ({ ...s, [id]: { busy: false, note, error: null } }));
      await load();
    } catch (e: any) {
      setRowState((s) => ({ ...s, [id]: { busy: false, note: null, error: e?.message ?? "Network error" } }));
    }
  }

  function confirmReject(id: string) {
    const ok = confirm("Reject this application? This will move it to Rejected.");
    if (!ok) return;
    act(id, "reject");
  }

  function copy(text: string) {
    navigator.clipboard?.writeText(text).catch(() => {});
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Investor Inbox</h1>
          <p className="text-sm text-gray-600">
            Manage investor applications: request info, approve + NDA, reject, resend NDA.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 items-center">
          <select
            className="rounded-md border px-3 py-2 text-sm"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="submitted">Submitted</option>
            <option value="info_requested">Info requested</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="all">All</option>
          </select>

          <input
            className="rounded-md border px-3 py-2 text-sm"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search name/email/org"
          />

          <button
            className="rounded-md bg-black px-4 py-2 text-sm text-white disabled:opacity-60"
            onClick={load}
            disabled={loading}
            type="button"
          >
            {loading ? "Loading…" : `Refresh (${filteredCount})`}
          </button>
        </div>
      </div>

      {globalMsg ? (
        <div className="mt-4 rounded-md border bg-gray-50 px-4 py-3 text-sm">{globalMsg}</div>
      ) : null}

      <div className="mt-6 grid gap-3">
        {rows.length === 0 ? (
          <div className="rounded-md border px-4 py-8 text-sm text-gray-600">No applications found.</div>
        ) : (
          rows.map((r) => {
            const st = rowState[r.id] || {};
            const busy = Boolean(st.busy);

            return (
              <div key={r.id} className="rounded-lg border p-5">
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <div className="text-sm font-semibold break-all">{r.email}</div>
                      <button
                        type="button"
                        className="text-xs underline text-gray-600"
                        onClick={() => copy(r.email)}
                      >
                        copy
                      </button>

                      {r.reference_code ? (
                        <>
                          <span className="text-xs text-gray-400">•</span>
                          <span className="text-xs text-gray-600">ref</span>
                          <span className="text-xs font-mono break-all">{r.reference_code}</span>
                          <button
                            type="button"
                            className="text-xs underline text-gray-600"
                            onClick={() => copy(r.reference_code!)}
                          >
                            copy
                          </button>
                        </>
                      ) : null}
                    </div>

                    <div className="mt-1 text-sm text-gray-700">
                      {(r.investor_name || "-")} • {(r.organization || "-")}
                    </div>

                    <div className="mt-2 text-xs text-gray-500">
                      Status: {r.status || "-"} • Created: {fmtDate(r.created_at)}
                    </div>

                    {st.note ? (
                      <div className="mt-3 rounded-md border bg-green-50 px-3 py-2 text-sm text-green-900">
                        {st.note}
                      </div>
                    ) : null}

                    {st.error ? (
                      <div className="mt-3 rounded-md border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-900">
                        {st.error}
                      </div>
                    ) : null}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button
                      className="rounded-md border px-3 py-2 text-sm disabled:opacity-60"
                      onClick={() => act(r.id, "request_info")}
                      disabled={busy}
                      type="button"
                    >
                      {busy ? "Working…" : "Request info"}
                    </button>

                    <button
                      className="rounded-md border px-3 py-2 text-sm disabled:opacity-60"
                      onClick={() => confirmReject(r.id)}
                      disabled={busy}
                      type="button"
                    >
                      Reject
                    </button>

                    <button
                      className="rounded-md bg-black px-3 py-2 text-sm text-white disabled:opacity-60"
                      onClick={() => act(r.id, "approve")}
                      disabled={busy}
                      type="button"
                    >
                      Approve + Send NDA
                    </button>

                    <button
                      className="rounded-md border px-3 py-2 text-sm disabled:opacity-60"
                      onClick={() => act(r.id, "resend_nda")}
                      disabled={busy}
                      type="button"
                    >
                      Resend NDA
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </main>
  );
}
