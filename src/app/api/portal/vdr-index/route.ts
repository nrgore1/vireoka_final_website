import { NextResponse } from "next/server";
import { supabaseServerClient } from "@/lib/supabase/serverClient";
import { supabaseServiceClient } from "@/lib/supabase/serviceClient";
import { normalizeTier, tierRank } from "@/lib/portal/tier";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function requiredRankFromTierRequired(v: any): number {
  const t = normalizeTier(v);
  return tierRank(t);
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const asTier = url.searchParams.get("asTier"); // admin-only preview

  // current user session
  const sb = await supabaseServerClient();
  const { data: userRes } = await sb.auth.getUser();
  const user = userRes?.user;

  if (!user) {
    return NextResponse.json({ ok: false, error: "Not authenticated" }, { status: 401 });
  }

  // Check if admin
  let isAdmin = false;
  try {
    const { data: prof } = await (sb as any)
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();
    isAdmin = String(prof?.role || "").toLowerCase() === "admin";
  } catch {}

  // Determine effective tier rank
  // - normal investors: read from investors table if exists, else default crowd
  // - admins can override with ?asTier=
  let effectiveRank = 10;

  if (isAdmin && asTier) {
    effectiveRank = tierRank(normalizeTier(asTier));
  } else {
    // best-effort: read tier_rank from investors
    try {
      const { data: inv } = await (sb as any)
        .from("investors")
        .select("tier_rank")
        .eq("user_id", user.id)
        .maybeSingle();
      if (inv?.tier_rank) effectiveRank = Number(inv.tier_rank);
    } catch {}
  }

  // Fetch ALL resources via service role (for FOMO list)
  const svc = supabaseServiceClient();
  const { data, error } = await (svc as any)
    .from("vdr_resources")
    .select("id,title,description,category,tier_required,kind,tags,updated_at,created_at")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  const items = (data || []).map((r: any) => {
    const reqRank = requiredRankFromTierRequired(r.tier_required);
    const locked = effectiveRank < reqRank;
    return {
      id: r.id,
      title: r.title,
      description: r.description,
      category: r.category,
      tier_required: r.tier_required,
      kind: r.kind,
      tags: r.tags || [],
      locked,
      required_rank: reqRank,
    };
  });

  return NextResponse.json({
    ok: true,
    is_admin: isAdmin,
    effective_rank: effectiveRank,
    items,
  });
}
