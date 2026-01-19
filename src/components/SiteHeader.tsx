"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { site } from "@/lib/site";

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b" style={{ borderColor: "var(--vk-border)", background: "rgba(7,10,15,0.72)", backdropFilter: "blur(10px)" }}>
      <div className="vk-container py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 no-underline">
          <div className="h-9 w-9 rounded-xl" style={{ background: "linear-gradient(135deg, var(--vk-primary), var(--vk-primary-2))" }} />
          <div>
            <div className="text-sm font-semibold leading-tight">{site.name}</div>
            <div className="text-xs" style={{ color: "var(--vk-muted)" }}>Governed Intelligence</div>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-2">
          {site.nav.map((n) => {
            const active = pathname === n.href;
            return (
              <Link
                key={n.href}
                href={n.href}
                className="px-3 py-2 rounded-xl text-sm no-underline"
                style={{
                  color: active ? "var(--vk-text)" : "var(--vk-muted)",
                  border: active ? "1px solid rgba(106,228,255,0.25)" : "1px solid transparent",
                  background: active ? "rgba(255,255,255,0.04)" : "transparent",
                }}
              >
                {n.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <Link href="/investors" className="vk-btn vk-btn-primary text-sm">Investor Portal</Link>
        </div>
      </div>
    </header>
  );
}
