import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function requireEnv(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env var: ${name}`);
  return v;
}

function extractRecipients(template: any) {
  const candidates: any[] = [];

  if (Array.isArray(template?.recipients)) candidates.push(...template.recipients);
  if (Array.isArray(template?.template_recipients)) candidates.push(...template.template_recipients);
  if (Array.isArray(template?.placeholders)) candidates.push(...template.placeholders);

  if (template?.document_template) {
    if (Array.isArray(template.document_template?.recipients)) candidates.push(...template.document_template.recipients);
    if (Array.isArray(template.document_template?.template_recipients))
      candidates.push(...template.document_template.template_recipients);
    if (Array.isArray(template.document_template?.placeholders)) candidates.push(...template.document_template.placeholders);
  }

  const out = candidates
    .filter((it) => it && typeof it === "object")
    .map((it) => ({
      id: it.id ? String(it.id) : null,
      placeholder_name: it.placeholder_name ? String(it.placeholder_name) : (it.name ? String(it.name) : null),
      role: it.role ? String(it.role) : null,
      name: it.name ? String(it.name) : null,
      raw_keys: Object.keys(it || {}),
    }));

  // de-dupe
  const seen = new Set<string>();
  return out.filter((r) => {
    const k = `${r.id || ""}::${(r.placeholder_name || "").toLowerCase()}::${(r.role || "").toLowerCase()}`;
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
}

export async function GET() {
  // dev-only guard
  if (process.env.NODE_ENV === "production") {
    return new NextResponse("Not Found", { status: 404 });
  }

  try {
    const apiKey = requireEnv("SIGNWELL_API_KEY");
    const templateId = requireEnv("SIGNWELL_TEMPLATE_ID");

    const r = await fetch(`https://www.signwell.com/api/v1/document_templates/${templateId}/`, {
      method: "GET",
      headers: { accept: "application/json", "X-Api-Key": apiKey },
    });

    const text = await r.text();
    let j: any = null;
    try {
      j = JSON.parse(text);
    } catch {
      j = { raw: text };
    }

    if (!r.ok) {
      return NextResponse.json(
        {
          ok: false,
          error: `SignWell template fetch failed (${r.status})`,
          detail: j,
        },
        { status: 502 }
      );
    }

    const recipients = extractRecipients(j);

    return NextResponse.json({
      ok: true,
      template_id: templateId,
      found: recipients.length,
      recipients,
      top_level_keys: Object.keys(j || {}),
    });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || "Server error" }, { status: 500 });
  }
}
