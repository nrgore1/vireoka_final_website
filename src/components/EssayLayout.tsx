export default function EssayLayout({
  title,
  author,
  children,
}: {
  title: string;
  author: string;
  children: React.ReactNode;
}) {
  return (
    <article className="max-w-3xl mx-auto space-y-10">
      <header className="space-y-4">
        <h1 className="text-4xl font-semibold tracking-tight">{title}</h1>
        <p className="text-sm text-neutral-600">
          By {author}
        </p>
      </header>

      <section className="prose prose-neutral max-w-none">
        {children}
      </section>

      <footer className="border-t pt-6 text-sm text-neutral-600">
        <p>
          This essay is part of Vireoka’s ongoing work on agentic AI, governance,
          and decision accountability.
        </p>
      </footer>
    </article>
  );
}
