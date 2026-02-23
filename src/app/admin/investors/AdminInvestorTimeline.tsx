"use client";

import { useEffect, useState } from "react";

export default function AdminInvestorTimeline({ email }: { email: string }) {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/intelligence/events", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email }),
    })
      .then((r) => r.json())
      .then((d) => setEvents(d.events ?? []))
      .finally(() => setLoading(false));
  }, [email]);

  if (loading) return <p className="text-sm">Loading activity…</p>;

  if (!events.length) {
    return <p className="text-sm text-neutral-500">No activity recorded.</p>;
  }

  return (
    <ul className="mt-4 space-y-2 text-sm">
      {events.map((e) => (
        <li
          key={e.id}
          className="rounded border border-vireoka-line px-3 py-2"
        >
          <div className="font-medium">{e.event}</div>
          <div className="text-xs text-neutral-500">
            {e.path ?? "—"} ·{" "}
            {new Date(e.created_at).toLocaleString()}
          </div>
        </li>
      ))}
    </ul>
  );
}
