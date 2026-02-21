"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

type Cta = { label: string; href: string };
type ResolveOk = {
  ok: true;
  used: boolean;
  email?: string;
  used_at?: string;
  expires_at?: string;
  title?: string;
  message?: string;
  ctas?: { primary?: Cta; secondary?: Cta };
};

type ResolveErr = {
  ok: false;
  error?: string;
  invalid?: boolean;
  expired?: boolean;
  title?: string;
  message?: string;
  ctas?: { primary?: Cta; secondary?: Cta };
};

type ResolveResponse = ResolveOk | ResolveErr;

export default function ViewClient() {
  const router = useRouter();
  const params = useSearchParams();

  const token = useMemo(() => params.get("token") || "", [params]);

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<ResolveResponse | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      setLoading(true);
      setData(null);

      try {
        if (!token) {
          setData({
            ok: false,
            title: "Missing link token",
            message: "This link is missing required information. Please request a new NDA link.",
            ctas: {
              primary: { label: "Request a new NDA link", href: "/investors/status" },
              secondary: { label: "Back to Investor Access", href: "/investors/access" },
            },
          });
          return;
        }

        // Your existing pattern: token in querystring
        const r = await fetch(`/api/investors/status/resolve?token=${encodeURIComponent(token)}`, {
          method: "GET",
          cache: "no-store",
        });

        const json = (await r.json()) as ResolveResponse;
        if (!cancelled) setData(json);
      } catch (e: any) {
        if (!cancelled) {
          setData({
            ok: false,
            title: "Something went wrong",
            message: String(e?.message || e),
            ctas: {
              primary: { label: "Request a new NDA link", href: "/investors/status" },
              secondary: { label: "Back to Investor Access", href: "/investors/access" },
            },
          });
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [token]);

  const title = data?.title || (loading ? "Loading…" : "Investor status");
  const message =
    data?.message ||
    (loading ? "Just a moment while we verify your link." : data?.ok === false ? (data.error || "Unable to verify link.") : "");

  const primary = data?.ctas?.primary;
  const secondary = data?.ctas?.secondary;

  const boxStyle: React.CSSProperties = {
    maxWidth: 760,
    margin: "48px auto",
    padding: "28px 22px",
    border: "1px solid #e5e7eb",
    borderRadius: 14,
    background: "#fff",
  };

  const titleStyle: React.CSSProperties = {
    fontSize: 28,
    fontWeight: 700,
    marginBottom: 10,
    textAlign: "center",
  };

  const textStyle: React.CSSProperties = {
    fontSize: 16,
    lineHeight: 1.5,
    margin: "0 auto 18px",
    maxWidth: 600,
    textAlign: "center",
    color: "#374151",
  };

  const btnRow: React.CSSProperties = {
    display: "flex",
    gap: 12,
    justifyContent: "center",
    flexWrap: "wrap",
    marginTop: 18,
  };

  const primaryBtn: React.CSSProperties = {
    padding: "10px 14px",
    borderRadius: 10,
    border: "1px solid #111827",
    background: "#111827",
    color: "#fff",
    cursor: "pointer",
    fontWeight: 600,
  };

  const secondaryBtn: React.CSSProperties = {
    padding: "10px 14px",
    borderRadius: 10,
    border: "1px solid #d1d5db",
    background: "#fff",
    color: "#111827",
    cursor: "pointer",
    fontWeight: 600,
  };

  function go(href?: string) {
    if (!href) return;
    router.push(href);
  }

  return (
    <div style={{ padding: "0 14px" }}>
      <div style={boxStyle}>
        <div style={titleStyle}>{title}</div>
        <p style={textStyle}>{message}</p>

        {!loading && data && data.ok === true && data.used === true && (
          <p style={{ ...textStyle, marginTop: -8 }}>
            If you already signed, you’re all set.
          </p>
        )}

        <div style={btnRow}>
          {primary?.href && (
            <button style={primaryBtn} onClick={() => go(primary.href)}>
              {primary.label || "Continue"}
            </button>
          )}
          {secondary?.href && (
            <button style={secondaryBtn} onClick={() => go(secondary.href)}>
              {secondary.label || "Back"}
            </button>
          )}
          {!primary?.href && !secondary?.href && !loading && (
            <button style={secondaryBtn} onClick={() => go("/investors/access")}>
              Back to Investor Access
            </button>
          )}
        </div>
      </div>

      <p style={{ textAlign: "center", color: "#6b7280", fontSize: 12 }}>
        Vireoka Investor Access
      </p>
    </div>
  );
}
