"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { site } from "@/lib/site";

export default function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const nav = useMemo(() => site.nav ?? [], []);

  // Close menu on navigation
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header
      className="sticky top-0 z-50 border-b"
      style={{
        borderColor: "var(--vk-border)",
        background: "rgba(7,10,15,0.72)",
        backdropFilter: "blur(10px)",
      }}
    >
      <div className="vk-container py-3 flex items-center justify-between gap-3">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-3 no-underline shrink-0">
          <div
            className="h-9 w-9 rounded-xl"
            style={{
              background: "linear-gradient(135deg, var(--vk-primary), var(--vk-primary-2))",
            }}
          />
          <div className="min-w-0">
            <div className="text-sm font-semibold leading-tight whitespace-nowrap">
              {site.name}
            </div>
            <div className="text-xs" style={{ color: "var(--vk-muted)" }}>
              Governed Intelligence
            </div>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex flex-1 justify-center items-center gap-2">
          {nav.map((n: any) => {
            const active = pathname === n.href;
            return (
              <Link
                key={n.href}
                href={n.href}
                className="px-3 py-2 rounded-xl text-sm no-underline whitespace-nowrap"
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

        {/* Right-side actions */}
        <div className="flex items-center gap-2 shrink-0">
          <Link
            href="/investors"
            className="hidden sm:inline-flex vk-btn vk-btn-primary text-sm whitespace-nowrap"
          >
            Vireoka Intelligence
          </Link>

          {/* Mobile Menu Button */}
          <button
            type="button"
            className="md:hidden inline-flex items-center justify-center rounded-xl px-3 py-2 text-sm"
            style={{
              border: "1px solid rgba(255,255,255,0.14)",
              background: "rgba(255,255,255,0.04)",
              color: "var(--vk-text)",
            }}
            aria-label="Open menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <span className="sr-only">Menu</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {open ? (
        <div
          className="md:hidden border-t"
          style={{
            borderColor: "var(--vk-border)",
            background: "rgba(7,10,15,0.86)",
          }}
        >
          <div className="vk-container py-3">
            <div className="grid gap-2">
              {nav.map((n: any) => {
                const active = pathname === n.href;
                return (
                  <Link
                    key={n.href}
                    href={n.href}
                    className="px-4 py-3 rounded-xl text-sm no-underline"
                    style={{
                      color: active ? "var(--vk-text)" : "var(--vk-muted)",
                      border: active ? "1px solid rgba(106,228,255,0.25)" : "1px solid rgba(255,255,255,0.10)",
                      background: active ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.03)",
                    }}
                  >
                    {n.label}
                  </Link>
                );
              })}

              <Link
                href="/investors"
                className="px-4 py-3 rounded-xl text-sm no-underline"
                style={{
                  color: "var(--vk-text)",
                  border: "1px solid rgba(106,228,255,0.25)",
                  background: "rgba(106,228,255,0.06)",
                }}
              >
                Vireoka Intelligence
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
