export type SendEmailArgs = {
  to: string;
  subject: string;
  html: string;
  text?: string;
};

/**
 * Placeholder email sender.
 * Replace implementation with Resend, SES, Nodemailer, etc.
 */
export async function sendEmail({
  to,
  subject,
  html,
  text,
}: SendEmailArgs) {
  if (process.env.NODE_ENV !== "production") {
    console.log("[sendEmail:dev]", {
      to,
      subject,
      html,
      text,
    });
  }

  // TODO: integrate real email provider here
  return { success: true };
}
