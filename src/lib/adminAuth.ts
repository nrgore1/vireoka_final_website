export function requireAdmin(req: Request): { ok: true } | { ok: false; status: number; error: string } {
  const h = req.headers;

  // Accept either header style
  const tokenFromX = h.get("x-admin-token") || "";
  const auth = h.get("authorization") || "";
  const tokenFromBearer = auth.toLowerCase().startsWith("bearer ") ? auth.slice(7).trim() : "";

  const token = tokenFromX || tokenFromBearer;

  // Accept any of these envs (so local/dev/prod can vary without breaking)
  const expected =
    process.env.ADMIN_API_TOKEN ||
    process.env.ADMIN_TOKEN_VALUE ||
    process.env.ADMIN_SESSION_SECRET ||
    "";

  if (!expected) {
    return { ok: false, status: 500, error: "admin auth not configured (missing ADMIN_API_TOKEN / ADMIN_TOKEN_VALUE / ADMIN_SESSION_SECRET)" };
  }

  if (!token || token !== expected) {
    return { ok: false, status: 401, error: "unauthorized" };
  }

  return { ok: true };
}

/**
 * ✅ Compatibility: older middleware imports requireAdminToken()
 * Alias to requireAdmin() (preferred name).
 */
export const requireAdminToken = requireAdmin;
