import { supabaseServer } from "@/lib/supabase/server";

export async function getLatestApprovedCommId() {
  const supabase = await supabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) return null;

  const { data } = await supabase
    .from("investor_comms")
    .select("id")
    .eq("email", user.email)
    .eq("type", "approved")
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  return data?.id || null;
}
