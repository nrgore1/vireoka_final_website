import { supabaseServer } from "@/lib/supabase/server";

export async function getUser() {
  const supabase = await supabaseServer();
  const { data } = await supabase.auth.getUser();
  return data?.user ?? null;
}
