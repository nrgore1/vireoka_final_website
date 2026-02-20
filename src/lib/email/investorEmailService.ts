import { Resend } from "resend";

function mustGet(name: string) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env: ${name}`);
  return v;
}

function baseUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");
}

function nowIso() {
  return new Date().toISOString();
}

export type EmailResult =
  | { ok: true; id: string | null }
  | { ok: false; error: string };

async function sendEmail(params: {
  to: string;
  subject: string;
  html: string;
}): Promise<EmailResult> {
  try {
    const resend = new Resend(mustGet("RESEND_API_KEY"));
    const from = mustGet("FROM_EMAIL");

    const res = await resend.emails.send({
      from,
      to: params.to,
      subject: params.subject,
      html: params.html,
    });

    const anyRes: any = res as any;
    if (anyRes?.error) return { ok: false, error: anyRes.error?.message || String(anyRes.error) };
    return { ok: true, id: anyRes?.data?.id ?? anyRes?.id ?? null };
  } catch (e: any) {
    return { ok: false, error: String(e?.message || e) };
  }
}

export async function sendInvestorRequestConfirmation(opts: {
  to: string;
  fullName: string;
  kind: "REQUEST_ACCESS" | "APPLY";
  referenceCode: string;
}) {
  const subject =
    opts.kind === "REQUEST_ACCESS"
      ? "Vireoka — Investor access request received"
      : "Vireoka — Investor application received";

  const html = `
    <div style="font-family:system-ui,Segoe UI,Roboto,Helvetica,Arial,sans-serif;line-height:1.5">
      <h2 style="margin:0 0 10px 0">Thank you for your interest in Vireoka</h2>
      <p>We received your ${opts.kind === "REQUEST_ACCESS" ? "investor access request" : "investor application"} and our team will review it shortly.</p>

      <p style="margin:14px 0 0 0"><strong>Reference code:</strong> ${opts.referenceCode}</p>

      <h3 style="margin:18px 0 8px 0;font-size:16px">What happens next?</h3>
      <ol style="margin:0;padding-left:18px">
        <li>Internal review</li>
        <li>NDA review (if approved)</li>
        <li>Investor access activation</li>
      </ol>

      <p style="margin-top:16px">Questions? Contact us at <a href="mailto:info@vireoka.com">info@vireoka.com</a>.</p>
      <p style="font-size:12px;opacity:0.7;margin-top:18px">Sent ${nowIso()}</p>
    </div>
  `;
  return sendEmail({ to: opts.to, subject, html });
}

export async function sendInternalNewLeadNotification(opts: {
  fullName: string;
  email: string;
  company?: string | null;
  message?: string | null;
  kind: "REQUEST_ACCESS" | "APPLY";
  referenceCode: string;
}) {
  const to = mustGet("INVESTOR_NOTIFY_EMAIL");
  const adminUrl = `${baseUrl()}/admin/investors`;

  const subject = `New Investor Lead — ${opts.kind} — ${opts.fullName}`;
  const html = `
    <div style="font-family:system-ui,Segoe UI,Roboto,Helvetica,Arial,sans-serif;line-height:1.5">
      <h2 style="margin:0 0 10px 0">New Investor Lead</h2>
      <p><strong>Kind:</strong> ${opts.kind}</p>
      <p><strong>Name:</strong> ${opts.fullName}</p>
      <p><strong>Email:</strong> ${opts.email}</p>
      <p><strong>Company:</strong> ${opts.company ?? ""}</p>
      <p><strong>Message:</strong><br/>${(opts.message ?? "").replaceAll("<", "&lt;").replaceAll(">", "&gt;")}</p>
      <p><strong>Reference code:</strong> ${opts.referenceCode}</p>

      <p style="margin-top:16px">
        <a href="${adminUrl}" target="_blank" rel="noreferrer">Open Admin Leads</a>
      </p>
      <p style="font-size:12px;opacity:0.7;margin-top:18px">Sent ${nowIso()}</p>
    </div>
  `;
  return sendEmail({ to, subject, html });
}

export async function sendNdaInviteEmail(opts: {
  to: string;
  ndaUrl: string;
}) {
  const subject = "Vireoka NDA — Signature required";
  const html = `
    <div style="font-family:system-ui,Segoe UI,Roboto,Helvetica,Arial,sans-serif;line-height:1.5">
      <h2 style="margin:0 0 10px 0">Vireoka NDA</h2>
      <p>Please review and sign the NDA using the secure link below:</p>
      <p><a href="${opts.ndaUrl}" target="_blank" rel="noreferrer">${opts.ndaUrl}</a></p>
      <p style="font-size:12px;opacity:0.7;margin-top:18px">Sent ${nowIso()}</p>
    </div>
  `;
  return sendEmail({ to: opts.to, subject, html });
}

export async function sendInvestorApprovalEmail(opts: {
  to: string;
  verifyUrl: string;
}) {
  const subject = "Vireoka — Investor access approved";
  const html = `
    <div style="font-family:system-ui,Segoe UI,Roboto,Helvetica,Arial,sans-serif;line-height:1.5">
      <h2 style="margin:0 0 10px 0">Your investor access is approved</h2>
      <p>Use the secure link below to continue:</p>
      <p><a href="${opts.verifyUrl}" target="_blank" rel="noreferrer">${opts.verifyUrl}</a></p>
      <p style="font-size:12px;opacity:0.7;margin-top:18px">Sent ${nowIso()}</p>
    </div>
  `;
  return sendEmail({ to: opts.to, subject, html });
}
