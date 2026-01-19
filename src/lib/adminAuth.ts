export function requireAdminToken(token: string | null) {
  const expected = process.env.VIREOKA_ADMIN_TOKEN;
  if (!expected) throw new Error("VIREOKA_ADMIN_TOKEN not set");
  if (!token || token !== expected) {
    const err = new Error("Unauthorized");
    // @ts-expect-error attach status
    err.status = 401;
    throw err;
  }
}
