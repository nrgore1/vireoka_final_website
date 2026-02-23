"use client";

type Props = {
  commId: string;
};

export default function InvestorDeckLink({ commId }: Props) {
  const deckUrl = `/api/intelligence/deck?commId=${encodeURIComponent(commId)}`;

  return (
    <a
      href={deckUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 rounded border px-4 py-2 text-sm font-medium hover:bg-neutral-50"
    >
      📄 Download Investor Deck (Watermarked)
    </a>
  );
}
