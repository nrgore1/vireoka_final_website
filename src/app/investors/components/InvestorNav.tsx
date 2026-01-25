"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { label: "Overview", href: "/investors" },
  { label: "Portal", href: "/investors/portal" },
  { label: "Design", href: "/investors/figma" },
  { label: "Status", href: "/investors/status" },
];

export default function InvestorNav() {
  const pathname = usePathname();

  return (
    <div className="mx-auto max-w-6xl px-6">
      <div className="flex flex-wrap gap-2 border-b border-vireoka-line py-4">
        {tabs.map((t) => {
          const active = pathname === t.href;
          return (
            <Link
              key={t.href}
              href={t.href}
              className={[
                "rounded-md px-3 py-1.5 text-sm border",
                active
                  ? "border-vireoka-indigo text-vireoka-indigo bg-vireoka-ash"
                  : "border-vireoka-line text-vireoka-graphite hover:bg-vireoka-ash",
              ].join(" ")}
            >
              {t.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
