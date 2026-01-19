import { cookies } from "next/headers";
import { adminCookieName, verifyAdminSession } from "@/lib/adminSession";

export async function requireAdmin(_req: Request): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(adminCookieName())?.value;
  if (!token) return false;
  return verifyAdminSession(token);
}
