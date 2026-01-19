import { sendEmail } from "./email";

export async function notifyApproved(email: string) {
  await sendEmail({
    to: email,
    subject: "Investor access approved",
    text: "Your investor access has been approved. You may now access the portal.",
  });
}

export async function notifyRevoked(email: string) {
  await sendEmail({
    to: email,
    subject: "Investor access revoked",
    text: "Your investor access has been revoked. If you believe this is an error, contact support.",
  });
}
