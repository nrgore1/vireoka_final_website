type SendEmailInput = {
  to: string;
  subject: string;
  html: string;
};

export async function sendEmail(input: SendEmailInput) {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.INVESTOR_FROM_EMAIL;
  if (!key || !from) return { ok: false, skipped: true };

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: input.to,
      subject: input.subject,
      html: input.html,
    }),
  }).catch(() => null);

  if (!res || !res.ok) return { ok: false };
  return { ok: true };
}
