import Link from "next/link";

export function CTABar({
  primaryHref,
  primaryLabel,
  secondaryHref,
  secondaryLabel,
}: {
  primaryHref: string;
  primaryLabel: string;
  secondaryHref?: string;
  secondaryLabel?: string;
}) {
  return (
    <div className="mt-8 flex flex-wrap items-center gap-3">
      <Link
        href={primaryHref}
        className="inline-flex items-center justify-center rounded-xl bg-vireoka-indigo px-5 py-3 text-sm font-semibold text-white shadow-sm hover:opacity-95"
      >
        {primaryLabel}
      </Link>

      {secondaryHref && secondaryLabel ? (
        <Link
          href={secondaryHref}
          className="inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-900 hover:bg-gray-50"
        >
          {secondaryLabel}
        </Link>
      ) : null}
    </div>
  );
}
