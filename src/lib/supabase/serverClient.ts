import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

/**
 * Next.js 16: cookies() is async, so server client creation must be async.
 */
export async function createClient() {
  const cookieStore = await cookies();

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY");
  }

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll().map((c) => ({ name: c.name, value: c.value }));
      },
      setAll(cookiesToSet) {
        // In some Next.js contexts (e.g. Server Components), cookies are read-only.
        // Supabase may still call setAll; safely ignore if setting isn't allowed.
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            (cookieStore as any).set(name, value, options);
          });
        } catch {
          // ignore
        }
      },
    },
  });
}

/**
 * Backwards-compatible export for existing imports:
 *   import { supabaseServerClient } from "@/lib/supabase/serverClient";
 *
 * NOTE: This is async now, so callers should:
 *   const supabase = await supabaseServerClient();
 */
export const supabaseServerClient = createClient;
