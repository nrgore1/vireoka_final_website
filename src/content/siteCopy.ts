export const siteCopy = {
  brand: {
    name: "Vireoka",
    tagline: "Cognitive Governance for governable AI.",
  },

  nav: [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/resources", label: "Resources" },
    { href: "/investors", label: "Investors" },
  ],

  home: {
    heroTitle: "Governable AI for real-world accountability",
    heroSubtitle:
      "Vireoka brings Cognitive Governance to AI workflows: policy-aligned decisions, traceable lineage, and audit-ready evidence—without leaking confidential internals.",
    bullets: [
      "Enforce policy gates (ALLOW / REVIEW / BLOCK) on AI actions.",
      "Preserve lineage and replay integrity so decisions can be reproduced.",
      "Ship faster with oversight that scales: councils, quorums, and confidence scoring.",
    ],
    ctaPrimary: { label: "Explore resources", href: "/resources" },
    ctaSecondary: { label: "Vireoka Intelligence (NDA)", href: "/investors" },

    sections: [
      {
        title: "What we mean by Cognitive Governance",
        body:
          "Accuracy isn’t the same as accountability. Cognitive Governance governs how decisions are made over time: policies, review councils, confidence scoring, lineage, and replayable evidence trails.",
      },
      {
        title: "Where this helps first",
        body:
          "Any environment where decisions must be defensible: regulated workflows, security operations, finance, legal review, and enterprise AI programs with board-level oversight.",
      },
      {
        title: "Why this is different",
        body:
          "Vireoka is designed for verifiability: not just answers, but the ability to explain, reproduce, and enforce constraints before automation takes action.",
      },
    ],
  },

  about: {
    title: "About Vireoka",
    body: [
      "Vireoka builds governable AI systems for organizations that cannot afford black-box decisions.",
      "Cognitive Governance turns AI workflows into policy-aligned, auditable decision systems: councils for review, confidence scoring, lineage, replay integrity, and enforceable constraints.",
      "Public pages intentionally stay high-level. Deeper architecture, demos, and investor materials are available under NDA to qualified parties.",
    ],
    principlesTitle: "What we believe",
    principles: [
      "If a decision matters, you should be able to explain it, reproduce it, and enforce policy on it.",
      "Governance should scale with risk: low-friction where safe, strict gates where required.",
      "Transparency without leakage: share evidence and guarantees without exposing confidential mechanics.",
    ],
  },

  resources: {
    title: "Resources",
    publicWhitepaper: {
      title: "Public Whitepaper: Cognitive Governance (Public Edition)",
      description:
        "A public-safe overview of governable AI: policies, councils, confidence, lineage, replay integrity, and audit-ready exports—without disclosing proprietary internals.",
      href: "/resources/whitepaper",
    },
    ethicsCharter: {
      title: "Responsible AI & Ethics Charter (Public)",
      description:
        "Practical commitments for safe deployment: disclosure, constraints, oversight, and controlled access.",
      href: "/resources/ethics",
    },
    teasers: {
      title: "30-second teasers (public-safe)",
      description:
        "Short scripts suitable for voiceover + motion graphics—trust-building, no confidential details.",
      href: "/resources/teasers",
    },
  },

  investors: {
    title: "Strategic Access (NDA required)",
    body: [
      "We share detailed technical and financial materials with verified investors under NDA.",
      "Access is time-bound and reviewed manually to protect confidential IP.",
    ],
    steps: [
      "Apply with your investor details",
      "Review and accept the NDA",
      "Await approval (manual review)",
      "Access granted (time-bound)",
    ],
    ctaApply: { label: "Apply", href: "/investors/apply" },
    ctaStatus: { label: "Check status", href: "/investors/status" },
    ctaPortal: { label: "Investor portal", href: "/investors/portal" },
  },

  footer: {
    disclaimer:
      "Vireoka provides governance tooling and educational material. Nothing on this website is legal, medical, or financial advice.",
    copyright: `© ${new Date().getFullYear()} Vireoka LLC`,
  },
} as const;
