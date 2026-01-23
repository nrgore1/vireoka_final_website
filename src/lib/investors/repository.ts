import "server-only";

import { supabaseAdmin } from "@/lib/supabase/admin";
import type { Investor, InvestorEvent } from "./types";

export function investorRepo() {
  const sb = supabaseAdmin();

  return {
    async getByEmail(email: string): Promise<Investor | null> {
      const { data, error } = await sb.from("investors").select("*").eq("email", email).maybeSingle();
      if (error) return null;
      return (data as any) ?? null;
    },

    async list(): Promise<Investor[]> {
      const { data } = await sb.from("investors").select("*").order("invited_at", { ascending: false });
      return (data as any) ?? [];
    },

    async upsertPending(email: string) {
      // creates or keeps pending; does not approve
      await sb.from("investors").upsert({ email, status: "pending" }, { onConflict: "email" });
    },

    async setStatus(email: string, status: string) {
      await sb.from("investors").update({ status }).eq("email", email);
    },

    async setLastAccess(email: string) {
      await sb.from("investors").update({ last_access: new Date().toISOString() }).eq("email", email);
    },

    async recordEvent(ev: InvestorEvent) {
      await sb.from("investor_events").insert({
        email: ev.email,
        type: ev.type,
        path: ev.path ?? null,
        meta: ev.meta ?? null,
      });
    },

    async listEvents(limit = 500): Promise<InvestorEvent[]> {
      const { data } = await sb
        .from("investor_events")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(limit);
      return (data as any) ?? [];
    },
  };
}
