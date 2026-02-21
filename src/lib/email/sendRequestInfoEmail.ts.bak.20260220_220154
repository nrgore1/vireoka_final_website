import { sendEmail } from "@/lib/email/resend";

export async function sendRequestInfoEmail(args: { email: string; statusUrl: string }) {
  const subject = "Additional information needed for your investor application";

  const html = `
  <div style="font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial;">
    <h2 style="margin:0 0 12px 0;">We need a bit more information</h2>
    <p style="margin:0 0 12px 0;">
      Thanks for your interest. To proceed, please reply to this email with any additional details
      about your role, fund, check size, or timeline.
    </p>
    <p style="margin:0 0 12px 0;">
      You can also check your application status here:
      <a href="${args.statusUrl}">${args.statusUrl}</a>
    </p>
    <p style="margin:16px 0 0 0;color:#666;font-size:12px;">
      If you did not apply, you can ignore this email.
    </p>
  </div>`;

  return sendEmail({
    to: args.email,
    subject,
    html,
    text: `We need more info to proceed. Status page: ${args.statusUrl}`,
  });
}
