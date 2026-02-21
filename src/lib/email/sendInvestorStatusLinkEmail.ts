import { sendEmail } from "@/lib/email/resend";

function esc(v: any) {
  return String(v ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function formatReviewLine(appStatus?: string | null, createdAt?: string | null) {
  const s = String(appStatus || "").toLowerCase();
  if (s !== "submitted") return "";

  // 24-hour review promise if admin hasn't acted yet
  let within = true;
  if (createdAt) {
    const t = new Date(createdAt).getTime();
    if (Number.isFinite(t)) {
      within = (Date.now() - t) < 24 * 60 * 60 * 1000;
    }
  }

  return within
    ? "Your request is currently under review. You’ll receive an update within 24 hours."
    : "Your request is currently under review. You’ll receive an update as soon as possible.";
}

export async function sendInvestorStatusLinkEmail(args: {
  email: string;
  statusUrl: string;
  expiresHours: number;

  // Optional personalization (recommended)
  name?: string | null;
  applicationStatus?: string | null;
  applicationCreatedAt?: string | null;
}) {
  const to = String(args.email || "").trim().toLowerCase();
  const statusUrl = String(args.statusUrl || "").trim();
  const expiresHours = Number(args.expiresHours || 2);

  if (!to || !statusUrl) throw new Error("Missing email or statusUrl");

  const name = String(args.name || "").trim();
  const greeting = name ? `Hi ${esc(name)},` : "Hi there,";

  const reviewLine = formatReviewLine(args.applicationStatus, args.applicationCreatedAt);

  const subject = "Vireoka — Your investor application status";
  const html = `
  <div style="font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial; line-height: 1.5;">
    <p style="margin:0 0 12px 0;">${greeting}</p>

    <p style="margin:0 0 12px 0;">
      You requested an update on your Vireoka investor application. Use the secure link below to view your current status.
    </p>

    ${reviewLine ? `<p style="margin:0 0 12px 0;"><strong>${esc(reviewLine)}</strong></p>` : ""}

    <p style="margin:0 0 16px 0;">
      <a href="${esc(statusUrl)}"
         style="display:inline-block;padding:10px 14px;border-radius:10px;background:#111827;color:#ffffff;text-decoration:none;font-weight:700;">
        View application status
      </a>
    </p>

    <p style="margin:0 0 10px 0;color:#6b7280;font-size:12px;">
      For security, this link expires in approximately <strong>${expiresHours} hours</strong>.
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
