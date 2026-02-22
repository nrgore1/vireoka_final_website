"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

type ValidateOk = {
  ok: true;
  valid: boolean;
  used: boolean;
  expired?: boolean;
  email?: string;
  application_id?: string;
  expires_at?: string;
  used_at?: string;
};

type ValidateErr = {
  ok: false;
  error?: string;
  expired?: boolean;
};

type ValidateResponse = ValidateOk | ValidateErr;

export default function NdaClient() {
  const params = useSearchParams();
  const router = useRouter();
  const token = useMemo(() => params.get("token") || "", [params]);

  const [loading, setLoading] = useState(true);
  const [validate, setValidate] = useState<ValidateResponse | null>(null);

  const [signerName, setSignerName] = useState("");
  const [agree, setAgree] = useState(false);

  const [submitting, setSubmitting] = useState(false);

  const [friendlyError, setFriendlyError] = useState<string | null>(null);
  const [friendlyFix, setFriendlyFix] = useState<string | null>(null);
  const [debug, setDebug] = useState<any>(null);

  const [signUrl, setSignUrl] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      setLoading(true);
      setFriendlyError(null);
      setFriendlyFix(null);
      setDebug(null);

      if (!token) {
        setValidate({ ok: false, error: "Missing token." });
        setLoading(false);
        return;
      }

      const r = await fetch("/api/investors/nda/validate", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ token }),
      });

      const j = (await r.json().catch(() => null)) as ValidateResponse | null;
      if (cancelled) return;

      if (!r.ok || !j) {
        setValidate({ ok: false, error: "Unable to validate link." });
        setLoading(false);
        return;
      }

      setValidate(j);

      if ((j as any).ok && (j as any).used) {
        router.replace("/investors/nda-signed");
        return;
      }

      setLoading(false);
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [token, router]);

  async function continueToSign() {
    setFriendlyError(null);
    setFriendlyFix(null);
    setDebug(null);

    if (!token) return setFriendlyError("Missing token.");
    if (!signerName.trim()) return setFriendlyError("Please enter your full legal name.");
    if (!agree) return setFriendlyError("Please confirm you agree to the NDA.");

    const signerEmail = String((validate as any)?.email || "").trim().toLowerCase();
    if (!signerEmail) return setFriendlyError("Missing email for this NDA link. Please contact support.");

    setSubmitting(true);

    const r = await fetch("/api/investors/nda/signwell/start", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        token,
        signer_name: signerName.trim(),
        signer_email: signerEmail,
      }),
    });

    const j = await r.json().catch(() => null);
    setSubmitting(false);

    if (!r.ok || !j?.ok || !j?.iframe_url) {
      setFriendlyError(j?.error ? String(j.error) : "Unable to start NDA signing.");
      setFriendlyFix(j?.fix ? String(j.fix) : null);
      setDebug(j?.debug || j);
      return;
    }

    // Save token/name so /investors/nda-signed can finalize if needed
    try {
      sessionStorage.setItem("vireoka_nda_token", token);
      sessionStorage.setItem("vireoka_signer_name", signerName.trim());
    } catch {}

    const url = String(j.iframe_url);

    // IMPORTANT: SignWell may block embedding in iframes.
    // Use full-page navigation to avoid "refused to connect" errors.
    setSignUrl(url);
    window.location.assign(url);
  }

  if (loading) return <div className="max-w-3xl py-8">Loading…</div>;

  if (!validate || (validate as any).ok === false) {
    const err = (validate as any)?.error || "Invalid link.";
    return (
      <div className="max-w-2xl space-y-4 py-8">
        <h1 className="text-2xl font-semibold">NDA Link Problem</h1>
        <p className="text-sm text-neutral-700">{err}</p>
        <a className="text-sm underline" href="/investors/status">Check application status</a>
      </div>
    );
  }

  if ((validate as any).expired) {
    return (
      <div className="max-w-2xl space-y-4 py-8">
        <h1 className="text-2xl font-semibold">Link expired</h1>
        <p className="text-sm text-neutral-700">
          This NDA link has expired. Please request a new link from the email you received or contact support.
        </p>
        <a className="text-sm underline" href="/investors/status">Check application status</a>
      </div>
    );
  }

  const email = String((validate as any)?.email || "").toLowerCase();

  return (
    <div className="max-w-4xl space-y-6 py-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold">Investor NDA</h1>
        <p className="text-sm text-neutral-700">
          You’ll be redirected to SignWell to review and sign. After signing, you’ll return automatically.
        </p>
      </div>

      <div className="space-y-3 rounded-xl border p-4">
        <div className="text-sm text-neutral-700">
          Signing as <span className="font-semibold">{email || "—"}</span>
        </div>

        <label className="block text-sm font-medium">Full legal name</label>
        <input
          value={signerName}
          onChange={(e) => setSignerName(e.target.value)}
          placeholder="Jane Investor"
          className="w-full rounded-md border px-3 py-2 text-sm"
        />

        <label className="flex items-start gap-2 text-sm">
          <input
            type="checkbox"
            checked={agree}
            onChange={(e) => setAgree(e.target.checked)}
            className="mt-1"
          />
          <span>
            I have read and agree to the NDA terms and confirm I am authorized to accept on behalf of myself and/or my organization.
          </span>
        </label>

        <button
          onClick={continueToSign}
          disabled={submitting}
          className="rounded-md bg-neutral-900 text-white px-4 py-2 text-sm font-semibold hover:opacity-90 disabled:opacity-60"
        >
          {submitting ? "Starting…" : "Continue to Sign"}
        </button>

        {signUrl ? (
          <div className="text-xs text-neutral-600">
            If you weren’t redirected automatically,{" "}
            <a className="underline" href={signUrl} target="_blank" rel="noreferrer">
              open the signing page
            </a>
            .
          </div>
        ) : null}

        {friendlyError ? (
          <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700 space-y-2">
            <div className="font-semibold">We couldn’t start the NDA signing session</div>
            <div>{friendlyError}</div>
            {friendlyFix ? <div className="text-red-700/90">{friendlyFix}</div> : null}
          </div>
        ) : null}

        {debug ? (
          <details className="text-xs text-neutral-600">
            <summary className="cursor-pointer">Technical details (admin)</summary>
            <pre className="mt-2 whitespace-pre-wrap rounded bg-neutral-50 border p-3">
              {typeof debug === "string" ? debug : JSON.stringify(debug, null, 2)}
            </pre>
          </details>
        ) : null}
      </div>

      <p className="text-xs text-neutral-500">
        Having trouble? Reply to the email you received or contact support.
      </p>
    </div>
  );
}
