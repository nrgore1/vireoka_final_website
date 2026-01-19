import { audit, revokeInvestor } from "./investorStore";

/**
 * Auto-expire investor access if TTL passed
 * Phase-1: invoked manually or via cron later
 */
export async function expireIfNeeded(inv: any) {
  if (!inv?.expiresAt) return inv;

  const now = Date.now();
  const expires = new Date(inv.expiresAt).getTime();

  if (expires > now) return inv;

  // Revoke access
  const updated = await revokeInvestor(inv.email);

  // Audit expiry
  await audit(inv.email, "EXPIRED", {
    expiresAt: inv.expiresAt,
  });

  return updated;
}
