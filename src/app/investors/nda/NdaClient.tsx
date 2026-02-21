"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { NdaViewer } from "@/components/investor/NdaViewer";

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
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      setLoading(true);
      setMsg(null);

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

      // If already used, route to confirmation (idempotent UX)
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

  async function accept() {
    setMsg(null);

    if (!token) {
      setMsg("Missing token.");
      return;
    }
    if (!signerName.trim()) {
      setMsg("Please enter your full legal name.");
      return;
    }
    if (!agree) {
      setMsg("Please confirm you agree to the NDA.");
      return;
    }

    setSubmitting(true);

    const r = await fetch("/api/investors/nda/sign", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        token,
        signer_name: signerName.trim(),
        nda_version: "v1",
      }),
    });

    const j = await r.json().catch(() => null);
    setSubmitting(false);

    if (!r.ok || !j?.ok) {
      const detail = j?.error ? ` (${String(j.error)})` : "";
      setMsg(`Unable to record NDA acceptance${detail}`);
      return;
    }

    router.push("/investors/nda-signed");
  }

  if (loading) {
    return <div className="max-w-3xl py-8">Loading…</div>;
  }

  if (!validate || (validate as any).ok === false) {
    const err = (validate as any)?.error || "Invalid link.";
    return (
      <div className="max-w-2xl space-y-4 py-8">
        <h1 className="text-2xl font-semibold">NDA Link Problem</h1>
        <p className="text-sm text-neutral-700">{err}</p>
        <a className="text-sm underline" href="/investors/status">
          Check application status
        </a>
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
        <a className="text-sm underline" href="/investors/status">
          Check application status
        </a>
      </div>
    );
  }

  return (
    <div className="max-w-3xl space-y-6 py-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold">Investor NDA</h1>
        <p className="text-sm text-neutral-700">
          Review the NDA below. To continue, enter your name and confirm acceptance.
        </p>
      </div>

      <div className="rounded-xl border p-4">
        <NdaViewer />
      </div>

      <div className="space-y-3 rounded-xl border p-4">
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
          onClick={accept}
          disabled={submitting}
          className="rounded-md bg-neutral-900 text-white px-4 py-2 text-sm font-semibold hover:opacity-90 disabled:opacity-60"
        >
          {submitting ? "Recording…" : "Accept NDA"}
        </button>

        {msg && <div className="text-sm text-red-600">{msg}</div>}
      </div>

      <p className="text-xs text-neutral-500">
        Having trouble? Reply to the email you received or contact support.
      </p>
    </div>
  );
}
