import { redirect } from "next/navigation";
import { supabaseServerClient } from "@/lib/supabase/serverClient";

export default async function Page() {
  const sb = await supabaseServerClient();

  const { data: userRes } = await sb.auth.getUser();

  const email = String(userRes?.user?.email || "").toLowerCase();

  if (!userRes?.user) {
    redirect("/portal/login");
  }

  return (
    <div>
      <h1>Overview</h1>
      <p>Signed in as: {email || userRes.user.id}</p>
    </div>
  );
}
