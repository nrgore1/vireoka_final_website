export const metadata = { title: "Private — Angel lane" };

export default function AngelLane() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <a className="text-sm font-semibold text-neutral-700 hover:underline" href="/intelligence/(protected)">
        ← Back to private workspace
      </a>
      <h1 className="mt-4 text-2xl font-semibold text-neutral-900">Angel lane</h1>
      <p className="mt-3 text-sm leading-6 text-neutral-700">
        This area is reserved for verified angels and invited participants. Materials here are staged
        and may require NDA confirmation depending on the item.
      </p>

      <div className="mt-8 rounded-2xl border border-neutral-200 bg-neutral-50 p-6">
        <h2 className="text-base font-semibold text-neutral-900">What lives here</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-neutral-700">
          <li>Diligence checklist and Q&A organization</li>
          <li>Private briefs and milestone summaries (role-dependent)</li>
          <li>Secure links to supporting materials when approved</li>
        </ul>
      </div>
    </main>
  );
}
