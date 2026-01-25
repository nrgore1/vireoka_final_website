import { cookies } from "next/headers";

const ADMIN_COOKIE = "admin_session";

export async function createAdminSession(email: string) {
  const cookieStore = await cookies();

  cookieStore.set({
    name: ADMIN_COOKIE,
    value: JSON.stringify({ email }),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });

  return { email };
}

export async function readAdminSession(): Promise<{ email: string } | null> {
  const cookieStore = await cookies();
  const cookie = cookieStore.get(ADMIN_COOKIE);

  if (!cookie) return null;

  try {
    return JSON.parse(cookie.value);
  } catch {
    return null;
  }
}

export async function clearAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_COOKIE);
}
