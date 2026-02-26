import Link from "next/link";

const NAV = [
  { href: "/intelligence/portal", label: "Overview" },
  { href: "/intelligence/portal/vdr", label: "Data Room" },
  { href: "/intelligence/portal/videos", label: "Videos" },
  { href: "/intelligence/portal/infographics", label: "Infographics" },
  { href: "/intelligence/portal/demo", label: "UI Demo" },
  { href: "/intelligence/portal/whitepaper", label: "Whitepaper" },
  { href: "/intelligence/portal/agents", label: "Digital Employees" },
  { href: "/intelligence/portal/modules", label: "Governance Modules" },
  { href: "/intelligence/portal/contributors", label: "Contributors" },
];

export function PortalNav() {
  return (
    <div className="mb-6 flex flex-wrap gap-2">
      {NAV.map((n) => (
        <Link
          key={n.href}
          href={n.href}
          className="rounded-full border border-gray-200 bg-white px-4 py-2 text-xs font-semibold text-gray-800 hover:bg-gray-50"
        >
          {n.label}
        </Link>
      ))}
    </div>
  );
}
