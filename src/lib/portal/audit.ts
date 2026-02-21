import { supabaseServerClient } from "@/lib/supabase/serverClient";

export type PortalEventPayload = {
  event_type: string;
  entity_type?: string | null;
  entity_id?: string | null;

  // support both keys
  metadata?: any;
  meta?: any;
};

export async function logPortalEventServer(payload: PortalEventPayload) {
  const sb = await supabaseServerClient();

  const { data: userRes } = await sb.auth.getUser();
  const user = userRes?.user;
  if (!user) return;

  const meta = payload.metadata ?? payload.meta ?? null;

  try {
    await sb.from("audit_log").insert({
      action: payload.event_type,
      resource: payload.entity_type ?? null,
      resource_id: payload.entity_id ?? null,
      meta,
      user_id: user.id,
      created_at: new Date().toISOString(),
    });
  } catch {
    // best-effort
  }
}
