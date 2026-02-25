import { createClient } from "@supabase/supabase-js";

/**
 * Server-side Supabase client using the SERVICE ROLE key.
 * IMPORTANT: Only import/use this in server code (Route Handlers, Server Components).
 */
export function createServiceSupabase() {
  const url =
    process.env.SUPABASE_URL ||
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    "";

  const serviceKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_SERVICE_KEY ||
    "";

  if (!url) {
    throw new Error("Supabase URL is missing (SUPABASE_URL or NEXT_PUBLIC_SUPABASE_URL).");
  }
  if (!serviceKey) {
    throw new Error("Supabase service role key is missing (SUPABASE_SERVICE_ROLE_KEY).");
  }

  return createClient(url, serviceKey, {
    auth: { persistSession: false },
    global: {
      headers: { "X-Client-Info": "vireoka-service" },
    },
  });
}
