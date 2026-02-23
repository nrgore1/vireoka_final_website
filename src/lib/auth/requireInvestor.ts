import { redirect } from "next/navigation";
import { supabaseServer } from "@/lib/supabase/server";

export async function requireInvestor() {
  const supabase = await supabaseServer();
  const { data } = await supabase.auth.getUser();
  if (!data?.user) redirect("/intelligence");
  return data.user;
}
