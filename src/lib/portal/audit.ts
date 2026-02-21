import { supabaseServerClient } from "@/lib/supabase/serverClient";

export type PortalEventPayload = {
  event_type: string;
  entity_type?: string | null;
  entity_id?: string | null;
  meta?: any;
};

/**
 * Backwards-compatible server audit logger.
 * Existing pages call: logPortalEventServer({ event_type, entity_type, entity_id, meta? })
 *
 * Next.js 16 change: supabaseServerClient() is async, so we await it here.
 */
export async function logPortalEventServer(payload: PortalEventPayload) {
  const sb = await supabaseServerClient();

  const { data: userRes } = await sb.auth.getUser();
  const user = userRes?.user;
  if (!user) return;

  // Best-effort; do not break page rendering if logging fails.
  try {
    await sb.from("audit_log").insert({
      action: payload.event_type,
      resource: payload.entity_type ?? null,
      resource_id: payload.entity_id ?? null,
      meta: payload.meta ?? null,
      user_id: user.id,
      created_at: new Date().toISOString(),
    });
  } catch {
    // ignore
  }
}

/**
 * Optional alias in case other code imports `audit(...)`.
 * Keep it compatible by mapping to the same insert shape.
 */
export async function audit(args: {
  action: string;
  resource?: string | null;
  resource_id?: string | null;
  meta?: any;
}) {
  return logPortalEventServer({
    event_type: args.action,
    entity_type: args.resource ?? null,
    entity_id: args.resource_id ?? null,
    meta: args.meta ?? null,
  });
}
