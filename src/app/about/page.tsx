import { siteCopy } from "@/content/siteCopy";

export default function AboutPage() {
  const c = siteCopy.about;

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-semibold tracking-tight">{c.title}</h1>

      <div className="space-y-3 text-neutral-700 max-w-3xl">
        {c.body.map((p) => (
          <p key={p}>{p}</p>
        ))}
      </div>

      <section className="rounded-lg border p-6">
        <h2 className="font-semibold">{c.principlesTitle}</h2>
        <ul className="mt-3 space-y-2 text-sm text-neutral-700">
          {c.principles.map((p) => (
            <li key={p} className="flex gap-2">
              <span aria-hidden>•</span>
              <span>{p}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
