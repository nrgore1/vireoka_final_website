import nodemailer from "nodemailer";

type SendEmailArgs = {
  to: string;
  subject: string;
  text: string;
};

function required(name: string) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env var: ${name}`);
  return v;
}

export async function sendEmail({ to, subject, text }: SendEmailArgs) {
  // If SMTP not configured, no-op in production-safe way
  if (!process.env.SMTP_HOST) {
    console.warn("[email] SMTP not configured; skipping email to:", to, subject);
    return { ok: true, skipped: true };
  }

  const transporter = nodemailer.createTransport({
    host: required("SMTP_HOST"),
    port: Number(process.env.SMTP_PORT ?? "587"),
    secure: (process.env.SMTP_SECURE ?? "false") === "true",
    auth: {
      user: required("SMTP_USER"),
      pass: required("SMTP_PASS"),
    },
  });

  const from = process.env.EMAIL_FROM ?? required("SMTP_USER");

  await transporter.sendMail({
    from,
    to,
    subject,
    text,
  });

  return { ok: true };
}
