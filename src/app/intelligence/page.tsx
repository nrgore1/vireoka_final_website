export const metadata = {
  title: "Vireoka Intelligence",
  description:
    "A role-based collaboration space for advisors, angels, and contributors exploring ethical AI, governance, and digital employees.",
};

function Card({
  title,
  body,
  href,
  eyebrow,
}: {
  title: string;
  body: string;
  href: string;
  eyebrow?: string;
}) {
  return (
    <a
      href={href}
      className="block rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
    >
      {eyebrow ? (
        <div className="text-xs font-semibold tracking-wide text-neutral-500">
          {eyebrow}
        </div>
      ) : null}
      <h3 className="mt-2 text-lg font-semibold text-neutral-900">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-neutral-700">{body}</p>
      <div className="mt-4 text-sm font-semibold text-neutral-900">
        Explore →
      </div>
    </a>
  );
}

export default function IntelligenceHome() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <header className="max-w-2xl">
        <div className="inline-flex items-center rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 text-xs font-semibold text-neutral-700">
          Vireoka Intelligence
        </div>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-neutral-900">
          A collaboration space for ethical AI, governance, and trusted digital work.
        </h1>
        <p className="mt-4 text-base leading-7 text-neutral-700">
          This section is designed for vetted collaborators—advisors, angels, domain
          experts, and contributors—who want to help shape responsible AI solutions
          that are auditable, aligned, and practical in the real world.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <a
            className="rounded-xl bg-neutral-900 px-4 py-2 text-sm font-semibold text-white hover:bg-neutral-800"
            href="/intelligence/vision"
          >
            Read the vision
          </a>
          <a
            className="rounded-xl border border-neutral-300 bg-white px-4 py-2 text-sm font-semibold text-neutral-900 hover:bg-neutral-50"
            href="/intelligence/roles"
          >
            Choose your role
          </a>
          <a
            className="rounded-xl border border-neutral-300 bg-white px-4 py-2 text-sm font-semibold text-neutral-900 hover:bg-neutral-50"
            href="/intelligence/faq"
          >
            FAQ
          </a>
        </div>
      </header>

      <section className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card
          eyebrow="North Star"
          title="Vision"
          body="What we’re building: practical ethical AI and governance that supports real teams, real decisions, and real accountability."
          href="/intelligence/vision"
        />
        <Card
          eyebrow="What it is"
          title="Platform"
          body="A modular approach that helps organizations move from experimentation to governed deployment—without sacrificing speed."
          href="/intelligence/platform"
        />
        <Card
          eyebrow="What it enables"
          title="Digital Employees"
          body="Trusted task automation and assistant workflows designed for reliability, traceability, and controlled autonomy."
          href="/intelligence/digital-employees"
        />
        <Card
          eyebrow="Get involved"
          title="Roles"
          body="Advisors, angels, and contributors each have a clear lane and expectations."
          href="/intelligence/roles"
        />
        <Card
          eyebrow="Process"
          title="Access & trust"
          body="Role-based access, staged disclosure, and NDA-first handling for confidential materials."
          href="/intelligence/access"
        />
        <Card
          eyebrow="Start here"
          title="Apply / Contact"
          body="Tell us who you are, what you can contribute, and what you’re looking to learn or validate."
          href="/intelligence/apply"
        />
      </section>

      <section className="mt-12 rounded-2xl border border-neutral-200 bg-neutral-50 p-6">
        <h2 className="text-lg font-semibold text-neutral-900">
          Why “Intelligence”?
        </h2>
        <p className="mt-2 text-sm leading-6 text-neutral-700">
          Because the goal isn’t “more AI.” It’s better outcomes—decisions and actions
          that are explainable, defensible, and aligned with constraints (policy,
          safety, ethics, and business reality).
        </p>
        <p className="mt-3 text-sm leading-6 text-neutral-700">
          In this space you’ll find concept briefs, structured collaboration paths,
          and (when appropriate) access to confidential materials based on role and
          verification status.
        </p>
      </section>
    </main>
  );
}
