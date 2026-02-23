import React from "react";

export function VdrCard(props: {
  id: string;
  title: string;
  description?: string | null;
  category?: string | null;
  kind?: string | null;
  locked: boolean;
}) {
  const { id, title, description, category, kind, locked } = props;

  return (
    <div className="rounded-xl border p-5 relative overflow-hidden">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-xs uppercase tracking-wide text-neutral-500 font-semibold">
            {category || "Document"} • {kind || "file"}
          </div>
          <div className="font-semibold mt-1">{title}</div>
          <div className={"text-sm mt-1 " + (locked ? "text-neutral-500 blur-[2px] select-none" : "text-neutral-700")}>
            {description || "Confidential diligence material."}
          </div>
        </div>

        {locked ? (
          <div className="shrink-0 rounded-full border px-3 py-1 text-xs font-semibold bg-neutral-50">
            🔒 Locked
          </div>
        ) : (
          <a
            className="shrink-0 rounded-full border px-3 py-1 text-xs font-semibold hover:bg-neutral-50"
            href={`/portal/vdr/${id}`}
          >
            Open
          </a>
        )}
      </div>

      {locked ? (
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <a
            className="rounded-md bg-neutral-900 text-white px-3 py-2 text-xs font-semibold hover:opacity-90"
            href="/portal/request-extension"
          >
            Request higher access
          </a>
          <div className="text-xs text-neutral-500">
            This item requires elevated diligence access.
          </div>
        </div>
      ) : null}
    </div>
  );
}
