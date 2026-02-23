import { sendEmail } from "@/lib/email";

export async function sendInvestorApprovedEmail(
  email: string,
  token: string
) {
  const link = `${process.env.NEXT_PUBLIC_SITE_URL}/intelligence/accept?token=${token}`;

  const html = `
<p>Dear Investor,</p>

<p>
We are pleased to inform you that your request for investor access to
<strong>Vireoka</strong> has been approved.
</p>

<p>
To proceed, please review and accept our Non-Disclosure Agreement using the
secure link below:
</p>

<p>
<a href="${link}">Accept NDA & Access Investor Materials</a>
</p>

<p>
If you did not request this access, you may safely ignore this email.
</p>

<p>— <strong>The Vireoka Team</strong></p>
`.trim();

  await sendEmail({
    to: email,
    subject: "Your Vireoka Investor Access",
    html,
  });
}
