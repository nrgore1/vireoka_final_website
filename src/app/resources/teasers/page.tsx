import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Vireoka — Teaser",
  description:
    "A brief introduction to Vireoka and our approach to governable AI.",
};

export default function TeasersPage() {
  return (
    <section className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold text-vireoka-indigo mb-6">
        Vireoka teaser
      </h1>

      <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-vireoka-line bg-black">
        <video
          src="/videos/vireoka-teaser.mp4"
          controls
          playsInline
          preload="metadata"
          className="h-full w-full object-contain"
        />
      </div>

      <p className="mt-6 text-sm text-neutral-600">
        This short video introduces Vireoka’s mission to make agentic AI
        systems explainable, reviewable, and accountable in real-world
        environments.
      </p>
    </section>
  );
}
