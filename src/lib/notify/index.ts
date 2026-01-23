<<<<<<< HEAD
import {
  requestReceivedTemplate,
  approvedTemplate,
  rejectedTemplate,
  followUpTemplate,
} from "@/lib/notify/templates";
import { sendCommsEmail } from "@/lib/notify/mailer";

export async function emailRequestReceived(email: string) {
  // commId is created inside sendCommsEmail; template needs commId
  // We generate a placeholder commId first by sending with a minimal template, then re-send is overkill.
  // Instead: we’ll build template AFTER insert by allowing templates to be built with a commId from meta.
  // We'll do it in a single function below.
  return await sendTemplated(email, "request_received");
}

export async function emailApproved(email: string) {
  return await sendTemplated(email, "approved");
}

export async function emailRejected(email: string) {
  return await sendTemplated(email, "rejected");
}

export async function emailFollowUp(email: string) {
  return await sendTemplated(email, "follow_up");
}

async function sendTemplated(email: string, kind: "request_received"|"approved"|"rejected"|"follow_up") {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  // Create a comm row first to get commId for tracking links
  // Then send using that commId, updating the same row status.
  // We reuse sendCommsEmail by passing final html/text with commId embedded as meta, but it creates its own comm row.
  // So we handle comm row here directly to keep commId stable.

  const { supabaseAdmin } = await import("@/lib/supabase/admin");
  const supabase = supabaseAdmin();

  const subjectMap: Record<string,string> = {
    request_received: "We’ve received your access request",
    approved: "Investor access approved — Vireoka",
    rejected: "Update on investor access — Vireoka",
    follow_up: "Following up on your Vireoka request",
  };

  const { data: comm } = await supabase
    .from("investor_comms")
    .insert({ email, type: kind, subject: subjectMap[kind], status: "queued", meta: { siteUrl } })
    .select("id")
    .single();

  const commId = comm?.id as string;

  const args = { email, commId, siteUrl };
  const tpl =
    kind === "request_received" ? requestReceivedTemplate(args) :
    kind === "approved" ? approvedTemplate(args) :
    kind === "rejected" ? rejectedTemplate(args) :
    followUpTemplate(args);

  // Throttle + send, but update our existing row
  const { canSendEmail } = await import("@/lib/emailThrottle");
  const throttle = await canSendEmail(email);
  if (!throttle.ok) {
    await supabase.from("investor_comms")
      .update({ status: "failed", error: `throttled:${throttle.reason}` })
      .eq("id", commId);
    return { ok: false as const, commId, reason: `throttled:${throttle.reason}` };
  }

  try {
    const { default: nodemailer } = await import("nodemailer");
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST!,
      port: Number(process.env.SMTP_PORT || 587),
      secure: false,
      auth: { user: process.env.SMTP_USER!, pass: process.env.SMTP_PASS! },
    });

    const info = await transporter.sendMail({
      from: `"Vireoka Investor Relations" <${process.env.SMTP_FROM!}>`,
      to: email,
      replyTo: process.env.SMTP_REPLY_TO || process.env.SMTP_FROM,
      subject: tpl.subject,
      html: tpl.html,
      text: tpl.text,
    });

    await supabase.from("investor_comms")
      .update({ status: "sent", provider_id: String(info.messageId || "") })
      .eq("id", commId);

    return { ok: true as const, commId };
  } catch (err: any) {
    await supabase.from("investor_comms")
      .update({ status: "failed", error: err?.message || "send_failed" })
      .eq("id", commId);

    return { ok: false as const, commId, reason: err?.message || "send_failed" };
  }
=======
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
>>>>>>> rebuild-forward
}
