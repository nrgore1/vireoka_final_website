type EmailPayload = {
  to: string;
  subject: string;
  text: string;
};

export async function sendEmail(payload: EmailPayload) {
  // DEV: log only
  if (process.env.NODE_ENV !== "production") {
    console.log("[email]", payload);
    return;
  }

  // PROD: plug SendGrid / SES / Resend later
  // throw new Error("Email provider not configured");
}
export function canNotify(prefs?: { emailNotifications?: boolean }) {
  return prefs?.emailNotifications !== false;
}
