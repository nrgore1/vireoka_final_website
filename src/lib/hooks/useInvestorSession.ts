"use client";

import { useEffect, useState } from "react";

export function useInvestorSession() {
  const [isAuthed, setIsAuthed] = useState<boolean | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      try {
        const res = await fetch("/api/investors/me", {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        });

        if (cancelled) return;

        // If the endpoint is protected, 200 means logged in.
        // 401/403 means not logged in / not authorized for that tier.
        setIsAuthed(res.ok);
      } catch {
        if (cancelled) return;
        setIsAuthed(false);
      }
    }

    run();

    return () => {
      cancelled = true;
    };
  }, []);

  return { isAuthed };
}
