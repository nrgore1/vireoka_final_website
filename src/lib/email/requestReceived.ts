import { sendEmail } from "@/lib/email";
import type { InvestorRequestPayload } from "@/lib/email/index";

export async function sendRequestReceivedEmail(
  payload: InvestorRequestPayload & {
    role?: string;
    firm?: string;
  }
) {
  const { name, email, role, firm } = payload;

  const html = `
<p>Hi ${name},</p>

<p>We’ve received your <strong>investor access request</strong>.</p>

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
