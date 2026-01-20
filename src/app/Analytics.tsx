"use client";

import { useEffect } from "react";
import { trackPageView } from "@/lib/trackEvent";

export default function Analytics() {
  useEffect(() => {
    trackPageView();
  }, []);

  return null;
}
