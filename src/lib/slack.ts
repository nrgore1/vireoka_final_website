export async function sendSlackMessage(text: string) {
  const webhook = process.env.SLACK_WEBHOOK_URL;

  // Safe no-op if Slack is not configured
  if (!webhook) {
    console.warn("[slack] SLACK_WEBHOOK_URL not set, skipping alert");
    return;
  }

  try {
    await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });
  } catch (err) {
    console.error("[slack] failed to send message", err);
  }
}
