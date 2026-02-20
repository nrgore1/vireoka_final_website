import { getResend } from "@/lib/email/resend";

export function leadToHtml(payload: any) {
  const safe = (v: any) =>
    String(v ?? "")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;");

  return `
    <div style="font-family:system-ui,Segoe UI,Roboto,Helvetica,Arial,sans-serif;line-height:1.5">
      <h2 style="margin:0 0 10px 0">New Investor Lead</h2>
      <p><strong>Kind:</strong> ${safe(payload.kind)}</p>
      <p><strong>Name:</strong> ${safe(payload.fullName)}</p>
      <p><strong>Email:</strong> ${safe(payload.email)}</p>
      <p><strong>Company:</strong> ${safe(payload.company)}</p>
      <p><strong>Message:</strong><br/>${safe(payload.message)}</p>
    </div>
  `;
}

export async function sendInvestorEmail(params: {
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
