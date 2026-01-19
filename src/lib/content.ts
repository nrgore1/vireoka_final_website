export type Whitepaper = {
  slug: string;
  title: string;
  summary: string;
  audience: ("Executives" | "Compliance" | "Engineers" | "Investors")[];
  updated: string; // ISO date
  file: string;    // /public/docs/...
};

export type TrustArtifact = {
  title: string;
  summary: string;
  items: { label: string; href: string; note?: string }[];
};

export type TeaserVideo = {
  title: string;
  summary: string;
  mp4: string;     // /public/videos/...
  poster?: string; // /public/videos/...
  seconds?: number;
};

export const whitepapers: Whitepaper[] = [
  {
    slug: "governance-first-ai",
    title: "Vireoka Whitepaper: Governance-First Intelligence",
    summary:
      "Technical + strategic overview of Vireoka’s governance model: councils, policy enforcement, confidence scoring, lineage, replay, and signed exports.",
    audience: ["Executives", "Compliance", "Engineers", "Investors"],
    updated: "2026-01-16",
    file: "/docs/vireoka-whitepaper.pdf",
  },
  {
    slug: "responsible-ai-charter",
    title: "Responsible AI & Ethics Charter",
    summary:
      "Commitments, constraints, disclosure practices, and governance policies that keep intelligence safe, auditable, and defensible.",
    audience: ["Executives", "Compliance", "Investors"],
    updated: "2026-01-16",
    file: "/docs/vireoka-responsible-ai-charter.pdf",
  },
];

export const trustArtifacts: TrustArtifact[] = [
  {
    title: "Auditability & Integrity",
    summary:
      "Evidence that decisions are reproducible, tamper-evident, and independently verifiable.",
    items: [
      { label: "Lineage & Replay Overview", href: "/trust#lineage" },
      { label: "Signed Exports (JSON + PDF)", href: "/trust#exports" },
      { label: "Key Rotation & KID Strategy", href: "/trust#keys" },
    ],
  },
  {
    title: "Security & Governance Controls",
    summary:
      "How governance constraints are enforced and how risk is controlled across tiers.",
    items: [
      { label: "Policy Engine (ALLOW / REVIEW / BLOCK)", href: "/trust#policy" },
      { label: "Council Quorums & Dissent Preservation", href: "/trust#councils" },
      { label: "Execution Guardrails (dry-run, rollback)", href: "/trust#execution" },
    ],
  },
];

export const teaserVideos: TeaserVideo[] = [
  {
    title: "Vireoka in 30 seconds",
    summary: "What Vireoka is, why governance matters, and what you get.",
    mp4: "/videos/vireoka-30s.mp4",
    poster: "/videos/vireoka-30s-poster.jpg",
    seconds: 30,
  },
  {
    title: "Governance Timeline Demo Teaser",
    summary: "A glimpse of the Governance Timeline UI and decision drill-down.",
    mp4: "/videos/governance-timeline-30s.mp4",
    poster: "/videos/governance-timeline-30s-poster.jpg",
    seconds: 30,
  },
];
