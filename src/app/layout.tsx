import "./globals.css";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import Analytics from "./Analytics";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: "Vireoka — Governable AI for Real-World Accountability",
  description:
    "Vireoka focuses on governance for agentic AI systems. We help ensure AI decisions are explainable, reviewable, and defensible in real-world, high-stakes environments.",

  openGraph: {
    title: "Vireoka — Governable AI for Real-World Accountability",
    description:
      "Governance for agentic AI systems. Designing AI decisions that can be explained, reviewed, and defended.",
    url: "https://vireoka.com",
    siteName: "Vireoka",
    images: [
      {
        url: "/Vireoka_opfficial_logo.png",
        width: 1200,
        height: 630,
        alt: "Vireoka — Governable AI",
      },
    ],
    locale: "en_US",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Vireoka — Governable AI for Real-World Accountability",
    description:
      "Governance for agentic AI systems. Ensuring AI decisions can be explained and defended.",
    images: ["/Vireoka_opfficial_logo.png"],
  },

  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

const nav = [
  { href: "/about", label: "About" },
  { href: "/resources", label: "Resources" },
  { href: "/leadership", label: "Leadership" },
  { href: "/trust", label: "Trust" },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-vireoka-graphite antialiased">
        <Analytics />

        <header className="border-b border-vireoka-line bg-white">
          {/* Key change: flex-wrap + gaps so nav drops below on narrow widths instead of overlapping */}
          <div className="mx-auto max-w-6xl px-4 sm:px-6 py-4 flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
            <Link href="/" className="flex items-center gap-3 shrink-0">
              <Image
                src="/Vireoka_opfficial_logo.png"
                alt="Vireoka logo"
                width={36}
                height={36}
                priority
              />
              <span className="font-semibold text-lg tracking-tight text-vireoka-indigo whitespace-nowrap">
                Vireoka
              </span>
            </Link>

            {/* Nav becomes full-width on small screens so it wraps cleanly under the logo */}
            <nav className="w-full md:w-auto flex flex-wrap items-center gap-x-6 gap-y-2 text-sm md:justify-end">
              {nav.map((n) => (
                <Link
                  key={n.href}
                  href={n.href}
                  className="text-vireoka-graphite hover:text-vireoka-indigo whitespace-nowrap"
                >
                  {n.label}
                </Link>
              ))}

              <Link
                href="/investors"
                className="rounded-md border border-vireoka-line px-3 py-1.5 text-sm
                           text-vireoka-indigo hover:bg-vireoka-ash whitespace-nowrap"
              >
                Vireoka Intelligence
              </Link>
            </nav>
          </div>
        </header>

        <main className="mx-auto max-w-6xl px-4 sm:px-6 py-12 sm:py-16">{children}</main>

        <footer className="border-t border-vireoka-line bg-vireoka-ash">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12 grid gap-8 md:grid-cols-3 text-sm">
            <div>
              <p className="font-medium text-vireoka-indigo">Vireoka</p>
              <p className="mt-2 text-neutral-600">
                Governable AI for real-world accountability.
              </p>
            </div>

            <div>
              <p className="font-medium text-vireoka-indigo">Explore</p>
              <ul className="mt-2 space-y-1 text-neutral-600">
                <li>
                  <Link href="/resources">Resources</Link>
                </li>
                <li>
                  <Link href="/leadership">Leadership</Link>
                </li>
                <li>
                  <Link href="/trust">Trust & Governance</Link>
                </li>
              </ul>
            </div>

            <div>
              <p className="font-medium text-vireoka-indigo">Access</p>
              <p className="mt-2 text-neutral-600">
                Public materials are open. Deeper technical and product
                information is available through the NDA-gated investor portal.
              </p>
              <Link
                href="/investors"
                className="inline-block mt-3 text-sm text-vireoka-teal
                           underline underline-offset-4"
              >
                Vireoka Intelligence →
              </Link>
            </div>
          </div>

          <div className="text-center text-xs text-neutral-500 pb-6">
            © 2026 Vireoka LLC · Not legal, medical, or financial advice
          </div>
        </footer>
      </body>
    </html>
  );
}
