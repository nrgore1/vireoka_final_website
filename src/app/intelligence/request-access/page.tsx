"use client";

import { useMemo, useState } from "react";

type Role = "advisor" | "angel" | "vc" | "partner" | "contributor";

export default function RequestAccessPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [role, setRole] = useState<Role>("vc");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "error">("idle");
  const [err, setErr] = useState<string | null>(null);

  const canSubmit = useMemo(() => {
    return fullName.trim().length >= 2 && email.trim().includes("@") && message.trim().length >= 2;
  }, [fullName, email, message]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setStatus("sending");

    try {
      const res = await fetch("/api/investors/request-access", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          fullName,
          email,
          company: company || "Individual",
          role,
          message,
        }),
      });

      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (!res.ok || !data?.ok) throw new Error(data?.error || `Request failed (${res.status})`);

      setStatus("ok");
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      setErr(msg);
      setStatus("error");
    }
  }

  return (
    <main className="mx-auto max-w-5xl px-4 sm:px-6 py-12">
      <header className="max-w-3xl">
        <a className="text-sm font-semibold text-neutral-700 hover:underline" href="/intelligence">
          ← Back to Intelligence
        </a>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-neutral-900">
          Request access to Vireoka Intelligence
        </h1>
        <p className="mt-4 text-base leading-7 text-neutral-700">
          Tell us which <span className="font-semibold text-neutral-900">external stakeholder role</span> you’re engaging as (advisor, angel,
          VC, partner, contributor). You can play more than one role over time — we use this to route you to the right lane.
        </p>
      </header>

      <div className="mt-10 grid gap-6 lg:grid-cols-12">
        <section className="lg:col-span-7">
          <div className="rounded-2xl border border-neutral-200 bg-white p-6 sm:p-8 shadow-sm">
            <h2 className="text-lg font-semibold text-neutral-900">Your request</h2>

            <form className="mt-6 space-y-4" onSubmit={submit}>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <div className="text-sm font-semibold text-neutral-900">Full name</div>
                  <input
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="mt-2 w-full rounded-xl border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 outline-none focus:ring-2 focus:ring-vireoka-indigo/30"
                    placeholder="Jane Doe"
                    autoComplete="name"
                  />
                </label>

                <label className="block">
                  <div className="text-sm font-semibold text-neutral-900">Email</div>
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-2 w-full rounded-xl border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 outline-none focus:ring-2 focus:ring-vireoka-indigo/30"
                    placeholder="you@domain.com"
                    autoComplete="email"
                  />
                </label>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <div className="text-sm font-semibold text-neutral-900">Company / affiliation</div>
                  <input
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="mt-2 w-full rounded-xl border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 outline-none focus:ring-2 focus:ring-vireoka-indigo/30"
                    placeholder="Fund / Studio / Individual"
                  />
                </label>

                <label className="block">
                  <div className="text-sm font-semibold text-neutral-900">Role</div>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as Role)}
                    className="mt-2 w-full rounded-xl border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 outline-none focus:ring-2 focus:ring-vireoka-indigo/30"
                  >
                    <option value="vc">VC</option>
                    <option value="angel">Angel</option>
                    <option value="advisor">Advisor</option>
                    <option value="partner">Partner</option>
                    <option value="contributor">Contributor</option>
                  </select>
                </label>
              </div>

              <label className="block">
                <div className="text-sm font-semibold text-neutral-900">Message</div>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="mt-2 min-h-[120px] w-full rounded-xl border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 outline-none focus:ring-2 focus:ring-vireoka-indigo/30"
                  placeholder="What do you want to evaluate or help with? (e.g., Kairo pilot feedback, governance guardrails, market partnerships, diligence)"
                />
              </label>

              {err ? (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
                  {err}
                </div>
              ) : null}

              {status === "ok" ? (
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
                  Request received. You’ll get an email with next steps.
                </div>
              ) : null}

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  type="submit"
                  disabled={!canSubmit || status === "sending"}
                  className={[
                    "rounded-xl px-4 py-2 text-sm font-semibold shadow-sm",
                    // Force visibility even if any global CSS styles buttons strangely
                    "!bg-vireoka-indigo !text-white hover:opacity-95",
                    "disabled:opacity-60 disabled:cursor-not-allowed",
                    "focus:outline-none focus:ring-2 focus:ring-vireoka-indigo/40",
                  ].join(" ")}
                >
                  {status === "sending" ? "Submitting..." : "Submit request"}
                </button>

                <a
                  className="text-sm font-semibold text-neutral-700 hover:underline"
                  href="/intelligence/access"
                >
                  View access model
                </a>
              </div>
            </form>
          </div>
        </section>

        <aside className="lg:col-span-5 space-y-6">
          <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-6 sm:p-8">
            <h2 className="text-lg font-semibold text-neutral-900">What to expect</h2>
            <p className="mt-3 text-sm leading-6 text-neutral-700">
              Vireoka Intelligence contains sensitive product and infrastructure details. Access is staged to protect both you and us.
            </p>
            <ul className="mt-3 space-y-2 text-sm leading-6 text-neutral-700">
              <li>
                <span className="font-semibold text-neutral-900">NDA-first:</span> if approved, you’ll receive an NDA link (email) to unlock protected materials.
              </li>
              <li>
                <span className="font-semibold text-neutral-900">Approval gates:</span> role-based lanes unlock after approval + NDA/terms acceptance.
              </li>
              <li>
                <span className="font-semibold text-neutral-900">No manual headers:</span> once you’re approved, the portal works via secure httpOnly cookies.
              </li>
            </ul>
          </div>

          <div className="rounded-2xl border border-neutral-200 bg-white p-6 sm:p-8 shadow-sm">
            <h2 className="text-lg font-semibold text-neutral-900">How access works</h2>
            <ol className="mt-3 space-y-3 text-sm text-neutral-700">
              <li>
                <span className="font-semibold">1) Request</span> — submit your details and intended role.
              </li>
              <li>
                <span className="font-semibold">2) Review</span> — we confirm fit and set the appropriate access lane.
              </li>
              <li>
                <span className="font-semibold">3) NDA</span> — approved users sign the NDA and accept terms.
              </li>
              <li>
                <span className="font-semibold">4) Portal</span> — role-specific materials unlock based on approval + NDA.
              </li>
            </ol>
          </div>
        </aside>
      </div>
    </main>
  );
}
