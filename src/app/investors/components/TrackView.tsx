"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function TrackView() {
  const path = usePathname();

  useEffect(() => {
    fetch("/api/investors/event", {
      method: "POST",
      body: JSON.stringify({ type: "view", path }),
    });
  }, [path]);

  return null;
}
