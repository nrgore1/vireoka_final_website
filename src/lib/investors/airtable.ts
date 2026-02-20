import Airtable from "airtable";

function canPush() {
  return Boolean(
    process.env.AIRTABLE_API_KEY &&
      process.env.AIRTABLE_BASE_ID &&
      process.env.AIRTABLE_TABLE_NAME
  );
}

function toAirtableFields(payload: Record<string, any>) {
  // These MUST match your Airtable column names exactly.
  return {
    "Lead ID": payload.id ?? "",
    "Kind": payload.kind ?? "",
    "Full Name": payload.fullName ?? "",
    "Email": payload.email ?? "",
    "Company": payload.company ?? "",
    "Title": payload.title ?? "",
    "Investor Type": payload.investorType ?? "",
    "Accredited": typeof payload.accredited === "boolean" ? payload.accredited : null,
    "Website": payload.website ?? "",
    "LinkedIn": payload.linkedin ?? "",
    "Organization": payload.organization ?? "",
    "Reason": payload.reason ?? "",
    "Message": payload.message ?? "",
    "IP": payload.ip ?? "",
    "User Agent": payload.userAgent ?? "",
  };
}

export async function pushToAirtable(payload: Record<string, any>) {
  if (!canPush()) return { skipped: true as const };

  Airtable.configure({ apiKey: process.env.AIRTABLE_API_KEY! }); // PAT token goes here

  const base = Airtable.base(process.env.AIRTABLE_BASE_ID!);
  const table = base(process.env.AIRTABLE_TABLE_NAME!);

  const fields = toAirtableFields(payload);
  const record = await table.create([{ fields }]);

  return { skipped: false as const, record };
}
