/**
 * Email transport stub.
 * Safe for dev, CI, and prod until a provider is configured.
 */
export async function sendEmail(opts: {
  to: string;
  subject: string;
  html: string;
}) {
  console.log("[email skipped]", {
    to: opts.to,
    subject: opts.subject,
  });
}
