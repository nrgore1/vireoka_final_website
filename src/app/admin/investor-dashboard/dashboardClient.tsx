"use client";

import { useEffect, useMemo, useState } from "react";

type PendingExt = {
  id: string;
  email: string;
  requested_until: string;
  reason: string | null;
  status: "pending";
  created_at: string;
};

type Row = {
  application_id: string;
  reference_code: string | null;
  email: string;
  investor_name: string | null;
  organization: string | null;
  application_status: string;
  application_created_at: string;

  nda_email_sent_at: string | null;

  access_approved: boolean;
  access_expires_at: string | null;
  days_outstanding: number | null;

  nda_signed: boolean;
  nda_signed_at: string | null;

  invited_at: string | null;
  last_access: string | null;

  pending_extension_request: PendingExt | null;
};

function fmtDate(v: string | null) {
  if (!v) return "—";
  try {
    return new Date(v).toLocaleString();
  } catch {
    return v;
  }
}

function pill(text: string, bg: string, fg: string) {
  return (
    <span
      style={{
        display: "inline-block",
        padding: "2px 8px",
        borderRadius: 999,
        background: bg,
        color: fg,
        fontSize: 12,
        fontWeight: 700,
      }}
    >
      {text}
    </span>
  );
}

export default function DashboardClient() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("all");
  const [q, setQ] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);

  const url = useMemo(() => {
    const sp = new URLSearchParams();
    sp.set("status", status);
    if (q.trim()) sp.set("q", q.trim());
    return `/api/admin/investor-dashboard?${sp.toString()}`;
  }, [status, q]);

  async function load() {
    setLoading(true);
    try {
      const r = await fetch(url, { cache: "no-store" });
      const j = await r.json();
      setRows(j.rows || []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [url]);

  async function approveExtension(requestId: string) {
    await fetch("/api/admin/investor-dashboard", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ action: "approve_extension", request_id: requestId }),
    });
    await load();
  }

  async function rejectExtension(requestId: string) {
    await fetch("/api/admin/investor-dashboard", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ action: "reject_extension", request_id: requestId }),
    });
    await load();
  }

  // ---- Admin actions (existing endpoint) ----
  async function adminAction(applicationId: string, action: "approve" | "resend_nda" | "request_info" | "reject") {
    setBusyId(applicationId);
    try {
      const r = await fetch("/api/admin/investor-applications/session", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ id: applicationId, action }),
      });
      const j = await r.json().catch(() => null);

      if (!r.ok || j?.ok === false) {
        const msg = j?.error || `Action failed: ${action}`;
        alert(msg);
      } else {
        // Optional: show note from backend (e.g., "NDA already sent; skipped resend.")
        if (j?.note) alert(String(j.note));
      }
    } finally {
      setBusyId(null);
      await load();
    }
  }

  const cell: React.CSSProperties = { padding: 10, verticalAlign: "top" };
  const header: React.CSSProperties = { padding: 10, fontWeight: 700 };

  function statusChip(s: string) {
    const v = String(s || "").toLowerCase();
    if (v === "submitted") return pill("submitted", "#FEF3C7", "#92400E");
    if (v === "approved") return pill("approved", "#D1FAE5", "#065F46");
    if (v === "rejected") return pill("rejected", "#FEE2E2", "#991B1B");
    if (v === "info_requested") return pill("info requested", "#DBEAFE", "#1E40AF");
    return pill(v || "unknown", "#E5E7EB", "#111827");
  }

  function canShowApprove(r: Row) {
    const s = String(r.application_status || "").toLowerCase();
    return s === "submitted" || s === "info_requested";
  }
  function canShowReject(r: Row) {
    const s = String(r.application_status || "").toLowerCase();
    return s === "submitted" || s === "info_requested";
  }
  function canShowRequestInfo(r: Row) {
    const s = String(r.application_status || "").toLowerCase();
    return s === "submitted";
  }
  function canShowResend(r: Row) {
    const s = String(r.application_status || "").toLowerCase();
    return s === "approved" || s === "submitted" || s === "info_requested";
  }

  function btnStyle(kind: "primary" | "secondary" | "danger", disabled?: boolean): React.CSSProperties {
    const base: React.CSSProperties = {
      padding: "6px 10px",
      borderRadius: 10,
      fontWeight: 700,
      cursor: disabled ? "not-allowed" : "pointer",
      opacity: disabled ? 0.6 : 1,
      border: "1px solid transparent",
      background: "white",
      color: "#111827",
      fontSize: 13,
      lineHeight: "16px",
      whiteSpace: "nowrap",
    };

    if (kind === "primary") {
      base.background = "#111827";
      base.border = "1px solid #111827";
      base.color = "white";
    }
    if (kind === "secondary") {
      base.border = "1px solid #D1D5DB";
      base.background = "white";
      base.color = "#111827";
    }
    if (kind === "danger") {
      base.border = "1px solid #FCA5A5";
      base.background = "#FEF2F2";
      base.color = "#991B1B";
    }
    return base;
  }

  return (
    <div>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 12 }}>
        <select value={status} onChange={(e) => setStatus(e.target.value)} style={{ padding: 8 }}>
          <option value="all">All</option>
          <option value="submitted">Submitted</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
          <option value="info_requested">Info requested</option>
        </select>

        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search name/email/org"
          style={{ padding: 8, minWidth: 280 }}
        />

        <button onClick={load} style={{ padding: "8px 12px" }}>
          Refresh
        </button>
      </div>

      {loading ? (
        <div>Loading…</div>
      ) : (
        <div style={{ overflowX: "auto", border: "1px solid #e5e7eb", borderRadius: 10 }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#f9fafb", textAlign: "left" }}>
                <th style={header}>Applicant</th>
                <th style={header}>App Status</th>
                <th style={header}>NDA Email Sent</th>
                <th style={header}>NDA Signed</th>
                <th style={header}>Access Approved</th>
                <th style={header}>Access Expires</th>
                <th style={header}>Days Outstanding</th>
                <th style={header}>Extension Request</th>
                <th style={header}>Actions</th>
              </tr>
            </thead>

            <tbody>
              {rows.map((r) => {
                const busy = busyId === r.application_id;

                return (
                  <tr key={r.application_id} style={{ borderTop: "1px solid #e5e7eb" }}>
                    <td style={cell}>
                      <div style={{ fontWeight: 800 }}>
                        {r.investor_name || "—"} — {r.email}
                      </div>
                      <div style={{ color: "#6b7280" }}>{r.organization || "—"}</div>
                      <div style={{ color: "#6b7280", fontSize: 12 }}>
                        Ref: {r.reference_code || "—"} • Created: {fmtDate(r.application_created_at)}
                      </div>
                    </td>

                    <td style={cell}>{statusChip(r.application_status)}</td>

                    <td style={cell}>{fmtDate(r.nda_email_sent_at)}</td>

                    <td style={cell}>
                      <div>{r.nda_signed ? "✅ Yes" : "— No"}</div>
                      <div style={{ color: "#6b7280", fontSize: 12 }}>{fmtDate(r.nda_signed_at)}</div>
                    </td>

                    <td style={cell}>{r.access_approved ? "✅ Yes" : "— No"}</td>
                    <td style={cell}>{fmtDate(r.access_expires_at)}</td>

                    <td style={cell}>
                      {r.days_outstanding == null ? "—" : r.days_outstanding}
                      {typeof r.days_outstanding === "number" && r.days_outstanding < 0 ? " (expired)" : ""}
                    </td>

                    <td style={cell}>
                      {!r.pending_extension_request ? (
                        <span style={{ color: "#6b7280" }}>—</span>
                      ) : (
                        <div>
                          <div style={{ fontWeight: 800 }}>Pending</div>
                          <div style={{ fontSize: 12, color: "#6b7280" }}>
                            Until: {fmtDate(r.pending_extension_request.requested_until)}
                          </div>
                          {r.pending_extension_request.reason ? (
                            <div style={{ fontSize: 12, color: "#6b7280" }}>
                              {r.pending_extension_request.reason}
                            </div>
                          ) : null}

                          <div style={{ display: "flex", gap: 8, marginTop: 8, flexWrap: "wrap" }}>
                            <button
                              disabled={busy}
                              onClick={() => approveExtension(r.pending_extension_request!.id)}
                              style={btnStyle("primary", busy)}
                              title="Approve access extension request"
                            >
                              Approve
                            </button>

                            <button
                              disabled={busy}
                              onClick={() => rejectExtension(r.pending_extension_request!.id)}
                              style={btnStyle("secondary", busy)}
                              title="Reject access extension request"
                            >
                              Reject
                            </button>
                          </div>
                        </div>
                      )}
                    </td>

                    <td style={cell}>
                      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                        {canShowApprove(r) && (
                          <button
                            disabled={busy}
                            onClick={() => adminAction(r.application_id, "approve")}
                            style={btnStyle("primary", busy)}
                            title="Approve application and send NDA"
                          >
                            Approve + Send NDA
                          </button>
                        )}

                        {canShowResend(r) && (
                          <button
                            disabled={busy}
                            onClick={() => adminAction(r.application_id, "resend_nda")}
                            style={btnStyle("secondary", busy)}
                            title="Resend NDA email"
                          >
                            Resend NDA
                          </button>
                        )}

                        {canShowRequestInfo(r) && (
                          <button
                            disabled={busy}
                            onClick={() => adminAction(r.application_id, "request_info")}
                            style={btnStyle("secondary", busy)}
                            title="Request additional information from investor"
                          >
                            Request Info
                          </button>
                        )}

                        {canShowReject(r) && (
                          <button
                            disabled={busy}
                            onClick={() => {
                              const ok = confirm("Reject this investor application?");
                              if (ok) adminAction(r.application_id, "reject");
                            }}
                            style={btnStyle("danger", busy)}
                            title="Reject application"
                          >
                            Reject
                          </button>
                        )}

                        {!canShowApprove(r) && !canShowResend(r) && !canShowRequestInfo(r) && !canShowReject(r) && (
                          <span style={{ color: "#6b7280" }}>—</span>
                        )}
                      </div>

                      {busy && (
                        <div style={{ fontSize: 12, color: "#6b7280", marginTop: 6 }}>
                          Working…
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}

              {rows.length === 0 && (
                <tr>
                  <td colSpan={9} style={{ padding: 14, color: "#6b7280" }}>
                    No results.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
