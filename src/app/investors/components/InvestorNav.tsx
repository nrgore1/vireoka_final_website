"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/investors", label: "Overview" },
  { href: "/investors/demo", label: "Live Demo" },
  { href: "/investors/figma", label: "Figma" },
];

export default function InvestorNav() {
  const pathname = usePathname();

  return (
    <nav
      style={{
        display: "flex",
        gap: 20,
        padding: "14px 24px",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
        background: "rgba(0,0,0,0.25)",
      }}
    >
      {links.map((l) => {
        const active = pathname === l.href;
        return (
          <Link
            key={l.href}
            href={l.href}
            style={{
              fontSize: 14,
              textDecoration: "none",
              color: active ? "#ffffff" : "rgba(231,238,252,0.7)",
              fontWeight: active ? 600 : 400,
            }}
          >
            {l.label}
          </Link>
        );
      })}
    </nav>
  );
}
