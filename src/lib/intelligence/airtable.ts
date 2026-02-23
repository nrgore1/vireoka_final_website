type PushResult = { ok: true; skipped?: boolean } | { ok: false; error: string };

function env(name: string) {
  return process.env[name];
}

/**
 * Safe Airtable push adapter.
 * - If Airtable env vars are not configured, it NO-OPs (ok: true, skipped: true)
 * - This prevents build/runtime failures while keeping the integration optional.
 */
export async function pushToAirtable(payload: Record<string, any>): Promise<PushResult> {
  const apiKey = env("AIRTABLE_API_KEY");
  const baseId = env("AIRTABLE_BASE_ID");
  const table = env("AIRTABLE_TABLE_NAME");

  if (!apiKey || !baseId || !table) {
    return { ok: true, skipped: true };
  }

  try {
    const url = `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(table)}`;
    const r = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ records: [{ fields: payload }] }),
    });

    if (!r.ok) {
      const t = await r.text().catch(() => "");
      return { ok: false, error: `Airtable push failed (${r.status}): ${t}` };
    }

    return { ok: true };
  } catch (e: any) {
    return { ok: false, error: e?.message || "Airtable push error" };
  }
}
