"use client";

import { useRouter } from "next/navigation";

export default function CheckStatusButton() {
  const router = useRouter();

  async function onCheckStatus() {
    try {
      const res = await fetch("/api/intelligence/me", {
        credentials: "include",
      });

      if (res.ok) {
        // ✅ Logged-in investor with session
        router.push("/intelligence/status");
      } else {
        // ❌ Anonymous or not NDA-enabled
        router.push("/intelligence/status/anonymous");
      }
    } catch {
      router.push("/intelligence/status/anonymous");
    }
  }

  return (
    <button
      onClick={onCheckStatus}
      className="px-4 py-2 rounded-md border border-gray-300 text-sm"
    >
      Check status
    </button>
  );
}
