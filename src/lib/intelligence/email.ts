type SendResult = { ok: true; skipped?: boolean } | { ok: false; error: string };

/**
 * Very small helper used by fanout.ts.
 * If you already have a full email system elsewhere, this stays compatible.
 */
export function leadToHtml(lead: Record<string, any>) {
  const rows = Object.entries(lead || {})
    .map(([k, v]) => `<tr><td style="padding:6px 10px;border:1px solid #eee;"><b>${escapeHtml(k)}</b></td><td style="padding:6px 10px;border:1px solid #eee;">${escapeHtml(String(v ?? ""))}</td></tr>`)
    .join("");

  return `
  <div style="font-family:system-ui, -apple-system, Segoe UI, Roboto, Arial; line-height:1.4">
    <h2 style="margin:0 0 8px">New Strategic Access Request</h2>
    <p style="margin:0 0 12px;color:#444">A new request was submitted.</p>
    <table style="border-collapse:collapse;font-size:14px">${rows}</table>
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

/**
 * Minimal sender used by the legacy fanout pipeline.
 * - If RESEND_API_KEY (or your chosen provider) isn't configured, it NO-OPs.
 * - This keeps builds green and avoids runtime crashes.
 *
 * If you already have a different mail provider, we can wire it later.
 */
export async function sendInvestorEmail(args: {
  to: string;
  subject: string;
  html: string;
  from?: string;
}): Promise<SendResult> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = args.from || process.env.MAIL_FROM || "Vireoka <no-reply@vireoka.com>";

  if (!apiKey) {
    // Do not throw—fanout should not break application flow in dev.
    return { ok: true, skipped: true };
  }

  try {
    const r = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: args.to,
        subject: args.subject,
        html: args.html,
      }),
    });

    if (!r.ok) {
      const t = await r.text().catch(() => "");
      return { ok: false, error: `Email send failed (${r.status}): ${t}` };
    }

    return { ok: true };
  } catch (e: any) {
    return { ok: false, error: e?.message || "Email send error" };
  }
}
