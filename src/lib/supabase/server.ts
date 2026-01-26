import { createClient, SupabaseClient } from '@supabase/supabase-js';

/**
 * Server-side Supabase client (service role).
 *
 * CANONICAL:
 *   - supabaseServerAdmin()
 *
 * BACKWARD-COMPAT:
 *   - supabaseServer()  ← alias for legacy imports
 *
 * IMPORTANT:
 * - SUPABASE_SERVICE_ROLE_KEY must NEVER be exposed to the browser
 * - This file is safe to import from server components / API routes only
 */

let _admin: SupabaseClient | null = null;

function createAdminClient(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    throw new Error(
      'Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY'
    );
  }

  return createClient(url, serviceKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

/**
 * Canonical admin client
 */
export function supabaseServerAdmin(): SupabaseClient {
  if (!_admin) {
    _admin = createAdminClient();
  }
  return _admin;
}

/**
 * Legacy alias (DO NOT REMOVE)
 * Used by older files such as Watermark.tsx
 */
export const supabaseServer = supabaseServerAdmin;
