import { supabaseServer } from "@/lib/supabase/server";

export async function requireAdmin(req?: Request) {
  const supabase = await supabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) return false;

  const { data, error } = await supabase
    .from("investors")
    .select("role")
    .eq("email", user.email)
    .single();

  if (error) return false;

  return data?.role === "admin";
}
