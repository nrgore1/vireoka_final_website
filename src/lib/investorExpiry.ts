import { recordAudit } from "./investorStore";

export async function expireIfNeeded(inv: any) {
  if (!inv?.expiresAt) return inv;

  if (Date.now() > new Date(inv.expiresAt).getTime()) {
    const expired = { ...inv, status: "EXPIRED" };
    await recordAudit({
      email: inv.email,
      action: "EXPIRED",
      at: new Date().toISOString(),
    });
    return expired;
  }
  return inv;
}
