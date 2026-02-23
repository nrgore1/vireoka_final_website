import Link from "next/link";

export default function PublicSafe() {
  return (
    <section className="mx-auto max-w-6xl px-4 sm:px-6 py-12 sm:py-16">
      <div className="rounded-xl border p-6 sm:p-8">
        <h3 className="mb-3 font-semibold">Public-safe by design</h3>

        <p className="mb-4 max-w-3xl">
          This site is intentionally high-level. We believe AI systems should be
          understood before they are trusted. Deeper technical material,
          implementation details, and product demonstrations are available
          through the NDA-gated investor portal for qualified investors.
        </p>

        <p className="mb-4 max-w-3xl">
          If you care about deploying AI systems that can be explained, reviewed,
          and defended — not just optimized — you are in the right place.
        </p>

        <Link href="/investors" className="text-sm underline">
          Vireoka Intelligence →
        </Link>
      </div>
    </section>
  );
}
