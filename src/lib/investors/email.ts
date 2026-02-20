import { Resend } from "resend";

// Accepts: "email@example.com" OR "Name <email@example.com>"
const SIMPLE_EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const NAME_ANGLE_RE = /^.+<\s*[^\s@]+@[^\s@]+\.[^\s@]+\s*>$/;

function isValidFrom(v: string) {
  const s = v.trim();
  return SIMPLE_EMAIL_RE.test(s) || NAME_ANGLE_RE.test(s);
}

function isValidTo(v: string) {
  return SIMPLE_EMAIL_RE.test(v.trim());
}

function canSend() {
  return Boolean(
    process.env.RESEND_API_KEY &&
      process.env.INVESTOR_NOTIFY_EMAIL &&
      process.env.FROM_EMAIL
  );
}

export async function sendInvestorEmail(subject: string, html: string) {
  if (!canSend()) return { skipped: true as const };

  const from = String(process.env.FROM_EMAIL || "").trim();
  const to = String(process.env.INVESTOR_NOTIFY_EMAIL || "").trim();

  // Guard: fail fast with a clear error instead of Resend 422
  if (!isValidFrom(from)) {
    return {
      skipped: false as const,
      error: `FROM_EMAIL invalid: "${from}". Must be "email@example.com" or "Name <email@example.com>".`,
    };
  }
  if (!isValidTo(to)) {
    return {
      skipped: false as const,
      error: `INVESTOR_NOTIFY_EMAIL invalid: "${to}". Must be "email@example.com".`,
    };
  }

  const resend = new Resend(process.env.RESEND_API_KEY!);

  const res = await resend.emails.send({
    from,
    to,
    subject,
    html,
  });

  return { skipped: false as const, res };
}

export function leadToHtml(title: string, payload: Record<string, any>) {
  const rows = Object.entries(payload)
    .map(
      ([k, v]) =>
        `<tr><td style="padding:6px 10px;border:1px solid #eee;"><b>${escapeHtml(
          k
        )}</b></td><td style="padding:6px 10px;border:1px solid #eee;">${escapeHtml(
          String(v ?? "")
        )}</td></tr>`
    )
    .join("");

  return `
  <div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif">
    <h2>${escapeHtml(title)}</h2>
    <table style="border-collapse:collapse">${rows}</table>
  </div>`;
}

function escapeHtml(s: string) {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
