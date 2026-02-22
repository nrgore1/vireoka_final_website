function requireEnv(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env var: ${name}`);
  return v;
}

type TemplateRecipient = {
  id?: string;
  placeholder_name?: string;
  role?: string;
  name?: string;
};

async function signwellFetchJson(url: string, apiKey: string) {
  const r = await fetch(url, {
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
    const msg = j?.error || j?.message || j?.detail || `SignWell API error (${r.status})`;
    throw new Error(`${msg} :: ${typeof j === "object" ? JSON.stringify(j) : String(text)}`);
  }

  return j;
}

function extractTemplateRecipients(template: any): TemplateRecipient[] {
  const candidates: any[] = [];

  // Your diagnostics shows "placeholders" exists at top-level.
  if (Array.isArray(template?.placeholders)) candidates.push(...template.placeholders);

  // Fallback keys just in case
  if (Array.isArray(template?.recipients)) candidates.push(...template.recipients);
  if (Array.isArray(template?.template_recipients)) candidates.push(...template.template_recipients);

  if (template?.document_template) {
    if (Array.isArray(template.document_template?.placeholders)) candidates.push(...template.document_template.placeholders);
    if (Array.isArray(template.document_template?.recipients)) candidates.push(...template.document_template.recipients);
    if (Array.isArray(template.document_template?.template_recipients))
      candidates.push(...template.document_template.template_recipients);
  }

  const out: TemplateRecipient[] = [];
  for (const it of candidates) {
    if (!it || typeof it !== "object") continue;
    out.push({
      id: it.id ? String(it.id) : undefined,
      placeholder_name: it.name ? String(it.name) : (it.placeholder_name ? String(it.placeholder_name) : undefined),
      role: it.role ? String(it.role) : undefined,
      name: it.name ? String(it.name) : undefined,
    });
  }

  const seen = new Set<string>();
  return out.filter((r) => {
    const k = `${r.id || ""}::${(r.placeholder_name || "").toLowerCase()}::${(r.role || "").toLowerCase()}`;
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
}

function pickByPlaceholder(recipients: TemplateRecipient[], name: string) {
  const needle = name.toLowerCase();
  return recipients.find((r) => String(r.placeholder_name || "").toLowerCase() === needle);
}

function extractEmbeddedSigningUrl(j: any): string | null {
  // Common top-level keys
  const direct =
    j?.embedded_signing_url ||
    j?.embedded_signing?.url ||
    j?.embedded_signing?.signing_url ||
    j?.signing_url ||
    j?.sign_url ||
    null;

  if (direct) return String(direct);

  // Sometimes per-recipient
  const recips = j?.recipients || j?.document?.recipients || j?.data?.recipients;
  if (Array.isArray(recips)) {
    for (const r of recips) {
      const u =
        r?.embedded_signing_url ||
        r?.embedded_signing?.url ||
        r?.embedded_signing?.signing_url ||
        r?.signing_url ||
        r?.sign_url ||
        null;
      if (u) return String(u);
    }
  }

  // Sometimes nested under "embedded"
  const embedded = j?.embedded;
  if (embedded?.signing_url) return String(embedded.signing_url);
  if (embedded?.url) return String(embedded.url);

  return null;
}

/**
 * Create a SignWell document from a template for embedded signing.
 *
 * Required env:
 *  - SIGNWELL_API_KEY
 *  - SIGNWELL_TEMPLATE_ID
 *
 * Recommended env (because your template has "Document Sender"):
 *  - SIGNWELL_SENDER_NAME
 *  - SIGNWELL_SENDER_EMAIL
 */
export async function signwellCreateDocumentFromTemplate(args: {
  signerName: string;
  signerEmail: string;
  redirectUrl: string;
  metadata?: Record<string, any>;
}) {
  const apiKey = requireEnv("SIGNWELL_API_KEY");
  const templateId = requireEnv("SIGNWELL_TEMPLATE_ID");

  const template = await signwellFetchJson(
    `https://www.signwell.com/api/v1/document_templates/${templateId}/`,
    apiKey
  );

  const placeholders = extractTemplateRecipients(template);

  const sender = pickByPlaceholder(placeholders, "document sender");
  const receiving = pickByPlaceholder(placeholders, "receiving party");

  if (!sender?.id || !receiving?.id) {
    throw new Error(
      `Template placeholders missing required IDs. Found: ${placeholders
        .map((p) => `${p.id || "no-id"}:${p.placeholder_name || "?"}`)
        .join(", ")}`
    );
  }

  const senderName = process.env.SIGNWELL_SENDER_NAME || "Vireoka";
  const senderEmail = process.env.SIGNWELL_SENDER_EMAIL || args.signerEmail;

  const recipientsPayload = [
    { id: sender.id, name: senderName, email: senderEmail, placeholder_name: "Document Sender" },
    { id: receiving.id, name: args.signerName, email: args.signerEmail, placeholder_name: "Receiving Party" },
  ];

  const r = await fetch("https://www.signwell.com/api/v1/document_templates/documents/", {
    method: "POST",
    headers: {
      accept: "application/json",
      "content-type": "application/json",
      "X-Api-Key": apiKey,
    },
    body: JSON.stringify({
      template_id: templateId,
      embedded_signing: true,
      redirect_url: args.redirectUrl,
      recipients: recipientsPayload,
      metadata: args.metadata ?? {},
    }),
  });

  const text = await r.text();
  let j: any = null;
  try {
    j = JSON.parse(text);
  } catch {
    j = { raw: text };
  }

  if (!r.ok) {
    const msg = j?.error || j?.message || j?.detail || `SignWell create doc failed (${r.status})`;
    throw new Error(`${msg} ${typeof j === "object" ? JSON.stringify(j) : String(text)}`);
  }

  const iframeUrl = extractEmbeddedSigningUrl(j);

  const documentId =
    j?.id ||
    j?.document?.id ||
    j?.document_id ||
    null;

  return { iframeUrl, documentId, raw: j };
}
