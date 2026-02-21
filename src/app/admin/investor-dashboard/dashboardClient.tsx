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

  latest_info_request_message?: string | null;
  latest_info_request_at?: string | null;

  latest_info_response_at?: string | null;
  latest_info_response_message?: string | null;
  latest_info_response_fields?: any | null;
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

function pretty(obj: any) {
  try {
    return JSON.stringify(obj, null, 2);
  } catch {
    return String(obj ?? "");
  }
}

export default function DashboardClient() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("all");
  const [q, setQ] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);

  const [expandedId, setExpandedId] = useState<string | null>(null);

  const [requestInfoOpen, setRequestInfoOpen] = useState(false);
  const [requestInfoId, setRequestInfoId] = useState<string | null>(null);
  const [requestInfoEmail, setRequestInfoEmail] = useState<string | null>(null);
  const [requestInfoMessage, setRequestInfoMessage] = useState("");

  const url = useMemo(() => {
    const sp = new URLSearchParams();
    sp.set("status", status);
    if (q.trim()) sp.set("q", q.trim());
    return `/api/admin/investor-dashboard?${sp.toString()}`;
  }, [status, q]);

  async function load() {
    setLoading(true);
    try {
      const r = await fetch(url);
      const j = await r.json().catch(() => null);
      if (r.ok && j?.ok) setRows(j.rows || []);
      else setRows([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url]);

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
      fontWeight: 800,
      cursor: disabled ? "not-allowed" : "pointer",
      opacity: disabled ? 0.6 : 1,
      border: "1px solid #e5e7eb",
      background: "white",
    };

    if (kind === "primary") {
      base.background = "#111827";
      base.color = "white";
      base.border = "1px solid #111827";
    }
    if (kind === "danger") {
      base.background = "#fff1f2";
      base.color = "#b91c1c";
      base.border = "1px solid #fecdd3";
    }

    return base;
  }

  async function adminAction(
    applicationId: string,
    action: "approve" | "resend_nda" | "request_info" | "reject",
    extra?: Record<string, any>
  ) {
    setBusyId(applicationId);
    try {
      const r = await fetch("/api/admin/investor-applications/session", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ id: applicationId, action, ...(extra || {}) }),
      });
      const j = await r.json().catch(() => null);

      if (!r.ok || j?.ok === false) {
        const msg = j?.error || `Action failed: ${action}`;
        alert(msg);
      } else if (j?.note) {
        alert(String(j.note));
      }
    } finally {
      setBusyId(null);
      await load();
    }
  }

  const cell: React.CSSProperties = { padding: 10, verticalAlign: "top" };
  const header: React.CSSProperties = { padding: 10, fontSize: 12, letterSpacing: 0.2, color: "#374151" };

  return (
    <div>
      {requestInfoOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.35)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 16,
            zIndex: 50,
          }}
          onClick={() => {
            setRequestInfoOpen(false);
            setRequestInfoId(null);
            setRequestInfoEmail(null);
            setRequestInfoMessage("");
          }}
        >
          <div
            style={{
              width: "min(720px, 100%)",
              background: "white",
              borderRadius: 16,
              padding: 16,
              boxShadow: "0 10px 30px rgba(0,0,0,0.18)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
              <div>
                <div style={{ fontWeight: 900, fontSize: 16 }}>Request additional information</div>
                <div style={{ color: "#6b7280", fontSize: 12 }}>
                  This will send a secure portal link to {requestInfoEmail || "the applicant"}.
                </div>
              </div>
              <button
                onClick={() => {
                  setRequestInfoOpen(false);
                  setRequestInfoId(null);
                  setRequestInfoEmail(null);
                  setRequestInfoMessage("");
                }}
                style={{ border: "1px solid #e5e7eb", borderRadius: 10, padding: "6px 10px", fontWeight: 900 }}
              >
                Close
              </button>
            </div>

            <div style={{ marginTop: 12 }}>
              <textarea
                value={requestInfoMessage}
                onChange={(e) => setRequestInfoMessage(e.target.value)}
                placeholder={
                  "Write exactly what you need from the investor.\n\nExample:\n• Please confirm your accreditation status.\n• What is your intended use case?\n• Your role/title and firm website."
                }
                rows={8}
                style={{ width: "100%", border: "1px solid #e5e7eb", borderRadius: 12, padding: 10, fontSize: 13 }}
              />
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 12 }}>
              <button
                onClick={() => {
                  setRequestInfoOpen(false);
                  setRequestInfoId(null);
                  setRequestInfoEmail(null);
                  setRequestInfoMessage("");
                }}
                style={{ border: "1px solid #e5e7eb", borderRadius: 12, padding: "8px 12px", fontWeight: 900 }}
              >
                Cancel
              </button>

              <button
                disabled={!requestInfoId || busyId === requestInfoId}
                onClick={async () => {
                  if (!requestInfoId) return;
                  await adminAction(requestInfoId, "request_info", { message: requestInfoMessage });
                  setRequestInfoOpen(false);
                  setRequestInfoId(null);
                  setRequestInfoEmail(null);
                  setRequestInfoMessage("");
                }}
                style={{
                  background: "#111827",
                  color: "white",
                  borderRadius: 12,
                  padding: "8px 12px",
                  fontWeight: 900,
                  opacity: !requestInfoId || busyId === requestInfoId ? 0.6 : 1,
                  cursor: !requestInfoId || busyId === requestInfoId ? "not-allowed" : "pointer",
                }}
              >
                Send request
              </button>
            </div>
          </div>
        </div>
      )}

      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 12 }}>
        <select value={status} onChange={(e) => setStatus(e.target.value)} style={{ padding: 8, borderRadius: 10 }}>
          <option value="all">All</option>
          <option value="submitted">Submitted</option>
          <option value="info_requested">Info Requested</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>

        <input
          placeholder="Search name/email/org"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          style={{ padding: 8, borderRadius: 10, minWidth: 260 }}
        />

        <button onClick={() => load()} style={btnStyle("secondary", loading)}>
          Refresh
        </button>
      </div>

      <div style={{ border: "1px solid #e5e7eb", borderRadius: 14, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead style={{ background: "#fafafa" }}>
            <tr>
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
            {loading && (
              <tr>
                <td colSpan={9} style={{ padding: 14, color: "#6b7280" }}>
                  Loading…
                </td>
              </tr>
            )}

            {!loading &&
              rows.map((r) => {
                const busy = busyId === r.application_id;

                const statusLower = String(r.application_status || "").toLowerCase();
                const statusPill =
                  statusLower === "approved"
                    ? pill("approved", "#dcfce7", "#166534")
                    : statusLower === "rejected"
                    ? pill("rejected", "#fee2e2", "#991b1b")
                    : statusLower === "info_requested"
                    ? pill("info requested", "#ffedd5", "#9a3412")
                    : pill("submitted", "#fef9c3", "#854d0e");

                const hasResponse =
                  Boolean(r.latest_info_response_at) ||
                  Boolean(r.latest_info_response_message) ||
                  Boolean(r.latest_info_response_fields);

                const isExpanded = expandedId === r.application_id;

                return (
                  <tr key={r.application_id} style={{ borderTop: "1px solid #f3f4f6" }}>
                    <td style={cell}>
                      <div style={{ fontWeight: 900 }}>
                        {r.investor_name || "—"} — {r.email}
                      </div>
                      <div style={{ color: "#6b7280", fontSize: 12 }}>{r.organization || "—"}</div>
                      <div style={{ color: "#6b7280", fontSize: 12 }}>
                        Ref: {r.reference_code || "—"} • Created: {fmtDate(r.application_created_at)}
                      </div>

                      {hasResponse && (
                        <div style={{ marginTop: 10 }}>
                          <button
                            onClick={() => setExpandedId(isExpanded ? null : r.application_id)}
                            style={{
                              border: "1px solid #e5e7eb",
                              background: "#fff",
                              borderRadius: 10,
                              padding: "6px 10px",
                              fontWeight: 800,
                              cursor: "pointer",
                            }}
                          >
                            {isExpanded ? "Hide investor response" : "View investor response"}
                          </button>

                          {isExpanded && (
                            <div
                              style={{
                                marginTop: 8,
                                border: "1px solid #e5e7eb",
                                borderRadius: 12,
                                padding: 10,
                                background: "#fafafa",
                              }}
                            >
                              <div style={{ fontSize: 12, color: "#6b7280", fontWeight: 800 }}>
                                Latest response received: {fmtDate(r.latest_info_response_at || null)}
                              </div>

                              {r.latest_info_response_fields ? (
                                <pre
                                  style={{
                                    marginTop: 8,
                                    whiteSpace: "pre-wrap",
                                    fontSize: 12,
                                    color: "#111827",
                                  }}
                                >
                                  {pretty(r.latest_info_response_fields)}
                                </pre>
                              ) : null}

                              {r.latest_info_response_message ? (
                                <div style={{ marginTop: 8, fontSize: 13, whiteSpace: "pre-wrap" }}>
                                  {r.latest_info_response_message}
                                </div>
                              ) : null}
                            </div>
                          )}
                        </div>
                      )}
                    </td>

                    <td style={cell}>{statusPill}</td>
                    <td style={cell}>{fmtDate(r.nda_email_sent_at)}</td>
                    <td style={cell}>{r.nda_signed ? pill("Yes", "#dcfce7", "#166534") : "— No"}</td>
                    <td style={cell}>{r.access_approved ? pill("Yes", "#dcfce7", "#166534") : "—"}</td>
                    <td style={cell}>{fmtDate(r.access_expires_at)}</td>
                    <td style={cell}>{r.days_outstanding ?? "—"}</td>
                    <td style={cell}>{r.pending_extension_request ? pill("pending", "#e0f2fe", "#075985") : "—"}</td>

                    <td style={cell}>
                      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        {canShowApprove(r) && (
                          <button
                            disabled={busy}
                            onClick={() => adminAction(r.application_id, "approve")}
                            style={btnStyle("primary", busy)}
                            title="Approve + send NDA"
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
                            onClick={() => {
                              setRequestInfoId(r.application_id);
                              setRequestInfoEmail(r.email);
                              setRequestInfoMessage("");
                              setRequestInfoOpen(true);
                            }}
                            style={btnStyle("secondary", busy)}
                            title="Request additional information from investor (via portal link)"
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

                        {busy && <div style={{ fontSize: 12, color: "#6b7280" }}>Working…</div>}
                      </div>
                    </td>
                  </tr>
                );
              })}

            {!loading && rows.length === 0 && (
              <tr>
                <td colSpan={9} style={{ padding: 14, color: "#6b7280" }}>
                  No results.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
