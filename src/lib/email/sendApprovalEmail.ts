import { sendEmail } from "@/lib/email/resend";

function esc(v: any) {
  return String(v ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

export async function sendApprovalEmail(params: {
  email: string;
  ndaUrl: string;
  expiresHours?: number;
  name?: string | null;
}) {
  const email = String(params.email || "").trim().toLowerCase();
  const ndaUrl = String(params.ndaUrl || "").trim();
  const expiresHours = typeof params.expiresHours === "number" ? params.expiresHours : 72;

  if (!email || !ndaUrl) {
    return { ok: false as const, error: "Missing email or ndaUrl" };
  }

  const name = String(params.name || "").trim();
  const greeting = name ? `Hi ${esc(name)},` : "Hi there,";

  const subject = "Vireoka — NDA ready to review";
  const html = `
  <div style="font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial; line-height: 1.5;">
    <p style="margin:0 0 12px 0;">${greeting}</p>

    <p style="margin:0 0 12px 0;">
      Your investor access request has been approved. <strong>We’ve prepared your NDA for review.</strong>
    </p>

    <p style="margin:0 0 16px 0;">
      Please use the secure link below to review and accept the NDA. Once completed, your investor portal access will be enabled.
    </p>

    <p style="margin:0 0 16px 0;">
      <a href="${esc(ndaUrl)}"
         style="display:inline-block;padding:10px 14px;border-radius:10px;background:#111827;color:#ffffff;text-decoration:none;font-weight:700;">
        Review & Accept NDA
      </a>
    </p>

    <p style="margin:0 0 10px 0;color:#6b7280;font-size:12px;">
      For security, this link expires in approximately <strong>${expiresHours} hours</strong>.
    </p>

    <p style="margin:0;color:#6b7280;font-size:12px;">
      If the button doesn’t work, copy and paste this URL into your browser:<br/>
      ${esc(ndaUrl)}
    </p>

    <p style="margin:16px 0 0 0;color:#6b7280;font-size:12px;">
      — Vireoka Team
    </p>
  </div>
  `.trim();

  return sendEmail({ to: email, subject, html });
}
