import { createClient, SupabaseClient } from '@supabase/supabase-js';

let browserClient: SupabaseClient | null = null;

export function supabaseBrowser(): SupabaseClient {
  if (!browserClient) {
    browserClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    if (process.env.NODE_ENV === 'development') {
      console.log('[Supabase Browser Init]', {
        url: process.env.NEXT_PUBLIC_SUPABASE_URL,
        anonPresent: Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
      });
    }
  }

  return browserClient;
}
