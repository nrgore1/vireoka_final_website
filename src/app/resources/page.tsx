import Link from "next/link";
import { siteCopy } from "@/content/siteCopy";

export default function ResourcesPage() {
  const c = siteCopy.resources;

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-semibold tracking-tight">{c.title}</h1>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-lg border p-5">
          <h2 className="font-semibold">{c.publicWhitepaper.title}</h2>
          <p className="mt-2 text-sm text-neutral-700">{c.publicWhitepaper.description}</p>
          <Link className="mt-4 inline-block text-sm underline underline-offset-4" href={c.publicWhitepaper.href}>
            Read →
          </Link>
        </div>

        <div className="rounded-lg border p-5">
          <h2 className="font-semibold">{c.ethicsCharter.title}</h2>
          <p className="mt-2 text-sm text-neutral-700">{c.ethicsCharter.description}</p>
          <Link className="mt-4 inline-block text-sm underline underline-offset-4" href={c.ethicsCharter.href}>
            Read →
          </Link>
        </div>

        <div className="rounded-lg border p-5">
          <h2 className="font-semibold">{c.teasers.title}</h2>
          <p className="mt-2 text-sm text-neutral-700">{c.teasers.description}</p>
          <Link className="mt-4 inline-block text-sm underline underline-offset-4" href={c.teasers.href}>
            View →
          </Link>
        </div>
      </div>
    </div>
  );
}
