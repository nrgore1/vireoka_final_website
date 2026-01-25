import { sendEmail } from "@/lib/email";

type InvestorRequestEmailInput = {
  email: string;
  name: string;
  role?: string;
  firm?: string | null;
};

export async function notifyInvestorRequestReceived({
  email,
  name,
  role,
  firm,
}: InvestorRequestEmailInput) {
  const html = `
<p>Hi ${name},</p>

<p>We’ve received your request for <strong>investor access</strong> to Vireoka.</p>

<ul>
  <li><strong>Email:</strong> ${email}</li>
  ${role ? `<li><strong>Role:</strong> ${role}</li>` : ""}
  ${firm ? `<li><strong>Firm:</strong> ${firm}</li>` : ""}
</ul>

<p>Our team will review your request and get back to you shortly.</p>

<p>— <strong>Vireoka Team</strong></p>
`.trim();

  await sendEmail({
    to: email,
    subject: "Vireoka — Investor access request received",
    html,
  });
}

/**
 * Backward-compatible alias
 */
export const emailRequestReceived = notifyInvestorRequestReceived;
