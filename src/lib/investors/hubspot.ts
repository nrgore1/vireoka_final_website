import HubSpot from "@hubspot/api-client";

function canPush() {
  return Boolean(process.env.HUBSPOT_ACCESS_TOKEN);
}

export async function pushToHubSpotContact(fields: {
  email: string;
  firstname?: string;
  lastname?: string;
  company?: string;
  jobtitle?: string;
  website?: string;
  linkedin?: string;
  investor_kind?: string;
  investor_message?: string;
}) {
  if (!canPush()) return { skipped: true as const };

  const hubspot = new HubSpot.Client({ accessToken: process.env.HUBSPOT_ACCESS_TOKEN! });

  const email = fields.email;

  const search = await hubspot.crm.contacts.searchApi.doSearch({
    filterGroups: [
      { filters: [{ propertyName: "email", operator: "EQ", value: email }] },
    ],
    properties: ["email"],
    limit: 1,
  });

  const properties: Record<string, string> = {};
  for (const [k, v] of Object.entries(fields)) {
    if (v === undefined || v === null) continue;
    properties[k] = String(v);
  }

  if (search.results?.length) {
    const id = search.results[0].id;
    const updated = await hubspot.crm.contacts.basicApi.update(id, { properties });
    return { skipped: false as const, updated };
  }

  const created = await hubspot.crm.contacts.basicApi.create({ properties });
  return { skipped: false as const, created };
}
