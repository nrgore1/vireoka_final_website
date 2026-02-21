import { sendEmail } from "@/lib/email/resend";

function esc(v: any) {
  return String(v ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

export async function sendRequestInfoEmail(args: {
  email: string;
  statusUrl: string;
  message?: string;
  name?: string | null;
}) {
  const to = String(args.email || "").trim().toLowerCase();
  const statusUrl = String(args.statusUrl || "").trim();
  const message = String(args.message || "").trim();
  const name = String(args.name || "").trim();
  const greeting = name ? `Hi ${esc(name)},` : "Hi there,";

  if (!to) throw new Error("Missing recipient email");
  if (!statusUrl) throw new Error("Missing statusUrl");

  const subject = "Vireoka — Additional information needed to complete your review";

  const noteHtml = message
    ? `
      <div style="margin:14px 0 16px;padding:12px 14px;border:1px solid #e5e7eb;border-radius:12px;background:#fafafa">
        <div style="font-size:12px;letter-spacing:.04em;text-transform:uppercase;color:#6b7280;font-weight:700;margin-bottom:8px">
          Message from our review team
        </div>
        <div style="white-space:pre-wrap;color:#111827;font-size:14px">${esc(message)}</div>
      </div>
    `
    : `
      <div style="margin:14px 0 16px;padding:12px 14px;border:1px solid #e5e7eb;border-radius:12px;background:#fafafa">
        <div style="color:#111827;font-size:14px">
          Please reply with a bit more detail about your role, firm, and intended use of our investor materials so we can complete the review.
        </div>
      </div>
    `;

  const html = `
  <div style="font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial; line-height: 1.5;">
    <p style="margin:0 0 12px 0;">${greeting}</p>

    <p style="margin:0 0 12px 0;">
      Thanks for your interest in Vireoka. To complete your investor access review, we need a little more information.
    </p>

    ${noteHtml}

    <p style="margin:0 0 14px 0;">
      You can also check your application status anytime here:
    </p>

    <p style="margin:0 0 16px 0;">
      <a href="${esc(statusUrl)}"
         style="display:inline-block;padding:10px 14px;border-radius:10px;background:#111827;color:#ffffff;text-decoration:none;font-weight:700;">
        View application status
      </a>
    </p>

    <p style="margin:0;color:#6b7280;font-size:12px;">
      If the button doesn’t work, copy and paste this URL into your browser:<br/>
      ${esc(statusUrl)}
    </p>

    <p style="margin:16px 0 0 0;color:#6b7280;font-size:12px;">
      — Vireoka Team
    </p>
  </div>
  `.trim();

  return sendEmail({ to, subject, html });
}
