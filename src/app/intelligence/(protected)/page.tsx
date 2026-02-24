export const metadata = {
  title: "Vireoka Intelligence — Private",
  description: "Protected workspace for verified collaborators.",
};

function Box({
  title,
  body,
  hint,
  href,
}: {
  title: string;
  body: string;
  hint: string;
  href: string;
}) {
  return (
    <a
      href={href}
      className="block rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <h2 className="text-lg font-semibold text-neutral-900">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-neutral-700">{body}</p>
      <p className="mt-3 text-xs text-neutral-500">{hint}</p>
      <div className="mt-4 text-sm font-semibold text-neutral-900">Open →</div>
    </a>
  );
}

export default function ProtectedHome() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <header className="max-w-2xl">
        <h1 className="text-3xl font-semibold tracking-tight text-neutral-900">
          Private workspace
        </h1>
        <p className="mt-4 text-base leading-7 text-neutral-700">
          You’re in the protected Intelligence area. Access here is role-based and may include
          confidential briefs, collaboration tasks, and guided materials.
        </p>
        <p className="mt-3 text-sm leading-6 text-neutral-700">
          If something appears locked, it usually means your role or verification level doesn’t
          include that lane yet.
        </p>
      </header>

      <section className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Box
          title="Advisor lane"
          body="Structured reviews, feedback templates, and briefings intended for advisory input."
          hint="Requires Advisor role (or invitation)."
          href="/intelligence/(protected)/advisor"
        />
        <Box
          title="Angel lane"
          body="Staged diligence materials and Q&A organization for aligned angel investors."
          hint="Requires Angel role (or invitation)."
          href="/intelligence/(protected)/angel"
        />
        <Box
          title="Contributor lane"
          body="Scenarios, rubrics, and evaluation tasks for domain experts and reviewers."
          hint="Requires Contributor role (verification-based)."
          href="/intelligence/(protected)/contributor"
        />
        <Box
          title="Documents"
          body="A vault for private documents (only what your role can access)."
          hint="Visibility varies by role."
          href="/intelligence/documents"
        />
        <Box
          title="Status"
          body="Check your access status and next steps."
          hint="Always available."
          href="/intelligence/status"
        />
        <Box
          title="Support"
          body="Need access adjusted or something looks wrong? Start here."
          hint="We’ll route your request."
          href="/intelligence/apply"
        />
      </section>
    </main>
  );
}
