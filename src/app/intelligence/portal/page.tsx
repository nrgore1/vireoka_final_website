import Link from "next/link";
import { accessCheck } from "@/agents/investor/investorManagerAgent";

export default async function IntelligencePortalPage() {
  const r = await accessCheck();

  // Layout already redirects when not allowed, but keep it safe
  if (!r.ok || r.state !== "allowed") {
    return (
      <main className="mx-auto max-w-4xl px-4 sm:px-6 py-12">
        <h1 className="text-2xl font-semibold text-vireoka-indigo">Vireoka Intelligence</h1>
        <p className="mt-3 text-neutral-700">Access is currently unavailable.</p>
        <div className="mt-6">
          <Link className="underline text-vireoka-teal" href="/intelligence">
            Back to Intelligence
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-5xl px-4 sm:px-6 py-12">
      <div className="rounded-xl border border-vireoka-line bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-vireoka-indigo">Confidential Portal</h1>
        <p className="mt-2 text-sm text-neutral-700">
          Role: <span className="font-semibold">{r.role ?? "member"}</span>
        </p>

        <div className="mt-5 flex flex-wrap gap-3">
          <Link
            className="rounded-md border border-vireoka-line px-4 py-2 text-sm hover:bg-vireoka-ash"
            href="/intelligence/documents"
          >
            Document Vault
          </Link>
          <Link
            className="rounded-md border border-vireoka-line px-4 py-2 text-sm hover:bg-vireoka-ash"
            href="/portal/overview"
          >
            Portal Overview
          </Link>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <section className="rounded-lg border border-vireoka-line p-4">
            <h2 className="font-semibold text-vireoka-indigo">What you can do here</h2>
            <ul className="mt-2 list-disc pl-5 text-sm text-neutral-700 space-y-1">
              <li>Review confidential product and governance materials.</li>
              <li>Access role-specific briefs (advisor / angel / partner / crowdsourcing).</li>
              <li>Request meetings and submit questions for follow-up.</li>
            </ul>
          </section>

          <section className="rounded-lg border border-vireoka-line p-4">
            <h2 className="font-semibold text-vireoka-indigo">Notes</h2>
            <p className="mt-2 text-sm text-neutral-700">
              This area is NDA + Terms gated. Next step is to store acceptance and roles in Supabase tables
              (auditable + revocable) so the admin dashboards become fully meaningful.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
