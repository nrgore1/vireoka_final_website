import HubspotClient from "@hubspot/api-client";

type LeadPayload = Record<string, any>;

function hubspotClient() {
  const token = process.env.HUBSPOT_ACCESS_TOKEN;
  if (!token) return null;

  // This matches the SDK shape in your install:
  // HubspotClient is a module with a Client class.
  return new (HubspotClient as any).Client({ accessToken: token });
}

export async function pushToHubSpotContact(payload: LeadPayload) {
  const hubspot = hubspotClient();
  if (!hubspot) return { skipped: true as const };

  const email = String(payload.email || "").trim();
  if (!email) return { skipped: true as const, error: "Missing email" };

  const fullName = String(payload.fullName || payload.full_name || "").trim();
  const company = String(payload.company || "").trim();
  const message = String(payload.message || "").trim();
  const kind = String(payload.kind || "").trim() || "UNKNOWN";

  // Search existing by email
  const search = await hubspot.crm.contacts.searchApi.doSearch({
    filterGroups: [
      {
        filters: [
          {
            propertyName: "email",
            operator: "EQ" as any, // avoid enum typing differences across SDK versions
            value: email,
          },
        ],
      },
    ],
    properties: ["email"],
    limit: 1,
  });

  const existing = search?.results?.[0];

  const props: Record<string, string> = {
    email,
    investor_kind: kind,
  };

  if (fullName) {
    const parts = fullName.split(" ").filter(Boolean);
    props.firstname = parts[0] || fullName;
    props.lastname = parts.slice(1).join(" ") || " ";
  }
  if (company) props.company = company;
  if (message) props.investor_message = message;

  if (existing?.id) {
    const updated = await hubspot.crm.contacts.basicApi.update(existing.id, {
      properties: props,
    });
    return { skipped: false as const, updated };
  }

  const created = await hubspot.crm.contacts.basicApi.create({
    properties: props,
  });

  return { skipped: false as const, created };
}
