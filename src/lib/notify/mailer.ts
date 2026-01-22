import nodemailer from "nodemailer";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { canSendEmail } from "@/lib/emailThrottle";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST!,
  port: Number(process.env.SMTP_PORT || 587),
  secure: false,
  auth: { user: process.env.SMTP_USER!, pass: process.env.SMTP_PASS! },
});

export async function sendCommsEmail(params: {
  email: string;
  type: string;
  subject: string;
  html: string;
  text: string;
  meta?: any;
}) {
  const supabase = supabaseAdmin();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  // throttle
  const throttle = await canSendEmail(params.email);
  if (!throttle.ok) {
    const { data: row } = await supabase
      .from("investor_comms")
      .insert({
        email: params.email,
        type: params.type,
        subject: params.subject,
        status: "failed",
        error: `throttled:${throttle.reason}`,
        meta: { ...params.meta, siteUrl },
      })
      .select("id")
      .single();

    return { ok: false as const, commId: row?.id, reason: `throttled:${throttle.reason}` };
  }

  // queue row
  const { data: comm } = await supabase
    .from("investor_comms")
    .insert({
      email: params.email,
      type: params.type,
      subject: params.subject,
      status: "queued",
      meta: { ...params.meta, siteUrl },
    })
    .select("id")
    .single();

  const commId = comm?.id as string;

  try {
    const info = await transporter.sendMail({
      from: `"Vireoka Investor Relations" <${process.env.SMTP_FROM!}>`,
      to: params.email,
      replyTo: process.env.SMTP_REPLY_TO || process.env.SMTP_FROM,
      subject: params.subject,
      html: params.html,
      text: params.text, // ✅ plaintext fallback
    });

    await supabase
      .from("investor_comms")
      .update({ status: "sent", provider_id: String(info.messageId || "") })
      .eq("id", commId);

    return { ok: true as const, commId };
  } catch (err: any) {
    await supabase
      .from("investor_comms")
      .update({ status: "failed", error: err?.message || "send_failed" })
      .eq("id", commId);

    return { ok: false as const, commId, reason: err?.message || "send_failed" };
  }
}
