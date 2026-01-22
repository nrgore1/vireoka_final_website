import nodemailer from "nodemailer";
import { supabaseAdmin } from "@/lib/supabase/admin";
import {
  requestReceivedHtml,
  followUpHtml,
  adminNotifyHtml,
} from "./templates";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST!,
  port: Number(process.env.SMTP_PORT || 587),
  secure: false,
  auth: {
    user: process.env.SMTP_USER!,
    pass: process.env.SMTP_PASS!,
  },
});

async function logEmail(
  recipient: string,
  type: string,
  status: string,
  error?: string
) {
  const supabase = supabaseAdmin();
  await supabase.from("email_logs").insert({
    recipient,
    type,
    status,
    error,
  });
}

export async function sendRequestReceivedEmail(email: string) {
  try {
    await transporter.sendMail({
      from: `"Vireoka Investor Relations" <${process.env.SMTP_FROM!}>`,
      to: email,
      replyTo: process.env.SMTP_REPLY_TO!,
      subject: "We’ve received your access request",
      html: requestReceivedHtml(email),
    });
    await logEmail(email, "request_received", "sent");
  } catch (err: any) {
    await logEmail(email, "request_received", "failed", err.message);
  }
}

export async function sendFollowUpEmail(email: string) {
  try {
    await transporter.sendMail({
      from: `"Vireoka Investor Relations" <${process.env.SMTP_FROM!}>`,
      to: email,
      replyTo: process.env.SMTP_REPLY_TO!,
      subject: "Following up on your Vireoka request",
      html: followUpHtml(email),
    });
    await logEmail(email, "follow_up", "sent");
  } catch (err: any) {
    await logEmail(email, "follow_up", "failed", err.message);
  }
}

export async function notifyAdmin(email: string) {
  try {
    await transporter.sendMail({
      from: `"Vireoka System" <${process.env.SMTP_FROM!}>`,
      to: process.env.ADMIN_EMAIL!,
      subject: "New investor access request",
      html: adminNotifyHtml(email),
    });
    await logEmail(process.env.ADMIN_EMAIL!, "admin_notify", "sent");
  } catch (err: any) {
    await logEmail(process.env.ADMIN_EMAIL!, "admin_notify", "failed", err.message);
  }
}
