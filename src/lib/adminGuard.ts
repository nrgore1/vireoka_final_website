import "server-only";
import { cookies } from "next/headers";
import { adminCookieName, verifyAdminSession } from "./adminSession";

/**
 * Admin guard: returns true if a valid admin session exists.
 */
export async function requireAdmin(): Promise<boolean> {
  const cookieStore = cookies();
  const token = cookieStore.get(adminCookieName)?.value;

  if (!token) return false;

  const session = await verifyAdminSession(token);
  return session !== null;
}
