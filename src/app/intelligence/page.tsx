import Link from "next/link";

export const dynamic = "force-dynamic";

export default function InvestorsLandingPage() {
  return (
    <main className="max-w-5xl mx-auto px-4 py-16 space-y-10">
      <div className="space-y-4">
        <h1 className="text-3xl font-semibold">
          Strategic Access (NDA required)
        </h1>

        <p className="text-neutral-700 max-w-2xl">
          We share detailed technical, financial, and architectural materials
          with verified collaborators under NDA.  
          Access is time-bound and reviewed manually to protect confidential IP.
        </p>
      </div>

      <div className="rounded-xl border p-6 space-y-4">
        <div className="font-semibold">Access steps</div>

        <ul className="text-sm text-neutral-700 space-y-1">
          <li>Apply with your details</li>
          <li>Review and accept the NDA</li>
          <li>Await approval (manual review)</li>
          <li>Access granted (time-bound)</li>
        </ul>

        <div className="flex gap-3 pt-3">
          <Link
            href="/intelligence/apply"
            className="px-4 py-2 rounded-lg bg-black text-white text-sm"
          >
            Apply
          </Link>

          <Link
            href="/intelligence/status"
            className="px-4 py-2 rounded-lg border text-sm"
          >
            Check status
          </Link>

          <Link
            href="/portal/overview"
            className="px-4 py-2 rounded-lg border text-sm"
          >
            Vireoka Intelligence
          </Link>
        </div>
      </div>

      <div className="rounded-xl border p-6">
        <div className="font-semibold mb-2">Why NDA gating exists</div>
        <p className="text-sm text-neutral-700">
          Our public materials are intentionally high-level.  
          Vireoka Intelligence contains structured demonstrations of our
          governed agentic workforce platform and is accessible only
          to approved collaborators.
        </p>
      </div>
    </main>
  );
}
