import { cookies } from "next/headers";
import { adminCookieName, verifyAdminSession } from "@/lib/adminSession";

export async function requireAdmin(_req: Request): Promise<boolean> {
  const cookieStore = await cookies();

  // adminCookieName is a STRING, not a function
  const token = cookieStore.get(adminCookieName)?.value;
  if (!token) return false;

  return verifyAdminSession(token);
}
