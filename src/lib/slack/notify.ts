export async function notifySlack(text: string) {
  const url = (process.env.SLACK_WEBHOOK_URL || "").trim();
  if (!url) return { ok: false as const, skipped: true as const, error: "Missing SLACK_WEBHOOK_URL" };

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ text }),
    });

    if (!res.ok) {
      const msg = await res.text().catch(() => "");
      return { ok: false as const, error: `Slack webhook failed (${res.status}): ${msg.slice(0, 200)}` };
    }
    return { ok: true as const };
  } catch (e: any) {
    return { ok: false as const, error: String(e?.message || e) };
  }
}
