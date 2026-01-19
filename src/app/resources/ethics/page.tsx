type EthicsSection = {
  heading: string;
  bullets?: readonly string[];
  paragraphs?: readonly string[];
};

const SECTIONS: readonly EthicsSection[] = [
  {
    heading: "Scope and intent",
    bullets: [
      "This charter states public commitments for safe deployment and controlled disclosure.",
      "Public artifacts stay high-level by design; deeper mechanics and sensitive details are shared only under NDA.",
    ],
  },
  {
    heading: "Principles",
    paragraphs: [
      "We prioritize safety, alignment, and responsible deployment.",
      "We avoid unnecessary exposure of sensitive system internals.",
    ],
  },
  {
    heading: "Disclosure",
    bullets: [
      "Capabilities are described conservatively.",
      "Operational details are disclosed progressively.",
    ],
  },
];

export default function EthicsPage() {
  return (
    <main className="max-w-3xl space-y-10">
      {SECTIONS.map((s) => (
        <section key={s.heading} className="space-y-3">
          <h2 className="text-xl font-semibold">{s.heading}</h2>
          <ul className="list-disc pl-5 space-y-2">
            {s.bullets?.map((b) => (
              <li key={b}>{b}</li>
            ))}
            {s.paragraphs?.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        </section>
      ))}
    </main>
  );
}
