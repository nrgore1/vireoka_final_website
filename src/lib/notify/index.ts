import "server-only";

/**
 * Nodemailer must be loaded via require()
 * to avoid Turbopack + TS dynamic import issues.
 */

type Mailer = {
  createTransport: (opts: any) => {
    sendMail: (opts: any) => Promise<any>;
  };
};

function getMailer(): Mailer {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  return require("nodemailer") as Mailer;
}

async function sendMail(opts: {
  to: string;
  subject: string;
  html: string;
}) {
  const mailer = getMailer();

  const transporter = mailer.createTransport({
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
    ...opts,
  });
}

/* =========================
   Public notification API
   ========================= */

export async function emailRequestReceived(email: string) {
  await sendMail({
    to: email,
    subject: "We received your request",
    html: "<p>Thanks — we’ve received your request.</p>",
  });
}

export async function emailApproved(email: string) {
  await sendMail({
    to: email,
    subject: "You’re approved",
    html: "<p>Your access has been approved.</p>",
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
