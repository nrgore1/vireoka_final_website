import Link from "next/link";

export const metadata = {
  title: "Vireoka Teasers | Resources",
  description:
    "Short-form video teasers introducing Vireoka’s approach to governable, accountable AI.",
};

export default function TeasersPage() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-16 space-y-12">
      <header className="space-y-3">
        <h1 className="text-3xl font-semibold text-vireoka-indigo">
          Vireoka Teasers
        </h1>
        <p className="text-neutral-600 max-w-2xl">
          Short-form introductions to how Vireoka approaches agentic AI,
          governance, and accountability.
        </p>
      </header>

      {/* 🎬 Video Teaser */}
      <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-black">
        <video
          src="/videos/vireoka-teaser.mp4"
          controls
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>

      <footer className="pt-8">
        <Link
          href="/resources"
          className="text-sm text-vireoka-teal underline underline-offset-4"
        >
          ← Back to Resources
        </Link>
      </footer>
    </div>
  );
}
