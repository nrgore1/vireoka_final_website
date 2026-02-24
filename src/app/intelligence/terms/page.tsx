"use client";

import { useState } from "react";
import { TERMS_VERSION } from "@/lib/legal";
import { CONTACT_EMAIL, CONTACT_MAILTO } from "@/lib/contact";

export default function TermsPage() {
  const [saving, setSaving] = useState(false);

  async function accept() {
    setSaving(true);
    try {
      await fetch("/api/legal/terms/accept", { method: "POST", credentials: "include" });
      window.location.href = "/intelligence/access-check";
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <a className="text-sm font-semibold text-neutral-700 hover:underline" href="/intelligence">
        ← Back to Intelligence
      </a>

      <h1 className="mt-4 text-3xl font-semibold tracking-tight text-neutral-900">
        Terms & Conditions
      </h1>

      <p className="mt-4 text-sm text-neutral-600">Version: {TERMS_VERSION}</p>

      <div className="mt-8 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
        <p className="text-sm leading-6 text-neutral-700">
          These terms govern access to Vireoka Intelligence and any associated portals, documents,
          and role-based workspaces. By continuing, you agree to confidentiality boundaries,
          acceptable use, and the access rules defined by your assigned role and tier.
        </p>

        <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-6 text-neutral-700">
          <li>No redistribution of restricted materials.</li>
          <li>Access may be changed or revoked at any time.</li>
          <li>Use is limited to evaluation and agreed collaboration.</li>
          <li>Security hygiene is required (no credential sharing).</li>
        </ul>

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            onClick={accept}
            disabled={saving}
            className="rounded-xl border border-neutral-200 bg-neutral-900 px-4 py-2 text-sm font-semibold text-white"
          >
            {saving ? "Saving…" : "I Agree — Continue"}
          </button>

          <a
            className="rounded-xl border border-neutral-200 bg-white px-4 py-2 text-sm font-semibold text-neutral-900"
            href={CONTACT_MAILTO}
          >
            Questions? Email {CONTACT_EMAIL}
          </a>
        </div>
      </div>
    </main>
  );
}
