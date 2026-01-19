import { ethicsCharter } from "@/content/whitepapers/ethics";

export default function EthicsCharterPage() {
  return (
    <article className="prose prose-neutral max-w-3xl">
      <h1>{ethicsCharter.title}</h1>
      {ethicsCharter.sections.map((s) => (
        <section key={s.heading}>
          <h2>{s.heading}</h2>
          <ul>
            {s.bullets
              ? s.bullets.map((b) => <li key={b}>{b}</li>)
              : s.paragraphs?.map((p) => <li key={p}>{p}</li>)}
          </ul>
        </section>
      ))}
    </article>
  );
}
