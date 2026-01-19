import { publicWhitepaper } from "@/content/whitepapers/public";

export default function PublicWhitepaperPage() {
  return (
    <article className="prose prose-neutral max-w-3xl">
      <h1>{publicWhitepaper.title}</h1>
      {publicWhitepaper.sections.map((s) => (
        <section key={s.heading}>
          <h2>{s.heading}</h2>
          {s.paragraphs.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </section>
      ))}
    </article>
  );
}
