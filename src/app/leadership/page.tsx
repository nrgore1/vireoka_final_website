import Link from "next/link";

export default function LeadershipPage() {
  return (
    <section>
      <h1 className="text-3xl font-semibold text-vireoka-indigo">
        Leadership & Writing
      </h1>

      <p className="mt-3 max-w-2xl text-neutral-700">
        Essays and analysis on agentic AI, governance, compliance, and decision
        accountability—written from first principles and real-world experience.
      </p>

      {/* Core Essays */}
      <h2 className="mt-12 text-xl font-semibold text-vireoka-indigo">
        Core Essays
      </h2>

      <div className="mt-6 space-y-6 max-w-3xl">
        {/* Existing Essay */}
        <div className="rounded-lg border border-vireoka-line p-6">
          <h3 className="text-lg font-medium text-vireoka-indigo">
            Why Agentic AI Without Governance Is a Liability
          </h3>
          <p className="mt-2 text-sm text-neutral-700">
            Why accuracy metrics are insufficient once AI systems begin making
            autonomous decisions—and what governance must look like instead.
          </p>
          <Link
            href="/leadership/agentic-ai-governance-liability"
            className="inline-block mt-3 text-sm text-vireoka-teal underline underline-offset-4"
          >
            Read essay →
          </Link>
        </div>

        {/* NEW Essay */}
        <div className="rounded-lg border border-vireoka-line p-6">
          <h3 className="text-lg font-medium text-vireoka-indigo">
            Dr. Martin Luther King Jr. and the Moral Architecture of AI Governance
          </h3>
          <p className="mt-2 text-sm text-neutral-700">
            How Dr. King’s philosophy of justice, conscience, and interconnectedness
            offers a powerful ethical blueprint for governing AI systems in a world
            increasingly shaped by algorithms.
          </p>
          <Link
            href="/leadership/mlk-moral-architecture-ai"
            className="inline-block mt-3 text-sm text-vireoka-teal underline underline-offset-4"
          >
            Read essay →
          </Link>
        </div>
      </div>

      <hr className="my-16 border-vireoka-line" />

      {/* About the Author */}
      <section className="max-w-2xl">
        <h2 className="text-xl font-semibold text-vireoka-indigo">
          About the Author
        </h2>
        <p className="mt-3 text-sm text-neutral-700">
          <strong>Dr. Narendra Gore</strong> is the founder of Vireoka. His work
          focuses on agentic AI systems, cognitive governance, compliance-aware
          automation, and decision accountability in high-stakes environments.
        </p>
      </section>
    </section>
  );
}
