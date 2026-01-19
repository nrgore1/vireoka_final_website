export const publicWhitepaper = {
  title: "Cognitive Governance: Making AI Decisions Verifiable, Policy-Aligned, and Audit-Ready (Public Edition)",
  sections: [
    {
      heading: "Why ‘accuracy’ is not enough",
      paragraphs: [
        "AI adoption often fails in high-stakes settings for reasons that have nothing to do with model quality: unclear authority, missing constraints, no reproducibility, and no audit trail.",
        "When decisions affect customers, money, safety, or compliance, organizations need governable systems: decisions that can be explained, reproduced, and constrained by policy before action is taken.",
      ],
    },
    {
      heading: "What Cognitive Governance means",
      paragraphs: [
        "Cognitive Governance is governance of how intelligence reasons over time—not just the final output. It adds enforceable constraints and evidence trails to AI workflows.",
        "In practice this includes: policy gates (ALLOW / REVIEW / BLOCK), structured review (councils and quorums), confidence scoring, lineage tracking, replay integrity, and exportable audit evidence.",
      ],
    },
    {
      heading: "A simple operating model",
      paragraphs: [
        "Not every decision needs human approval. Cognitive Governance scales with risk: low-friction automation where safe, and stricter review where the stakes demand it.",
        "Teams can preserve dissent, keep a decision timeline, and provide board- and regulator-friendly evidence without exposing confidential implementation details.",
      ],
    },
    {
      heading: "Trust-by-design deliverables",
      paragraphs: [
        "Vireoka’s public materials focus on outcomes and guarantees rather than confidential mechanics. Typical trust artifacts include: lineage and replay summaries, policy diffs, decision timelines, and tamper-evident audit logs.",
        "Under NDA, qualified parties can review deeper architecture, demos, and verification tooling.",
      ],
    },
    {
      heading: "Adoption path",
      paragraphs: [
        "Most teams start with one workflow where accountability is painful today (e.g., approvals, compliance-sensitive automation, security operations).",
        "From there, governance controls expand incrementally: begin with policy gates and audit logs, then add councils, confidence thresholds, and signed exports as needed.",
      ],
    },
    {
      heading: "Glossary (short)",
      paragraphs: [
        "Policy gate: an enforceable rule that allows, requires review, or blocks an action.",
        "Council: a structured multi-reviewer process with quorums and preserved dissent.",
        "Lineage: the chain of inputs, transformations, and decisions leading to an outcome.",
        "Replay integrity: the ability to reproduce a decision with the same evidence trail.",
      ],
    },
  ],
} as const;
