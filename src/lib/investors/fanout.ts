import { pushToAirtable } from "@/lib/investors/airtable";
import { pushToHubSpotContact } from "@/lib/investors/hubspot";
import { leadToHtml, sendInvestorEmail } from "@/lib/investors/email";

export async function fanOutLead(lead: any) {
  const payload = {
    id: lead.id,
    kind: lead.kind,
    fullName: lead.full_name,
    email: lead.email,
    company: lead.company,
    title: lead.title,
    investorType: lead.investor_type,
    accredited: lead.accredited,
    website: lead.website,
    linkedin: lead.linkedin,
    organization: lead.organization,
    reason: lead.reason,
    message: lead.message,
    ip: lead.ip,
    userAgent: lead.user_agent,
    createdAt: lead.created_at,
  };

  const results: Record<string, any> = {};

  // Email
  try {
    const subject = `[Investor] ${payload.kind} - ${payload.fullName} (${payload.email})`;
    const html = leadToHtml("New Investor Submission", payload);
    results.email = await sendInvestorEmail(subject, html);
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
    const parts = String(payload.fullName || "").trim().split(/\s+/);
    const firstname = parts[0] || undefined;
    const lastname = parts.slice(1).join(" ") || undefined;

    results.hubspot = await pushToHubSpotContact({
      email: payload.email,
      firstname,
      lastname,
      company: payload.company || undefined,
      jobtitle: payload.title || undefined,
      website: payload.website || undefined,
      linkedin: payload.linkedin || undefined,
      investor_kind: payload.kind,
      investor_message: payload.message || payload.reason || undefined,
    });
  } catch (e: any) {
    results.hubspot = { error: String(e?.message || e) };
  }

  return results;
}
