"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { site } from "@/lib/site";
import { useInvestorSession } from "@/lib/hooks/useInvestorSession";

type NavItem = { label: string; href: string; desc?: string };

export default function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false); // mobile menu
  const [intelOpen, setIntelOpen] = useState(false); // desktop dropdown

  const { isAuthed } = useInvestorSession();

  const nav = useMemo(() => site.nav ?? [], []);

  const intelLinks: NavItem[] = useMemo(
    () => [
      { label: "Overview", href: "/intelligence", desc: "Start here" },
      { label: "Vision", href: "/intelligence/vision", desc: "Why we exist" },
      { label: "Platform", href: "/intelligence/platform", desc: "How we think" },
      { label: "Digital Employees", href: "/intelligence/digital-employees", desc: "What it enables" },
      { label: "Roles", href: "/intelligence/roles", desc: "Advisor, angel, contributor" },
      { label: "Access & Trust", href: "/intelligence/access", desc: "Role-based disclosure" },
      { label: "FAQ", href: "/intelligence/faq", desc: "Common questions" },
      { label: "Apply / Contact", href: "/intelligence/apply", desc: "Request access" },
    ],
    []
  );

  // Close menus on navigation
  useEffect(() => {
    setOpen(false);
    setIntelOpen(false);
  }, [pathname]);

  // Close desktop dropdown on outside click / ESC
  const intelRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!intelOpen) return;
      const el = intelRef.current;
      if (!el) return;
      if (e.target instanceof Node && !el.contains(e.target)) setIntelOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setIntelOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [intelOpen]);

  const isIntelActive =
    pathname === "/intelligence" || pathname.startsWith("/intelligence/");

  const privateLink: NavItem = useMemo(
    () => ({
      label: "Private Workspace",
      href: "/intelligence/(protected)",
      desc: "Visible when logged in",
    }),
    []
  );

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
              background:
                "linear-gradient(135deg, var(--vk-primary), var(--vk-primary-2))",
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
                  border: active
                    ? "1px solid rgba(106,228,255,0.25)"
                    : "1px solid transparent",
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
          {/* Desktop Intelligence Dropdown */}
          <div className="relative hidden sm:block" ref={intelRef}>
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold whitespace-nowrap"
              style={{
                border: isIntelActive
                  ? "1px solid rgba(106,228,255,0.35)"
                  : "1px solid rgba(255,255,255,0.14)",
                background: isIntelActive
                  ? "rgba(106,228,255,0.10)"
                  : "rgba(255,255,255,0.04)",
                color: "var(--vk-text)",
              }}
              aria-haspopup="menu"
              aria-expanded={intelOpen}
              onClick={() => setIntelOpen((v) => !v)}
            >
              Vireoka Intelligence
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
                style={{ opacity: 0.9 }}
              >
                <path
                  d="M6 9l6 6 6-6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            {intelOpen ? (
              <div
                role="menu"
                aria-label="Vireoka Intelligence menu"
                className="absolute right-0 mt-2 w-[380px] rounded-2xl border shadow-lg overflow-hidden"
                style={{
                  borderColor: "rgba(255,255,255,0.12)",
                  background: "rgba(7,10,15,0.96)",
                }}
              >
                <div className="p-3">
                  <div
                    className="px-3 py-2 rounded-xl mb-2"
                    style={{ background: "rgba(255,255,255,0.03)" }}
                  >
                    <div className="text-xs font-semibold tracking-wide text-neutral-300">
                      INTELLIGENCE
                    </div>
                    <div className="text-xs mt-1" style={{ color: "var(--vk-muted)" }}>
                      Role-based collaboration for ethical AI, governance, and trusted digital work.
                    </div>
                  </div>

                  {/* Private workspace (only when authed) */}
                  {isAuthed ? (
                    <div className="mb-2">
                      <Link
                        href={privateLink.href}
                        role="menuitem"
                        className="block px-3 py-3 rounded-xl no-underline"
                        style={{
                          border: "1px solid rgba(106,228,255,0.28)",
                          background: "rgba(106,228,255,0.10)",
                        }}
                        onClick={() => setIntelOpen(false)}
                      >
                        <div className="text-sm font-semibold" style={{ color: "var(--vk-text)" }}>
                          {privateLink.label}
                        </div>
                        <div className="text-xs mt-1" style={{ color: "var(--vk-muted)" }}>
                          {privateLink.desc}
                        </div>
                      </Link>
                    </div>
                  ) : null}

                  <div className="grid gap-1">
                    {intelLinks.map((item) => {
                      const active =
                        pathname === item.href ||
                        (item.href !== "/intelligence" && pathname.startsWith(item.href));
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          role="menuitem"
                          className="px-3 py-3 rounded-xl no-underline"
                          style={{
                            border: active
                              ? "1px solid rgba(106,228,255,0.25)"
                              : "1px solid rgba(255,255,255,0.10)",
                            background: active
                              ? "rgba(106,228,255,0.08)"
                              : "rgba(255,255,255,0.03)",
                          }}
                          onClick={() => setIntelOpen(false)}
                        >
                          <div className="text-sm font-semibold" style={{ color: "var(--vk-text)" }}>
                            {item.label}
                          </div>
                          {item.desc ? (
                            <div className="text-xs mt-1" style={{ color: "var(--vk-muted)" }}>
                              {item.desc}
                            </div>
                          ) : null}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : null}
          </div>

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
              <path
                d="M4 7h16M4 12h16M4 17h16"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
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
                      border: active
                        ? "1px solid rgba(106,228,255,0.25)"
                        : "1px solid rgba(255,255,255,0.10)",
                      background: active
                        ? "rgba(255,255,255,0.05)"
                        : "rgba(255,255,255,0.03)",
                    }}
                  >
                    {n.label}
                  </Link>
                );
              })}

              {/* Mobile Intelligence section */}
              <div
                className="rounded-2xl border p-3"
                style={{
                  borderColor: "rgba(106,228,255,0.25)",
                  background: "rgba(106,228,255,0.06)",
                }}
              >
                <div className="px-1">
                  <div className="text-sm font-semibold" style={{ color: "var(--vk-text)" }}>
                    Vireoka Intelligence
                  </div>
                  <div className="text-xs mt-1" style={{ color: "var(--vk-muted)" }}>
                    Explore roles, vision, and access.
                  </div>
                </div>

                {/* Mobile Private workspace (only when authed) */}
                {isAuthed ? (
                  <div className="mt-3">
                    <Link
                      href={privateLink.href}
                      className="block px-3 py-3 rounded-xl text-sm no-underline"
                      style={{
                        color: "var(--vk-text)",
                        border: "1px solid rgba(106,228,255,0.28)",
                        background: "rgba(106,228,255,0.10)",
                      }}
                    >
                      {privateLink.label}
                    </Link>
                  </div>
                ) : null}

                <div className="mt-3 grid gap-2">
                  {intelLinks.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="px-3 py-3 rounded-xl text-sm no-underline"
                      style={{
                        color: "var(--vk-text)",
                        border: "1px solid rgba(255,255,255,0.10)",
                        background: "rgba(255,255,255,0.03)",
                      }}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
