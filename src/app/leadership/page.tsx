import Link from "next/link";

export default function LeadershipPage() {
  return (
    <div className="space-y-12 max-w-3xl">
      <header className="space-y-4">
        <h1 className="text-4xl font-semibold">Leadership & Writing</h1>
        <p className="text-neutral-700">
          Essays and analysis on agentic AI, governance, compliance, and decision
          accountability—written from first principles and real-world
          experience.
        </p>
      </header>

      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">Core Essays</h2>

        <article className="border rounded-lg p-5">
          <h3 className="font-semibold text-lg">
            Why Agentic AI Without Governance Is a Liability
          </h3>
          <p className="mt-2 text-sm text-neutral-700">
            Why accuracy metrics are insufficient once AI systems begin making
            autonomous decisions—and what governance must look like instead.
          </p>
          <Link
            href="/leadership/why-agentic-ai-without-governance"
            className="inline-block mt-3 text-sm underline underline-offset-4"
          >
            Read essay →
          </Link>
        </article>
      </section>

      <section className="border-t pt-8 space-y-3">
        <h2 className="text-xl font-semibold">About the Author</h2>
        <p className="text-sm text-neutral-700">
          <strong>Dr. Narendra Gore</strong> is the founder of Vireoka. His work
          focuses on agentic AI systems, cognitive governance, compliance-aware
          automation, and decision accountability in high-stakes environments.
        </p>
      </section>
    </div>
  );
}
