import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function sendApprovalEmail(params: {
  email: string;
  ndaUrl: string;
  expiresHours: number;
}) {
  const { email, ndaUrl, expiresHours } = params;

  await resend.emails.send({
    from: 'Vireoka <investors@vireoka.com>',
    to: email,
    subject: 'Vireoka Investor Access – NDA Review Required',
    html: `
      <p>Thank you for your interest in Vireoka.</p>
      <p>Your investor access request has been approved pending NDA completion.</p>
      <p><strong>Action required:</strong> Please review and sign the NDA using the secure link below:</p>
      <p><a href="${ndaUrl}">Review & Sign NDA</a></p>
      <p>This link expires in <strong>${expiresHours} hours</strong>.</p>
      <p>Once signed, your investor portal access will be activated and you will be able to log in.</p>
      <p>— Vireoka Team</p>
    `,
  });
}
