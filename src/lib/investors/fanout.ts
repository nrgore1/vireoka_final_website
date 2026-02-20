import { pushToAirtable } from "@/lib/investors/airtable";
import { pushToHubSpotContact } from "@/lib/investors/hubspot";
import { leadToHtml, sendInvestorEmail } from "@/lib/investors/email";

type LeadPayload = Record<string, any>;

export async function fanoutInvestorLead(payload: LeadPayload) {
  const results: Record<string, any> = {};

  // Email (internal notify)
  try {
    const subject = `[Investor] ${payload.kind} - ${payload.fullName || payload.full_name} (${payload.email})`;
    const html = leadToHtml(payload);

    // send to internal notify email if configured; otherwise skip
    const to = process.env.INVESTOR_NOTIFY_EMAIL || "";
    if (!to) {
      results.email = { skipped: true, error: "Missing INVESTOR_NOTIFY_EMAIL" };
    } else {
      results.email = await sendInvestorEmail({ to, subject, html });
    }
  } catch (e: any) {
    results.email = { error: String(e?.message || e) };
  }

  // Airtable
  try {
    results.airtable = await pushToAirtable(payload);
  } catch (e: any) {
    results.airtable = { error: String(e?.message || e) };
  }

  // HubSpot
  try {
    results.hubspot = await pushToHubSpotContact(payload);
  } catch (e: any) {
    results.hubspot = { error: String(e?.message || e) };
  }

  return results;
}
