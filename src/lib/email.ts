// Server-only email utility
// Uses require() to avoid TS type issues in CI

const nodemailer = require("nodemailer");

type SendEmailArgs = {
  to: string;
  subject: string;
  text: string;
};

export async function sendEmail({ to, subject, text }: SendEmailArgs) {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.SMTP_FROM || "no-reply@vireoka.com",
    to,
    subject,
    text,
  });

  return { ok: true };
}
