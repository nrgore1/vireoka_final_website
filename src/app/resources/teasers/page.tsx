import { teaserScripts } from "@/content/teasers/teasers";

export default function TeasersPage() {
  return (
    <div className="space-y-8 max-w-3xl">
      <h1 className="text-3xl font-semibold tracking-tight">30-second Vireoka teaser scripts (public-safe)</h1>
      <p className="text-neutral-700">
        These scripts are designed for voiceover + motion graphics and avoid confidential implementation details.
      </p>

      {teaserScripts.map((t) => (
        <div key={t.title} className="rounded-lg border p-5 space-y-2">
          <h2 className="font-semibold">{t.title}</h2>
          <p className="text-sm text-neutral-700">{t.intent}</p>
          <pre className="whitespace-pre-wrap text-sm bg-neutral-50 border rounded-md p-3">{t.script}</pre>
        </div>
      ))}
    </div>
  );
}
