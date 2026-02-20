import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

/**
 * Next.js 16+: cookies() is async and must be awaited.
 * This helper returns a Supabase server client wired to Next cookies.
 */
export async function supabaseServer() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          // cookieStore.getAll() exists once cookies() is awaited
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // In some server component contexts Next disallows setting cookies.
            // It's fine; auth reads still work.
          }
        },
      },
    }
  );
}
