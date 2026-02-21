import "server-only";

type SendEmailArgs = {
  to: string;
  subject: string;
  html: string;
  from?: string;
};

type SendEmailResult =
  | { ok: true; id?: string }
  | { ok: false; error: string };

/**
 * Minimal, production-safe email sender.
 * - Uses Resend if RESEND_API_KEY is set.
 * - If not configured, it will NOT throw (prevents breaking prod flows).
 *
 * Env:
 * - RESEND_API_KEY
 * - EMAIL_FROM (optional)
 */
export async function sendEmail(args: SendEmailArgs): Promise<SendEmailResult> {
  const apiKey = process.env.RESEND_API_KEY || "";
  const from = args.from || process.env.EMAIL_FROM || "Vireoka <no-reply@vireoka.com>";

  const to = String(args.to || "").trim();
  const subject = String(args.subject || "").trim();
  const html = String(args.html || "");

  if (!to || !subject || !html) {
    return { ok: false, error: "Missing to/subject/html" };
  }

  if (!apiKey) {
    console.warn("[sendEmail] RESEND_API_KEY not set. Email not sent.", { to, subject });
    return { ok: false, error: "Email not configured (missing RESEND_API_KEY)" };
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to,
        subject,
        html,
      }),
    });

    const json: any = await res.json().catch(() => ({}));

    if (!res.ok) {
      const msg = json?.message || json?.error || `Resend error (${res.status})`;
      console.error("[sendEmail] Resend failed:", msg, json);
      return { ok: false, error: msg };
    }

    return { ok: true, id: json?.id };
  } catch (e: any) {
    const msg = String(e?.message || e);
    console.error("[sendEmail] Exception:", msg);
    return { ok: false, error: msg };
  }
}
