import { sendEmail } from "@/lib/email";

export async function notifyInvestorRequestReceived(email: string) {
  const html = `
<p>We’ve received your request for <strong>investor access</strong> to Vireoka.</p>

<p>Our team will review your request shortly.</p>

<p>— <strong>Vireoka Team</strong></p>
`.trim();

  await sendEmail({
    to: email,
    subject: "Vireoka — Strategic Access request received",
    html,
  });
}
