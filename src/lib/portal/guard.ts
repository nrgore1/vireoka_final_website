import { redirect } from "next/navigation";

type GuardResult = {
  userId: string;
  email: string;
};

/**
 * Best-effort portal gate:
 * - Not logged in -> /portal/login
 * - No access or cannot verify -> /portal/pending?step=activation
 * - Expired -> /portal/expired
 *
 * NOTE:
 * This intentionally uses `any` around Supabase queries to avoid Next 16 + TS
 * "excessively deep" generic instantiation when table names are dynamic.
 */
export async function guardInvestorPortal(sb: any): Promise<GuardResult> {
  const { data: userRes } = await sb.auth.getUser();
  const user = userRes?.user;

  if (!user) {
    redirect("/portal/login");
  }

  const email = String(user.email || "").toLowerCase();

  // Keep as plain string[] (NOT "as const") to avoid union-literal generic explosions.
  const TABLE_CANDIDATES: string[] = [
    "investor_portal_access",
    "portal_access",
    "investor_access",
    "profiles",
  ];

  const pickDate = (row: any, keys: string[]) => {
    for (const k of keys) {
      const v = row?.[k];
      if (!v) continue;
      const d = new Date(v);
      if (!Number.isNaN(d.getTime())) return d;
    }
    return null;
  };

  const pickBool = (row: any, keys: string[]) => {
    for (const k of keys) {
      const v = row?.[k];
      if (typeof v === "boolean") return v;
      if (typeof v === "number") return v !== 0;
      if (typeof v === "string") {
        const s = v.toLowerCase().trim();
        if (["true", "yes", "1", "active", "enabled"].includes(s)) return true;
        if (["false", "no", "0", "inactive", "disabled"].includes(s)) return false;
      }
    }
    return null;
  };

  let accessRow: any = null;

  for (const table of TABLE_CANDIDATES) {
    try {
      // Common patterns:
      // - profiles: id = user.id
      // - access tables: user_id = user.id
      const byIdCol = table === "profiles" ? "id" : "user_id";

      // Cast the dynamic query chain to any to prevent TS deep instantiation.
      const q = (sb as any).from(table).select("*").eq(byIdCol, user.id);

      const { data, error } = await q.maybeSingle();

      // If table exists but RLS denies select, error will be set.
      // We never throw; we just keep trying.
      if (error) continue;
      if (data) {
        accessRow = data;
        break;
      }
    } catch {
      continue;
    }
  }

  // No row found anywhere => treat as not active yet (pending)
  if (!accessRow) {
    redirect("/portal/pending?step=activation");
  }

  const expiresAt = pickDate(accessRow, [
    "expires_at",
    "expiresAt",
    "ends_at",
    "endsAt",
    "access_expires_at",
  ]);
  if (expiresAt && expiresAt.getTime() < Date.now()) {
    redirect("/portal/expired");
  }

  const activeFlag = pickBool(accessRow, [
    "active",
    "is_active",
    "enabled",
    "has_access",
    "investor_access",
  ]);
  if (activeFlag === false) {
    redirect("/portal/pending?step=activation");
  }

  const ndaAccepted = pickBool(accessRow, ["nda_accepted", "ndaAccepted"]);
  if (ndaAccepted === false) {
    redirect("/portal/pending?step=nda");
  }

  return { userId: user.id, email };
}
