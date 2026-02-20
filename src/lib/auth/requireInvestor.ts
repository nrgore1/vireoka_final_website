import { getServerSupabase } from "@/lib/supabase/serverClients";

export async function requireInvestor() {
  const supabase = getServerSupabase();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) return null;

  const { data } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", session.user.id)
    .eq("role", "investor")
    .single();

  return data ? session : null;
}
