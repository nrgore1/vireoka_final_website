export async function notifyHotInvestor(email: string, score: number) {
  if (score < 12) return;

  const payload = {
    text: "🔥 Hot Investor Detected",
    blocks: [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `*${email}* just crossed the engagement threshold.\nScore: *${score}*`,
        },
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `<https://vireoka.com/admin/investors/${encodeURIComponent(email)}/timeline|View timeline →>`,
        },
      },
    ],
  };

  await fetch(process.env.SLACK_WEBHOOK_URL!, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}
