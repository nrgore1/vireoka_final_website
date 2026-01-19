export const ethicsCharter = {
  title: "Responsible AI & Ethics Charter (Public)",
  sections: [
    {
      heading: "Scope and intent",
      bullets: [
        "This charter states public commitments for safe deployment and controlled disclosure.",
        "Public artifacts stay high-level by design; deeper mechanics and sensitive details are shared only under NDA.",
      ],
    },
    {
      heading: "Trust-by-design commitments",
      bullets: [
        "Accountability: decisions should be attributable to owners, policies, and review steps.",
        "Explainability: provide understandable reasons and evidence trails appropriate to the audience.",
        "Reproducibility: preserve lineage and replayability where feasible for high-stakes decisions.",
        "Policy enforcement: constraints must be enforceable before automation takes action.",
      ],
    },
    {
      heading: "Risk-aware governance",
      bullets: [
        "Scale governance with risk: low friction where safe; strict review gates where required.",
        "Preserve dissent and uncertainty: do not force artificial consensus or overconfidence.",
        "Use confidence thresholds and escalation paths for ambiguous or high-impact cases.",
      ],
    },
    {
      heading: "Security and privacy",
      bullets: [
        "Protect sensitive data and secrets; follow least-privilege principles.",
        "Use tamper-evident audit logs for critical decisions and actions.",
        "Rotate keys and maintain backward decryption where required for audit continuity.",
      ],
    },
    {
      heading: "Human oversight and control",
      bullets: [
        "Humans remain accountable for high-impact outcomes.",
        "Provide clear review interfaces and override mechanisms.",
        "Avoid dark patterns in approvals; make policy and impact visible at decision time.",
      ],
    },
  ],
} as const;
