import { getResend } from "./resend";

export async function sendNdaEmail(params: {
  to: string;
  subject: string;
  html: string;
}) {
  const resend = getResend();
  const from = process.env.FROM_EMAIL;

  if (!resend || !from) {
    return { skipped: true as const, error: "Missing RESEND_API_KEY or FROM_EMAIL" };
  }

  const res: any = await resend.emails.send({
    from,
    to: params.to,
    subject: params.subject,
    html: params.html,
  });

  if (res?.error) {
    return { skipped: false as const, error: res.error?.message || String(res.error) };
  }

  return { skipped: false as const, res };
}
