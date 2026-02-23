import Link from "next/link";
import { siteCopy } from "@/content/siteCopy";

export default function HomePage() {
  const c = siteCopy.home;

  return (
    <div className="space-y-20">
      {/* Hero */}
      <section className="space-y-6">
        <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-vireoka-indigo max-w-3xl">
          {c.heroTitle}
        </h1>

        <p className="text-lg text-neutral-700 max-w-2xl">
          {c.heroSubtitle}
        </p>

        <ul className="mt-6 space-y-2 text-neutral-800 max-w-2xl">
          {c.bullets.map((b) => (
            <li key={b} className="flex gap-2">
              <span aria-hidden className="text-vireoka-teal">•</span>
              <span>{b}</span>
            </li>
          ))}
        </ul>

        <div className="flex flex-wrap gap-4 pt-6">
          <Link
            href={c.ctaPrimary.href}
            className="rounded-md border border-vireoka-line
                       px-5 py-2.5 text-sm
                       text-vireoka-indigo hover:bg-vireoka-ash"
          >
            {c.ctaPrimary.label}
          </Link>

          <Link
            href={c.ctaSecondary.href}
            className="rounded-md bg-vireoka-indigo
                       text-white px-5 py-2.5 text-sm
                       hover:opacity-90"
          >
            {c.ctaSecondary.label}
          </Link>
        </div>
      </section>

      {/* Core value sections */}
      <section className="grid gap-6 md:grid-cols-3">
        {c.sections.map((s) => (
          <div
            key={s.title}
            className="rounded-lg border border-vireoka-line p-6
                       bg-white"
          >
            <h2 className="font-semibold text-vireoka-indigo">
              {s.title}
            </h2>
            <p className="mt-3 text-sm text-neutral-700">
              {s.body}
            </p>
          </div>
        ))}
      </section>

      {/* Public-safe / Trust framing */}
      <section className="rounded-lg border border-vireoka-line
                          p-8 bg-vireoka-ash space-y-4">
        <h2 className="font-semibold text-vireoka-indigo">
          Public-safe by design
        </h2>

        <p className="text-sm text-neutral-700 max-w-3xl">
          This site is intentionally high-level. We believe AI systems should be
          understood before they are trusted. Deeper technical material,
          implementation details, and product demonstrations are available
          through the NDA-gated investor portal for qualified investors.
        </p>

        <p className="text-sm text-neutral-700 max-w-3xl">
          If you care about deploying AI systems that can be explained, reviewed,
          and defended — not just optimized — you are in the right place.
        </p>

        <div>
          <Link
            href="/investors"
            className="text-sm text-vireoka-teal
                       underline underline-offset-4"
          >
            Vireoka Intelligence →
          </Link>
        </div>
      </section>
    </div>
  );
}
