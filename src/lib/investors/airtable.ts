import Airtable from "airtable";

type LeadPayload = Record<string, any>;

function airtableClient() {
  const apiKey = process.env.AIRTABLE_API_KEY;
  const baseId = process.env.AIRTABLE_BASE_ID;
  const tableName = process.env.AIRTABLE_TABLE_NAME || "Investor Leads";

  if (!apiKey || !baseId) return null;

  const base = new Airtable({ apiKey }).base(baseId);
  return base(tableName);
}

// Remove null/undefined fields because Airtable FieldSet types don't allow null
function compactFields(obj: Record<string, any>) {
  const out: Record<string, any> = {};
  for (const [k, v] of Object.entries(obj)) {
    if (v === null || v === undefined) continue;
    out[k] = v;
  }
  return out;
}

function toAirtableFields(payload: LeadPayload) {
  const fields: Record<string, any> = {
    "Lead ID": payload.id ?? payload.leadId ?? payload.referenceCode ?? payload.reference_code,
    Kind: payload.kind,
    "Full Name": payload.fullName ?? payload.full_name,
    Email: payload.email,
    Company: payload.company,
    Title: payload.title,
    "Investor Type": payload.investorType,
    // Only set Accredited if it's actually boolean (never null)
    Accredited: typeof payload.accredited === "boolean" ? payload.accredited : undefined,
    Website: payload.website,
    LinkedIn: payload.linkedin,
    Organization: payload.organization,
    Reason: payload.reason,
    Message: payload.message,
    IP: payload.ip,
    "User Agent": payload.userAgent ?? payload.user_agent,
  };

  return compactFields(fields);
}

export async function airtableCreateLead(payload: LeadPayload) {
  const table = airtableClient();
  if (!table) return { skipped: true as const };

  const fields = toAirtableFields(payload);

  // Airtable SDK typing is strict; this is the correct runtime shape.
  const record = await (table as any).create([{ fields }]);

  return { skipped: false as const, record };
}

// ✅ Backwards-compatible export for older fanout code
export async function pushToAirtable(payload: LeadPayload) {
  return airtableCreateLead(payload);
}
