import { supabaseServerClient } from "@/lib/supabase/serverClient";
import { tierLabel } from "@/lib/portal/tier";
import { VdrCard } from "@/components/portal/VdrCard";

export const dynamic = "force-dynamic";

type SP = Record<string, string | string[] | undefined>;

async function fetchIndex(cookieHeader: string, asTier?: string) {
  const qs = asTier ? `?asTier=${encodeURIComponent(asTier)}` : "";

  // Use relative fetch on server; Next will include host automatically.
  const r = await fetch(`/api/portal/vdr-index${qs}`, {
    headers: cookieHeader ? { cookie: cookieHeader } : {},
    cache: "no-store",
  }).catch(() => null);

  if (!r) return null;
  return r.json().catch(() => null);
}

export default async function Page(props: { searchParams?: Promise<SP> }) {
  const sb = await supabaseServerClient();

  // Next 16: searchParams is a Promise
  const sp = (props.searchParams ? await props.searchParams : {}) as SP;

  const asTierRaw = sp?.asTier;
  const asTier =
    typeof asTierRaw === "string"
      ? asTierRaw
      : Array.isArray(asTierRaw)
      ? asTierRaw[0]
      : undefined;

  // Pass cookies through to the API route
  const cookieHeader =
    (sb as any)?.headers?.get?.("cookie") ||
    (sb as any)?.cookies?.toString?.() ||
    "";

  const data = await fetchIndex(cookieHeader, asTier);

  const items = data?.items || [];
  const rank = Number(data?.effective_rank || 10);

  return (
    <main className="max-w-6xl mx-auto px-4 py-10 space-y-6">
      <div className="space-y-2">
        <div className="text-xs tracking-wide uppercase text-neutral-500 font-semibold">
          Virtual Data Room
        </div>
        <h1 className="text-3xl font-semibold">Diligence Materials</h1>
        <p className="text-neutral-700 max-w-3xl">
          All items are confidential, time-bound, watermarked, and logged. Some materials are visible but
          locked depending on your access tier.
        </p>

        <div className="text-sm text-neutral-600">
          Current tier: <span className="font-semibold">{tierLabel(rank)}</span>
          {data?.is_admin && asTier ? (
            <span className="ml-2 rounded-md border px-2 py-1 text-xs bg-neutral-50">
              Admin preview mode: {asTier}
            </span>
          ) : null}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {items.map((it: any) => (
          <VdrCard
            key={it.id}
            id={it.id}
            title={it.title}
            description={it.description}
            category={it.category}
            kind={it.kind}
            locked={!!it.locked}
          />
        ))}
      </div>
    </main>
  );
}
