"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type MeResp =
  | { ok: true; investor: { email: string; status: string; expiresAt: string | null } }
  | { ok: false; error: string };

export default function InvestorPortalPage() {
  const [me, setMe] = useState<MeResp | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/investors/me", { cache: "no-store" }).catch(() => null);
      const data = (await res?.json().catch(() => null)) as MeResp | null;
      setMe(data);
      setLoading(false);
    })();
  }, []);

  if (loading) {
    return <div className="text-sm text-neutral-700">Loading investor portal…</div>;
  }

  if (!me || !me.ok) {
    return (
      <div className="space-y-5 max-w-2xl">
        <h1 className="text-3xl font-semibold tracking-tight">Investor portal</h1>
        <p className="text-sm text-neutral-700">
          You don’t have an active investor session. Please apply, accept the NDA, and check status.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link className="rounded-md bg-neutral-900 text-white px-4 py-2 text-sm hover:opacity-90" href="/investors/apply">
            Apply
          </Link>
          <Link className="rounded-md border px-4 py-2 text-sm hover:bg-neutral-50" href="/investors/status">
            Check status
          </Link>
        </div>
      </div>
    );
  }

  if (me.investor.status !== "APPROVED") {
    return (
      <div className="space-y-5 max-w-2xl">
        <h1 className="text-3xl font-semibold tracking-tight">Investor portal</h1>
        <p className="text-sm text-neutral-700">
          Your status is <b>{me.investor.status}</b>. Portal access is available only to approved investors.
        </p>
        <Link className="rounded-md border px-4 py-2 text-sm hover:bg-neutral-50" href="/investors/status">
          View details
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">Investor portal</h1>
        <p className="text-sm text-neutral-700">
          Approved for <b>{me.investor.email}</b>
          {me.investor.expiresAt ? (
            <> • access expires {new Date(me.investor.expiresAt).toLocaleString()}</>
          ) : null}
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-lg border p-6 space-y-3">
          <div className="text-sm font-semibold">Investor whitepaper (NDA)</div>
          <p className="text-sm text-neutral-700">
            Deeper technical memo: governance engine, security architecture, operating model, and adoption.
          </p>
          <a
            className="inline-block text-sm underline underline-offset-4"
            href="/investors/vireoka-investor-whitepaper.pdf"
            target="_blank"
            rel="noreferrer"
          >
            Open PDF →
          </a>
          <div className="text-xs text-neutral-500">
            Place the PDF in <code>/public/investors</code> (or update this link).
          </div>
        </div>

        <div className="rounded-lg border p-6 space-y-3">
          <div className="text-sm font-semibold">Pitch deck</div>
          <p className="text-sm text-neutral-700">
            High-level company narrative and roadmap (NDA-gated).
          </p>
          <a
            className="inline-block text-sm underline underline-offset-4"
            href="/investors/vireoka-pitch-deck.pdf"
            target="_blank"
            rel="noreferrer"
          >
            Open PDF →
          </a>
          <div className="text-xs text-neutral-500">
            Place the PDF in <code>/public/investors</code> (or update this link).
          </div>
        </div>
      </div>

      <div className="rounded-lg border p-6">
        <div className="text-sm font-semibold">Demo video</div>
        <p className="mt-2 text-sm text-neutral-700">
          Replace this placeholder with your latest NDA-safe demo capture.
        </p>
        <div className="mt-4 overflow-hidden rounded-2xl border">
          <video controls preload="metadata" style={{ width: "100%", display: "block", background: "black" }}>
            <source src="/videos/investor-demo.mp4" type="video/mp4" />
          </video>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <Link className="rounded-md border px-4 py-2 text-sm hover:bg-neutral-50" href="/investors/status">
          Status
        </Link>
        <Link className="rounded-md border px-4 py-2 text-sm hover:bg-neutral-50" href="/">
          Home
        </Link>
      </div>
    </div>
  );
}
