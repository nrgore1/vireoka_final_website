export async function sendInvestorStatusLinkEmail(args: {
  email: string;
  statusUrl: string;
  expiresHours: number;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM || "Vireoka <no-reply@vireoka.com>";

  if (!apiKey) throw new Error("RESEND_API_KEY is not set");
  if (!args.email) throw new Error("Missing recipient email");

  const subject = "Your Vireoka investor application status link";

  const html = `
  <div style="font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial;">
    <h2 style="margin:0 0 12px 0;">Check your application status</h2>
    <p style="margin:0 0 12px 0;">
      Use the secure link below to view your current investor application status.
      This link expires in <b>${args.expiresHours}</b> hours and can be used once.
    </p>
    <p style="margin:16px 0;">
      <a href="${args.statusUrl}" style="display:inline-block;padding:10px 14px;border-radius:8px;background:#111;color:#fff;text-decoration:none;">
        View status
      </a>
    </p>
    <p style="margin:16px 0 0 0;color:#666;font-size:12px;">
      If you did not request this, you can ignore this email.
    </p>
  </div>`;

  const text = `Check your application status (expires in ${args.expiresHours} hours): ${args.statusUrl}`;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [args.email],
      subject,
      html,
      text,
    }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Resend failed (${res.status}): ${body}`);
  }

  return { ok: true };
}
