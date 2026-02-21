import { redirect } from "next/navigation";
import { supabaseServerClient } from "@/lib/supabase/serverClient";

export default async function Page() {
  const sb = await supabaseServerClient();

  const { data: userRes } = await sb.auth.getUser();
  const user = userRes?.user;

  if (!user) {
    redirect("/portal/login");
  }

  return (
    <div>
      <h1>Activity</h1>
      <p>Signed in as: {user.email ?? user.id}</p>
    </div>
  );
}
