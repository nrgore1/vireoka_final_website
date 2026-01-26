"use client";

import { useRouter } from "next/navigation";

export default function CheckStatusButton() {
  const router = useRouter();

  async function onCheckStatus() {
    try {
      const res = await fetch("/api/investors/me", {
        credentials: "include",
      });

      if (res.ok) {
        // ✅ Logged-in investor with session
        router.push("/investors/status");
      } else {
        // ❌ Anonymous or not NDA-enabled
        router.push("/investors/status/anonymous");
      }
    } catch {
      router.push("/investors/status/anonymous");
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
