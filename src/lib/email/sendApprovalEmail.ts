import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function sendApprovalEmail(email: string, ndaUrl: string) {
  await resend.emails.send({
    from: 'Vireoka <investors@vireoka.com>',
    to: email,
    subject: 'Vireoka Investor Access – NDA Review',
    html: `
      <p>Thank you for your interest in Vireoka.</p>
      <p>Your investor access request has been approved.</p>
      <p>Please review and sign the NDA using the secure link below:</p>
      <p><a href="${ndaUrl}">Review NDA</a></p>
      <p>Once completed, your investor portal access will be activated.</p>
    `,
  });
}
