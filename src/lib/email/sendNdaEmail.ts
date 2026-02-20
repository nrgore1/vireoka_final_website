import { Resend } from "resend";

/**
 * Minimal implementation so builds succeed.
 * You can expand this to send SignWell links later.
 */
export async function sendNdaEmail(params: {
  to: string;
  subject?: string;
  html: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.FROM_EMAIL;

  if (!apiKey || !from) {
    return { ok: false, error: "Missing RESEND_API_KEY or FROM_EMAIL" };
  }

  const resend = new Resend(apiKey);

  const res = await resend.emails.send({
    from,
    to: params.to,
    subject: params.subject || "Vireoka NDA",
    html: params.html,
  });

  if ((res as any)?.error) return { ok: false, error: (res as any).error };
  return { ok: true, res };
}
