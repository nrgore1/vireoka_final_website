import { sendEmail } from "@/lib/email/resend";

function esc(v: any) {
  return String(v ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

export async function sendRequestInfoEmail(args: {
  email: string;
  name?: string | null;
  message?: string;

  respondUrl: string;
  statusUrl?: string;

  reviewSlaHours?: number;
}) {
  const to = String(args.email || "").trim().toLowerCase();
  const name = String(args.name || "").trim();
  const greeting = name ? `Hi ${esc(name)},` : "Hi there,";

  const message = String(args.message || "").trim();
  const respondUrl = String(args.respondUrl || "").trim();
  const statusUrl = String(args.statusUrl || "").trim();
  const sla = Number.isFinite(args.reviewSlaHours) ? Number(args.reviewSlaHours) : 24;

  if (!to) throw new Error("Missing recipient email");
  if (!respondUrl) throw new Error("Missing respondUrl");

  const subject = "Vireoka — Additional information needed to complete your investor review";

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
          Please share a bit more detail about your role, firm, and intended use of our investor materials so we can complete the review.
        </div>
      </div>
    `;

  const statusLine = statusUrl
    ? `
      <p style="margin:0 0 14px 0;">
        You can also view your application status here:
        <a href="${esc(statusUrl)}" style="color:#111827;font-weight:700;text-decoration:underline;">Status page</a>
      </p>
    `
    : "";

  const html = `
  <div style="font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial; line-height: 1.5;">
    <p style="margin:0 0 12px 0;">${greeting}</p>

    <p style="margin:0 0 12px 0;">
      Thanks for your interest in Vireoka. To complete your investor access review, we need a little more information.
    </p>

    ${noteHtml}

    <p style="margin:0 0 16px 0;">
      Please use the secure link below to provide the requested information. Once received, we’ll continue review and respond within <strong>${sla} hours</strong>.
    </p>

    <p style="margin:0 0 16px 0;">
      <a href="${esc(respondUrl)}"
         style="display:inline-block;padding:10px 14px;border-radius:10px;background:#111827;color:#ffffff;text-decoration:none;font-weight:800;">
        Provide requested information
      </a>
    </p>

    ${statusLine}

    <p style="margin:0;color:#6b7280;font-size:12px;">
      If the button doesn’t work, copy and paste this URL into your browser:<br/>
      ${esc(respondUrl)}
    </p>

    <p style="margin:16px 0 0 0;color:#6b7280;font-size:12px;">
      — Vireoka Team
    </p>
  </div>
  `.trim();

  return sendEmail({ to, subject, html });
}
