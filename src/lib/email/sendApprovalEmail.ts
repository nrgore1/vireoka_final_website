import { sendEmail } from "@/lib/email/resend";

/**
 * Approval email for investor applications (used by /api/admin/investor-applications).
 * Accepts the legacy call shape: { email, ndaUrl, expiresHours }.
 */
export async function sendApprovalEmail(params: {
  email: string;
  ndaUrl: string;
  expiresHours?: number;
}) {
  const email = String(params.email || "").trim();
  const ndaUrl = String(params.ndaUrl || "").trim();
  const expiresHours = typeof params.expiresHours === "number" ? params.expiresHours : 72;

  if (!email || !ndaUrl) {
    return { ok: false as const, error: "Missing email or ndaUrl" };
  }

  const subject = "Vireoka — NDA Ready for Signature";
  const html = `
    <div style="font-family:system-ui,Segoe UI,Roboto,Helvetica,Arial,sans-serif;line-height:1.5">
      <h2 style="margin:0 0 10px 0">Your NDA is ready</h2>
      <p>Please review and sign the NDA using the secure link below:</p>
      <p><a href="${ndaUrl}" target="_blank" rel="noreferrer">${ndaUrl}</a></p>
      <p style="margin-top:14px;font-size:12px;opacity:.75">
        This link expires in approximately ${expiresHours} hours.
      </p>
      <p style="margin-top:16px">
        Questions? Contact us at <a href="mailto:info@vireoka.com">info@vireoka.com</a>.
      </p>
    </div>
  `;

  return sendEmail({ to: email, subject, html });
}
