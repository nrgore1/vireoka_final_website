type PushResult = { ok: true; skipped?: boolean } | { ok: false; error: string };

function env(name: string) {
  return process.env[name];
}

/**
 * Safe HubSpot contact push adapter.
 * - If HUBSPOT_PRIVATE_APP_TOKEN is missing, it NO-OPs.
 */
export async function pushToHubSpotContact(payload: {
  email?: string;
  firstname?: string;
  lastname?: string;
  company?: string;
  [k: string]: any;
}): Promise<PushResult> {
  const token = env("HUBSPOT_PRIVATE_APP_TOKEN");
  if (!token) return { ok: true, skipped: true };

  try {
    const r = await fetch("https://api.hubapi.com/crm/v3/objects/contacts", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ properties: payload }),
    });

    if (r.status === 409) {
      // contact exists — treat as ok (don’t fail the pipeline)
      return { ok: true };
    }

    if (!r.ok) {
      const t = await r.text().catch(() => "");
      return { ok: false, error: `HubSpot push failed (${r.status}): ${t}` };
    }

    return { ok: true };
  } catch (e: any) {
    return { ok: false, error: e?.message || "HubSpot push error" };
  }
}
