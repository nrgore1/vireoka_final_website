export const metadata = {
  title: "Vireoka Intelligence — FAQ",
  description: "Frequently asked questions about Vireoka Intelligence and access tiers.",
};

function QA({ q, a }: { q: string; a: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
      <h2 className="text-base font-semibold text-neutral-900">{q}</h2>
      <div className="mt-2 text-sm leading-6 text-neutral-700">{a}</div>
    </div>
  );
}

export default function FAQPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <header>
        <a className="text-sm font-semibold text-neutral-700 hover:underline" href="/intelligence">
          ← Back to Intelligence
        </a>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-neutral-900">
          FAQ
        </h1>
        <p className="mt-4 text-base leading-7 text-neutral-700">
          Quick answers for collaborators, evaluators, and investors.
        </p>
      </header>

      <section className="mt-10 grid gap-4">
        <QA
          q="Is Vireoka a general AI product?"
          a={
            <p>
              Vireoka focuses on trustworthy, governed intelligence—practical systems that help teams
              make and execute decisions with constraints, auditability, and controlled autonomy.
            </p>
          }
        />
        <QA
          q="Why do you gate information by role?"
          a={
            <p>
              Because responsible disclosure matters. Some materials are safe to share publicly;
              others require verification and NDA to protect IP and avoid misuse.
            </p>
          }
        />
        <QA
          q="What can contributors do without access to confidential materials?"
          a={
            <p>
              A lot: provide edge cases, evaluation rubrics, domain expectations, usability feedback,
              and scenario tests—without needing proprietary details.
            </p>
          }
        />
        <QA
          q="How do you decide who gets Advisor/Angel access?"
          a={
            <p>
              We use basic verification and alignment checks (domain relevance, intent, conflicts)
              and then stage access based on what’s needed for meaningful engagement.
            </p>
          }
        />
        <QA
          q="Do I need to share my organization’s proprietary data?"
          a={
            <p>
              No. We don’t require you to expose sensitive data. Collaboration is designed to work
              with abstracted scenarios and structured feedback unless a partner pilot is mutually agreed.
            </p>
          }
        />
        <QA
          q="Where do I start?"
          a={
            <p>
              Visit <a className="font-semibold underline" href="/intelligence/roles">Roles</a>{" "}
              or send a note via <a className="font-semibold underline" href="/intelligence/apply">Apply / Contact</a>.
            </p>
          }
        />
      </section>
    </main>
  );
}
