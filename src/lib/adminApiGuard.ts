import { requireAdminToken } from "@/lib/supabase/admin";
import { readAdminSession } from "@/lib/adminSession";

export async function requireAdminApi(req: Request): Promise<{ ok: true; email?: string } | { ok: false }> {
  if (requireAdminToken(req)) return { ok: true };

  const s = await readAdminSession();
  if (s?.email) return { ok: true, email: s.email };

  return { ok: false };
}
