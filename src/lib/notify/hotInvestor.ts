export async function notifyHotInvestor(email: string, score: number, topPaths?: string[]) {
  const webhook = process.env.SLACK_WEBHOOK_URL;
  if (!webhook) return;

  const lines = [
    `🔥 *Hot investor* detected`,
    `*Email:* ${email}`,
    `*Score:* ${score}`,
    topPaths?.length ? `*Top paths:* ${topPaths.slice(0, 5).join(", ")}` : null,
  ].filter(Boolean);

  await fetch(webhook, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text: lines.join("\n") }),
  }).catch(() => null);
}
