export async function trackPageView() {
  try {
    const res = await fetch("/api/investors/event", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        event: "PAGE_VIEW",
        path: location.pathname,
      }),
    });

    if (!res.ok) return;
  } catch {
    // fail silently
  }
}
