import { cookies } from "next/headers";

/**
 * Minimal server-side session helper.
 * We keep this conservative: if we can't confidently identify a user, return null.
 *
 * This is intentionally cookie-based so it works on Hostinger and Vercel.
 * You can later replace/extend this to use Supabase auth helpers if desired.
 */
export type SessionUser = {
  email: string;
};

const CANDIDATE_EMAIL_COOKIES = [
  "vireoka_user_email",
  "vireoka_email",
  "user_email",
  "admin_email",
  "investor_email",
];

export async function getSessionUser(): Promise<SessionUser | null> {
  const store = await cookies();

  for (const key of CANDIDATE_EMAIL_COOKIES) {
    const v = store.get(key)?.value;
    if (v && v.includes("@")) return { email: v };
  }

  // If you later add Supabase auth cookies, you can detect them here and map to an email.
  return null;
}
