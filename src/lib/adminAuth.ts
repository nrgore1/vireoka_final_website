/**
 * Verify admin token.
 * Returns true if authorized, false otherwise.
 */
export async function requireAdminToken(token: string): Promise<boolean> {
  const expected = process.env.ADMIN_API_TOKEN;

  if (!expected) {
    // Fail closed in production, open in local dev
    return process.env.NODE_ENV !== "production";
  }

  return token === expected;
}
