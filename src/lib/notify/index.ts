import "server-only";

type Mail = {
  to: string;
  subject: string;
  html: string;
};

type Mailer = {
  createTransport: (opts: any) => {
    sendMail: (mail: any) => Promise<void>;
  };
};

function getMailer(): Mailer {
  return require("nodemailer") as Mailer;
}

async function sendMail(mail: Mail) {
  const nodemailer = getMailer();
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST!,
    port: Number(process.env.SMTP_PORT || 587),
    secure: false,
    auth: {
      user: process.env.SMTP_USER!,
      pass: process.env.SMTP_PASS!,
    },
  });

  await transporter.sendMail({
    from: process.env.SMTP_FROM!,
    ...mail,
  });
}

export async function emailRequestReceived(email: string) {
  await sendMail({
    to: email,
    subject: "Request received",
    html: "<p>We’ve received your request.</p>",
  });
}

export async function emailApproved(email: string) {
  await sendMail({
    to: email,
    subject: "Request approved",
    html: "<p>Your request has been approved.</p>",
  });
}

export async function emailRejected(email: string) {
  await sendMail({
    to: email,
    subject: "Update on your request",
    html: "<p>Thank you for your interest.</p>",
  });
}

export async function emailFollowUp(email: string) {
  await sendMail({
    to: email,
    subject: "Following up",
    html: "<p>Just following up.</p>",
  });
}
