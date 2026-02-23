import { sendEmail } from "@/lib/email";

export type InvestorRequestPayload = {
  email: string;
  name: string;
  role?: string;
  firm?: string;
};

export async function emailRequestReceived(payload: InvestorRequestPayload) {
  const { email, name, role, firm } = payload;

  const html = `
<p>Dear ${name},</p>

<p>
Thank you for your interest in <strong>Vireoka</strong>.
We have received your request for investor access.
</p>

<p><strong>Details submitted:</strong></p>
<ul>
  <li>Email: ${email}</li>
  ${role ? `<li>Role: ${role}</li>` : ""}
  ${firm ? `<li>Firm: ${firm}</li>` : ""}
</ul>

<p>
Our team will review your request shortly.
If approved, you will receive a follow-up email with instructions
to review and accept the Non-Disclosure Agreement.
</p>

<p>
— <strong>The Vireoka Team</strong>
</p>
`.trim();

  await sendEmail({
    to: email,
    subject: "Vireoka — Strategic Access request received",
    html,
  });
}
