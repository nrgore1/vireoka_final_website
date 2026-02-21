import type { ReactNode } from "react";

export const dynamic = "force-dynamic";

export default function PortalLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen">
      <header className="border-b bg-white">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <a href="/portal/overview" className="font-semibold">
            Vireoka Investor Portal
          </a>
          <nav className="flex gap-4 text-sm">
            <a className="hover:underline" href="/portal/overview">Overview</a>
            <a className="hover:underline" href="/portal/intelligence">Intelligence</a>
            <a className="hover:underline" href="/portal/vdr">Data Room</a>
            <a className="hover:underline" href="/portal/scenarios">Scenarios</a>
            <a className="hover:underline" href="/portal/activity">Activity</a>
          </nav>
        </div>
      </header>

      {children}
    </div>
  );
}
