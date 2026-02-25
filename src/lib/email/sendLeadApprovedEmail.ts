import { sendEmail } from "@/lib/email/resend";

function esc(v: any) {
  return String(v ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

export async function sendLeadApprovedEmail(args: {
  to: string;
  name?: string | null;
  referenceCode: string;
  role?: string | null;
}) {
  const to = String(args.to || "").trim().toLowerCase();
  if (!to) throw new Error("Missing recipient email");

  const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");
  const statusUrl = `${baseUrl}/intelligence/status`;

  const subject = "Vireoka Intelligence — Approved (Next steps)";
  const html = `
  <div style="font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial; line-height: 1.5;">
    <p style="margin:0 0 12px 0;">Hi ${esc(args.name || "there")},</p>

    <p style="margin:0 0 12px 0;">
      Your Vireoka Intelligence request has been <strong>APPROVED</strong>.
    </p>

    <p style="margin:0 0 12px 0;">
      Next step: open the status page and enter your reference code:
    </p>

    <p style="margin:0 0 16px 0;">
      <a href="${esc(statusUrl)}"
         style="display:inline-block;padding:10px 14px;border-radius:10px;background:#111827;color:#ffffff;text-decoration:none;font-weight:700;">
        Open status page
      </a>
    </p>

    <p style="margin:0 0 8px 0;">
      Reference code: <span style="font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas; font-weight:700;">${esc(args.referenceCode)}</span>
    </p>

    <p style="margin:0 0 12px 0;color:#6b7280;font-size:12px;">
      Once you proceed, you’ll be prompted to accept NDA + Terms before portal access.
    </p>

    <p style="margin:16px 0 0 0;color:#6b7280;font-size:12px;">
      — Vireoka Team
    </p>
  </div>
  `.trim();

  return sendEmail({ to, subject, html });
}
