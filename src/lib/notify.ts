import "server-only";

/**
 * Minimal notification layer.
 * Production: wire to SMTP (Resend, Postmark, SES, etc).
 * For now: logs so builds/deploys work deterministically.
 */

function log(kind: string, to: string) {
  // eslint-disable-next-line no-console
  console.log(`[notify] ${kind} -> ${to}`);
}

export async function emailRequestReceived(email: string) {
  log("request_received", email);
}

export async function emailApproved(email: string) {
  log("approved", email);
}

export async function emailRejected(email: string) {
  log("rejected", email);
}

export async function emailFollowUp(email: string) {
  log("follow_up", email);
}
