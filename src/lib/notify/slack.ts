export async function notifySlackInvestorRequest(email: string) {
  const payload = {
    text: "New Investor Access Request",
    blocks: [
      { type: "section", text: { type: "mrkdwn", text: `*${email}* requested access.` } },
      {
        type: "actions",
        elements: [
          {
            type: "button",
            text: { type: "plain_text", text: "Approve" },
            style: "primary",
            value: email,
            action_id: "approve_investor",
          },
          {
            type: "button",
            text: { type: "plain_text", text: "Reject" },
            style: "danger",
            value: email,
            action_id: "reject_investor",
          },
        ],
      },
    ],
  };

  await fetch(process.env.SLACK_WEBHOOK_URL!, {
    method: "POST",
    body: JSON.stringify(payload),
    headers: { "Content-Type": "application/json" },
  });
}
