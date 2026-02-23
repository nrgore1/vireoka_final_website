import React from "react";

export function LockedCard(props: {
  title: string;
  subtitle?: string;
  description?: string;
  href?: string;        // open link if unlocked
  locked: boolean;
  ctaHref?: string;     // request higher access
  badge?: string;
}) {
  const { title, subtitle, description, href, locked, ctaHref, badge } = props;

  return (
    <div className="rounded-xl border p-5 relative overflow-hidden">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          {subtitle ? (
            <div className="text-xs uppercase tracking-wide text-neutral-500 font-semibold">
              {subtitle}
            </div>
          ) : null}

          <div className="font-semibold mt-1 truncate">{title}</div>

          {description ? (
            <div
              className={
                "text-sm mt-1 " +
                (locked ? "text-neutral-500 blur-[2px] select-none" : "text-neutral-700")
              }
            >
              {description}
            </div>
          ) : null}
        </div>

        {badge ? (
          <div className="shrink-0 rounded-full border px-3 py-1 text-xs font-semibold bg-neutral-50">
            {badge}
          </div>
        ) : locked ? (
          <div className="shrink-0 rounded-full border px-3 py-1 text-xs font-semibold bg-neutral-50">
            🔒 Locked
          </div>
        ) : href ? (
          <a
            className="shrink-0 rounded-full border px-3 py-1 text-xs font-semibold hover:bg-neutral-50"
            href={href}
          >
            Open
          </a>
        ) : null}
      </div>

      {locked ? (
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <a
            className="rounded-md bg-neutral-900 text-white px-3 py-2 text-xs font-semibold hover:opacity-90"
            href={ctaHref || "/portal/request-extension"}
          >
            Request higher access
          </a>
          <div className="text-xs text-neutral-500">
            Visible title, locked content. Access is selective and time-bound.
          </div>
        </div>
      ) : null}
    </div>
  );
}
