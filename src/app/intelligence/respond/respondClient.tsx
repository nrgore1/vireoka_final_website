"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

type ValidateOk = {
  ok: true;
  email: string;
  application_id: string;
  investor_name?: string | null;
  organization?: string | null;
  request_message?: string | null;
  requested_at?: string | null;
};

export default function RespondClient() {
  const params = useSearchParams();
  const router = useRouter();

  const token = useMemo(() => params.get("token") || "", [params]);

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<ValidateOk | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [role, setRole] = useState("");
  const [firm, setFirm] = useState("");
  const [website, setWebsite] = useState("");
  const [accreditation, setAccreditation] = useState("");
  const [message, setMessage] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      setLoading(true);
      setError(null);
      setData(null);

      if (!token) {
        setError("This link is missing required information. Please request a new link.");
        setLoading(false);
        return;
      }

      const r = await fetch("/api/intelligence/info-request/validate", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ token }),
      });

      const j = await r.json().catch(() => null);

      if (cancelled) return;

      if (!r.ok || !j?.ok) {
        setError(j?.error || "Unable to validate this link.");
        setLoading(false);
        return;
      }

      setData(j as ValidateOk);
      setLoading(false);
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [token]);

  async function submit() {
    setError(null);

    if (!token) {
      setError("Missing token.");
      return;
    }

    const hasAnything =
      message.trim() ||
      role.trim() ||
      firm.trim() ||
      website.trim() ||
      accreditation.trim();

    if (!hasAnything) {
      setError("Please provide at least one piece of information before submitting.");
      return;
    }

    setSubmitting(true);

    const r = await fetch("/api/intelligence/info-request/submit", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        token,
        fields: {
          role: role.trim(),
          firm: firm.trim(),
          website: website.trim(),
          accreditation: accreditation.trim(),
        },
        message: message.trim(),
      }),
    });

    const j = await r.json().catch(() => null);
    setSubmitting(false);

    if (!r.ok || !j?.ok) {
      setError(j?.error || "Unable to submit. Please try again.");
      return;
    }

    setDone(true);
    setTimeout(() => router.push("/intelligence/status"), 1200);
  }

  if (loading) return <div className="text-sm text-neutral-700">Loading…</div>;

  if (error) {
    return (
      <div className="space-y-3">
        <h1 className="text-2xl font-semibold">Link issue</h1>
        <p className="text-sm text-neutral-700">{error}</p>
        <a className="text-sm underline" href="/intelligence/status">
          Request a new status link
        </a>
      </div>
    );
  }

  if (!data) return null;

  if (done) {
    return (
      <div className="space-y-3">
        <h1 className="text-2xl font-semibold">Thanks — we received your update ✅</h1>
        <p className="text-sm text-neutral-700">
          Our team is reviewing your information. You’ll receive an email update soon.
        </p>
        <a className="text-sm underline" href="/intelligence/status">
          View status
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold">Provide requested information</h1>
        <p className="text-sm text-neutral-700">
          This helps our team complete your investor access review.
        </p>
      </div>

      {data.request_message ? (
        <div className="rounded-xl border bg-neutral-50 p-4">
          <div className="text-xs font-semibold tracking-wide text-neutral-500 uppercase">
            Request from Vireoka
          </div>
          <div className="mt-2 whitespace-pre-wrap text-sm text-neutral-900">
            {data.request_message}
          </div>
        </div>
      ) : null}

      <div className="grid gap-3 rounded-xl border p-4">
        <div className="grid gap-1">
          <label className="text-sm font-medium">Role / Title</label>
          <input
            className="rounded-md border px-3 py-2 text-sm"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            placeholder="e.g., Partner, Analyst, GP, CFO"
          />
        </div>

        <div className="grid gap-1">
          <label className="text-sm font-medium">Firm / Organization</label>
          <input
            className="rounded-md border px-3 py-2 text-sm"
            value={firm}
            onChange={(e) => setFirm(e.target.value)}
            placeholder="e.g., Example Capital"
          />
        </div>

        <div className="grid gap-1">
          <label className="text-sm font-medium">Website</label>
          <input
            className="rounded-md border px-3 py-2 text-sm"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            placeholder="https://"
          />
        </div>

        <div className="grid gap-1">
          <label className="text-sm font-medium">Accreditation (optional)</label>
          <input
            className="rounded-md border px-3 py-2 text-sm"
            value={accreditation}
            onChange={(e) => setAccreditation(e.target.value)}
            placeholder="e.g., accredited investor, institutional, etc."
          />
        </div>

        <div className="grid gap-1">
          <label className="text-sm font-medium">Additional notes</label>
          <textarea
            className="rounded-md border px-3 py-2 text-sm"
            rows={6}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Anything else we should know? Intended use, timeline, background, etc."
          />
        </div>

        <button
          onClick={submit}
          disabled={submitting}
          className="rounded-md bg-neutral-900 px-4 py-2 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-60"
        >
          {submitting ? "Submitting…" : "Submit"}
        </button>

        {error ? <div className="text-sm text-red-600">{error}</div> : null}
      </div>

      <p className="text-xs text-neutral-500">
        This link is private to your application. If you didn’t request this, you can ignore it.
      </p>
    </div>
  );
}
