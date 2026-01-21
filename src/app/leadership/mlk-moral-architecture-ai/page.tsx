import Link from "next/link";

export const metadata = {
  title: "The Moral Architecture of AI — A Tribute to Dr. Martin Luther King Jr. | Vireoka",
  description:
    "How Dr. Martin Luther King Jr.’s philosophy offers a moral architecture for governing agentic AI systems in an algorithmic world.",
};

export default function MLKEssayPage() {
  return (
    <article className="prose prose-neutral max-w-3xl mx-auto">
      <Link href="/leadership" className="text-sm no-underline">
        ← Back to Leadership
      </Link>

      <h1 className="mt-6">
        The Moral Architecture of AI  
        <span className="block text-base text-neutral-500 font-normal">
          A Tribute to Dr. Martin Luther King Jr.
        </span>
      </h1>

      <p>
        In a world increasingly orchestrated by algorithms, Dr. Martin Luther
        King Jr.’s philosophy offers a profound moral architecture that is
        startlingly relevant to artificial intelligence. His insights into
        power, justice, and human interconnectedness provide the ethical
        bedrock that modern AI governance—often fixated on technical
        metrics—desperately needs.
      </p>

      <h2>The Gap Between Capability and Conscience</h2>

      <blockquote>
        “Our scientific power has outrun our spiritual power. We have guided
        missiles and misguided men.”
      </blockquote>

      <p>
        This statement may be the most precise diagnosis of the AI era. We have
        built autonomous agents of immense precision, but governance structures
        frequently lack an equivalent moral framework. Speed and optimization
        have outpaced conscience.
      </p>

      <p>
        AI governance must therefore prioritize ethical guardrails and
        human-in-the-loop decision making. Systems should halt execution when
        moral boundaries are crossed—not merely when technical failures occur.
      </p>

      <h2>The Algorithmic Network of Mutuality</h2>

      <blockquote>
        “We are caught in an inescapable network of mutuality, tied in a single
        garment of destiny.”
      </blockquote>

      <p>
        AI systems embody this network. Bias, vulnerabilities, and design
        decisions propagate globally. Governance must therefore adopt systemic
        observability—tracking ethical impact across the full lifecycle of data,
        models, and deployment.
      </p>

      <h2>Justice in the Black Box</h2>

      <blockquote>
        “Injustice anywhere is a threat to justice everywhere.”
      </blockquote>

      <p>
        When injustice hides inside opaque models, accountability erodes.
        Explainability and data isolation are no longer optional; they are
        prerequisites for legitimacy.
      </p>

      <h2>Judgment by Character, Not Proxy</h2>

      <blockquote>
        “Not by the color of their skin, but by the content of their character.”
      </blockquote>

      <p>
        AI too often judges by proxy—demographics, correlations, and historical
        artifacts. Governance must enforce counterfactual fairness testing and
        adversarial audits to prevent encoded discrimination.
      </p>

      <h2>The Danger of Silence</h2>

      <blockquote>
        “Our lives begin to end the day we become silent about things that matter.”
      </blockquote>

      <p>
        Silence in AI systems and organizations is complicity. Immutable audit
        logs and whistleblower protections must be embedded into the
        architecture, ensuring systems and people alike can speak when norms
        are violated.
      </p>

      <h2>A Governance Vision Rooted in Conscience</h2>

      <p>
        Dr. King’s call to spiritual power is a call for purpose. AI governance
        must extend beyond compliance toward conscience—designing systems that
        preserve dignity, accountability, and human agency by construction.
      </p>

      <p className="text-sm text-neutral-500">
        Related viewing: “How to Design Your Life’s Blueprint” — Dr. Martin
        Luther King Jr.
      </p>
    </article>
  );
}
