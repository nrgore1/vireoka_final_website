"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { AccessCheckResult } from "@/contracts/access";
import { CONTACT_EMAIL, CONTACT_MAILTO } from "@/lib/contact";

export default function AccessCheckPage() {
  const [result, setResult] = useState<AccessCheckResult | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      try {
        const res = await fetch("/api/intelligence/access-check", {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        });
        const data = (await res.json().catch(() => null)) as AccessCheckResult | null;
        if (!cancelled) setResult(data);
      } catch {
        if (!cancelled) setResult({ ok: false, state: "denied" });
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <a className="text-sm font-semibold text-neutral-700 hover:underline" href="/intelligence">
        ← Back to Intelligence
      </a>

      <h1 className="mt-4 text-3xl font-semibold tracking-tight text-neutral-900">
        Access Check
      </h1>

      <p className="mt-4 text-base leading-7 text-neutral-700">
        This workspace is role-gated. We’ll route you to the correct next step.
      </p>

      {!result ? (
        <div className="mt-8 rounded-2xl border border-neutral-200 bg-neutral-50 p-6">
          <div className="text-sm font-semibold text-neutral-900">Checking access…</div>
          <p className="mt-2 text-sm text-neutral-700">Please wait a moment.</p>
        </div>
      ) : result.ok ? (
        <div className="mt-8 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
          <div className="text-sm font-semibold text-neutral-900">Access granted</div>
          <p className="mt-2 text-sm text-neutral-700">
            Role: <span className="font-semibold">{result.role}</span>
          </p>

          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              className="rounded-xl border border-neutral-200 bg-neutral-900 px-4 py-2 text-sm font-semibold text-white"
              href="/intelligence/portal"
            >
              Continue →
            </Link>
            <Link
              className="rounded-xl border border-neutral-200 bg-white px-4 py-2 text-sm font-semibold text-neutral-900"
              href="/intelligence"
            >
              Back to Intelligence
            </Link>
          </div>
        </div>
      ) : result.state === "logged_out" ? (
        <div className="mt-8 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
          <div className="text-sm font-semibold text-neutral-900">Sign in required</div>
          <p className="mt-2 text-sm text-neutral-700">Please sign in to proceed.</p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link className="rounded-xl border border-neutral-200 bg-neutral-900 px-4 py-2 text-sm font-semibold text-white" href="/intelligence/login">
              Sign in →
            </Link>
            <Link className="rounded-xl border border-neutral-200 bg-white px-4 py-2 text-sm font-semibold text-neutral-900" href="/intelligence/apply">
              Request access
            </Link>
          </div>
        </div>
      ) : result.state === "terms_required" ? (
        <div className="mt-8 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
          <div className="text-sm font-semibold text-neutral-900">Terms required</div>
          <p className="mt-2 text-sm text-neutral-700">
            Please accept the Terms & Conditions to proceed.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link className="rounded-xl border border-neutral-200 bg-neutral-900 px-4 py-2 text-sm font-semibold text-white" href="/intelligence/terms">
              Review & Accept Terms →
            </Link>
          </div>
        </div>
      ) : result.state === "nda_required" ? (
        <div className="mt-8 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
          <div className="text-sm font-semibold text-neutral-900">NDA required</div>
          <p className="mt-2 text-sm text-neutral-700">
            Please accept the NDA to access confidential materials.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link className="rounded-xl border border-neutral-200 bg-neutral-900 px-4 py-2 text-sm font-semibold text-white" href="/intelligence/nda">
              Review & Accept NDA →
            </Link>
            <a className="rounded-xl border border-neutral-200 bg-white px-4 py-2 text-sm font-semibold text-neutral-900" href={CONTACT_MAILTO}>
              Email {CONTACT_EMAIL}
            </a>
          </div>
        </div>
      ) : result.state === "pending" ? (
        <div className="mt-8 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
          <div className="text-sm font-semibold text-neutral-900">Pending review</div>
          <p className="mt-2 text-sm text-neutral-700">
            Your request is under review. We’ll notify you when access is activated.
          </p>
          <div className="mt-5">
            <a className="rounded-xl border border-neutral-200 bg-white px-4 py-2 text-sm font-semibold text-neutral-900" href={CONTACT_MAILTO}>
              Contact {CONTACT_EMAIL}
            </a>
          </div>
        </div>
      ) : (
        <div className="mt-8 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
          <div className="text-sm font-semibold text-neutral-900">Access not available</div>
          <p className="mt-2 text-sm text-neutral-700">
            If you believe this is an error, contact us.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <a className="rounded-xl border border-neutral-200 bg-white px-4 py-2 text-sm font-semibold text-neutral-900" href={CONTACT_MAILTO}>
              Email {CONTACT_EMAIL}
            </a>
            <Link className="rounded-xl border border-neutral-200 bg-white px-4 py-2 text-sm font-semibold text-neutral-900" href="/intelligence/apply">
              Request access
            </Link>
          </div>
        </div>
      )}
    </main>
  );
}
