import { Resend } from "resend";

export function getResend() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return null;
  return new Resend(apiKey);
}

/**
 * Backwards-compatible helper for legacy imports.
 * Safe in build environments: returns { ok:false } if env missing.
 */
export async function sendEmail(params: {
  to: string;
  subject: string;
  html: string;
  from?: string;
}) {
  const resend = getResend();
  const from = params.from || process.env.FROM_EMAIL;

  if (!resend || !from) {
    return { ok: false as const, error: "Missing RESEND_API_KEY or FROM_EMAIL" };
  }

  const res: any = await resend.emails.send({
    from,
    to: params.to,
    subject: params.subject,
    html: params.html,
  });

  if (res?.error) {
    return { ok: false as const, error: res.error?.message || String(res.error) };
  }

  return { ok: true as const, id: res?.data?.id ?? res?.id ?? null, res };
}
