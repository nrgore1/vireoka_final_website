import { supabaseServer } from "@/lib/supabase/server";
import { createClient } from "@supabase/supabase-js";

// Backward-compatible exports for older code paths.
// - getServerSupabase(): session-aware (SSR) using anon key
// - getAnonSupabase(): plain anon client (server-side), no session
// - getServiceSupabase(): service role client for inserts/admin operations

export async function getServerSupabase() {
  return supabaseServer();
}

export function getAnonSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  return createClient(url, anon, { auth: { persistSession: false } });
}

export function getServiceSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  return createClient(url, key, { auth: { persistSession: false } });
}

// Extra aliases some older code may reference
export const getServerSupabaseClient = getServerSupabase;
