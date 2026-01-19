import Link from "next/link";
import { siteCopy } from "@/content/siteCopy";

export default function InvestorsPage() {
  const c = siteCopy.investors;

  return (
    <div className="space-y-8 max-w-3xl">
      <h1 className="text-3xl font-semibold tracking-tight">{c.title}</h1>

      <div className="space-y-3 text-neutral-700">
        {c.body.map((p) => (
          <p key={p}>{p}</p>
        ))}
      </div>

      <section className="rounded-lg border p-6">
        <h2 className="font-semibold">Access steps</h2>
        <ol className="mt-3 list-decimal list-inside text-sm text-neutral-700 space-y-1">
          {c.steps.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ol>

        <div className="flex flex-wrap gap-3 mt-5">
          <Link href={c.ctaApply.href} className="rounded-md bg-neutral-900 text-white px-4 py-2 text-sm hover:opacity-90">
            {c.ctaApply.label}
          </Link>
          <Link href={c.ctaStatus.href} className="rounded-md border px-4 py-2 text-sm hover:bg-neutral-50">
            {c.ctaStatus.label}
          </Link>
          <Link href={c.ctaPortal.href} className="rounded-md border px-4 py-2 text-sm hover:bg-neutral-50">
            {c.ctaPortal.label}
          </Link>
        </div>
      </section>

      <section className="rounded-lg border p-6 bg-neutral-50">
        <h2 className="font-semibold">Why NDA gating exists</h2>
        <p className="mt-2 text-sm text-neutral-700">
          Our public material is intentionally high-level. The NDA portal contains demo access and deeper documentation
          intended only for qualified investors.
        </p>
      </section>
    </div>
  );
}
