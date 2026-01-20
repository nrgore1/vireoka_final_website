import { serve } from "https://deno.land/std/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js";

serve(async () => {
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  const now = new Date().toISOString();

  const { data } = await supabase
    .from("investors")
    .select("email")
    .eq("status", "APPROVED")
    .lt("expires_at", now);

  if (!data?.length) {
    return new Response("No expired investors");
  }

  for (const inv of data) {
    await supabase
      .from("investors")
      .update({ status: "EXPIRED" })
      .eq("email", inv.email);

    await supabase.from("investor_audit").insert({
      email: inv.email,
      action: "EXPIRED",
      meta: { source: "cron" },
    });
  }

  return new Response(`Expired ${data.length} investors`);
});
