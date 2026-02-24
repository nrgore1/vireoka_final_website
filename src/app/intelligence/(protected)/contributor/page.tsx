export const metadata = { title: "Private — Contributor lane" };

export default function ContributorLane() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <a className="text-sm font-semibold text-neutral-700 hover:underline" href="/intelligence/(protected)">
        ← Back to private workspace
      </a>
      <h1 className="mt-4 text-2xl font-semibold text-neutral-900">Contributor lane</h1>
      <p className="mt-3 text-sm leading-6 text-neutral-700">
        This area is for verified contributors working on structured evaluation tasks, rubrics,
        and domain feedback. We keep tasks scoped so you can contribute without needing proprietary details.
      </p>

      <div className="mt-8 rounded-2xl border border-neutral-200 bg-neutral-50 p-6">
        <h2 className="text-base font-semibold text-neutral-900">What lives here</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-neutral-700">
          <li>Scenario packs and edge-case prompts</li>
          <li>Evaluation rubrics and acceptance criteria</li>
          <li>Submission templates and status tracking</li>
        </ul>
      </div>
    </main>
  );
}
