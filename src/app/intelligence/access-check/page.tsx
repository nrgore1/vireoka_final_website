"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CONTACT_EMAIL, CONTACT_MAILTO } from "@/lib/contact";

type AccessResult =
  | { ok: true; state: "granted"; redirectTo?: string }
  | { ok: false; state: "logged_out" | "nda_required" | "pending" | "denied" | "error"; message?: string };

export default function AccessCheckPage() {
  const [result, setResult] = useState<AccessResult | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      try {
        const res = await fetch("/api/portal/access-check", {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        });

        if (cancelled) return;

        // If your endpoint already returns a shape, we adapt it gently.
        if (res.ok) {
          const data: any = await res.json().catch(() => ({}));

          // Common patterns:
          // - { allowed: true }
          // - { ok: true, allowed: true }
          // - { status: "granted" }
          // - { state: "pending" | "denied" | ... }
          const allowed =
            data?.allowed === true ||
            data?.ok === true ||
            data?.status === "granted" ||
            data?.state === "granted";

          if (allowed) {
            setResult({ ok: true, state: "granted", redirectTo: data?.redirectTo || "/intelligence/portal" });
            return;
          }

          const state =
            data?.state ||
            data?.status ||
            (data?.ndaRequired ? "nda_required" : null) ||
            (data?.pending ? "pending" : null) ||
            (data?.denied ? "denied" : null);

          if (state === "nda_required") setResult({ ok: false, state: "nda_required" });
          else if (state === "pending") setResult({ ok: false, state: "pending" });
          else if (state === "denied") setResult({ ok: false, state: "denied" });
          else setResult({ ok: false, state: "error" });
          return;
        }

        // Non-200 cases
        if (res.status === 401 || res.status === 403) {
          setResult({ ok: false, state: "logged_out" });
          return;
        }

        setResult({ ok: false, state: "error" });
      } catch {
        if (!cancelled) setResult({ ok: false, state: "error" });
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
        This area is role-gated. We’ll guide you to the right next step without exposing sensitive details.
      </p>

      {!result ? (
        <div className="mt-8 rounded-2xl border border-neutral-200 bg-neutral-50 p-6">
          <div className="text-sm font-semibold text-neutral-900">Checking access…</div>
          <p className="mt-2 text-sm text-neutral-700">
            Please wait a moment.
          </p>
        </div>
      ) : result.ok ? (
        <div className="mt-8 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
          <div className="text-sm font-semibold text-neutral-900">Access granted</div>
          <p className="mt-2 text-sm text-neutral-700">
            You can continue to your workspace.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              className="rounded-xl border border-neutral-200 bg-neutral-900 px-4 py-2 text-sm font-semibold text-white"
              href={result.redirectTo || "/intelligence/portal"}
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
          <p className="mt-2 text-sm text-neutral-700">
            Please sign in to proceed.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              className="rounded-xl border border-neutral-200 bg-neutral-900 px-4 py-2 text-sm font-semibold text-white"
              href="/intelligence/login"
            >
              Sign in →
            </Link>
            <Link
              className="rounded-xl border border-neutral-200 bg-white px-4 py-2 text-sm font-semibold text-neutral-900"
              href="/intelligence/apply"
            >
              Request access
            </Link>
          </div>
        </div>
      ) : result.state === "nda_required" ? (
        <div className="mt-8 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
          <div className="text-sm font-semibold text-neutral-900">NDA required</div>
          <p className="mt-2 text-sm text-neutral-700">
            Some materials require a signed NDA and verification before access can be enabled.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              className="rounded-xl border border-neutral-200 bg-neutral-900 px-4 py-2 text-sm font-semibold text-white"
              href="/intelligence/nda"
            >
              Start NDA flow →
            </Link>
            <a
              className="rounded-xl border border-neutral-200 bg-white px-4 py-2 text-sm font-semibold text-neutral-900"
              href={CONTACT_MAILTO}
            >
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
          <div className="mt-5 flex flex-wrap gap-3">
            <a
              className="rounded-xl border border-neutral-200 bg-white px-4 py-2 text-sm font-semibold text-neutral-900"
              href={CONTACT_MAILTO}
            >
              Contact {CONTACT_EMAIL}
            </a>
            <Link
              className="rounded-xl border border-neutral-200 bg-white px-4 py-2 text-sm font-semibold text-neutral-900"
              href="/intelligence"
            >
              Back to Intelligence
            </Link>
          </div>
        </div>
      ) : result.state === "denied" ? (
        <div className="mt-8 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
          <div className="text-sm font-semibold text-neutral-900">Access not available</div>
          <p className="mt-2 text-sm text-neutral-700">
            This workspace is restricted. If you believe this is an error, contact us.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <a
              className="rounded-xl border border-neutral-200 bg-white px-4 py-2 text-sm font-semibold text-neutral-900"
              href={CONTACT_MAILTO}
            >
              Email {CONTACT_EMAIL}
            </a>
            <Link
              className="rounded-xl border border-neutral-200 bg-white px-4 py-2 text-sm font-semibold text-neutral-900"
              href="/intelligence/apply"
            >
              Request access
            </Link>
          </div>
        </div>
      ) : (
        <div className="mt-8 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
          <div className="text-sm font-semibold text-neutral-900">Unable to verify access</div>
          <p className="mt-2 text-sm text-neutral-700">
            Please try again. If the issue persists, contact us.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <button
              className="rounded-xl border border-neutral-200 bg-neutral-900 px-4 py-2 text-sm font-semibold text-white"
              onClick={() => location.reload()}
            >
              Retry
            </button>
            <a
              className="rounded-xl border border-neutral-200 bg-white px-4 py-2 text-sm font-semibold text-neutral-900"
              href={CONTACT_MAILTO}
            >
              Email {CONTACT_EMAIL}
            </a>
          </div>
        </div>
      )}
    </main>
  );
}
