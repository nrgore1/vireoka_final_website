function requireEnv(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env var: ${name}`);
  return v;
}

/**
 * Create a SignWell document from a template for embedded signing.
 * Uses env vars:
 *  - SIGNWELL_API_KEY
 *  - SIGNWELL_TEMPLATE_ID
 *
 * Webhooks not required for this flow.
 */
export async function signwellCreateDocumentFromTemplate(args: {
  signerName: string;
  signerEmail: string;
  redirectUrl: string;
  metadata?: Record<string, any>;
}) {
  const apiKey = requireEnv("SIGNWELL_API_KEY");
  const templateId = requireEnv("SIGNWELL_TEMPLATE_ID");

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
      recipients: [
        {
          name: args.signerName,
          email: args.signerEmail,
          role: "signer",
        },
      ],
      metadata: args.metadata ?? {},
    }),
  });

  const j = await r.json().catch(() => null);

  if (!r.ok || !j) {
    const detail = typeof j === "object" ? JSON.stringify(j) : "";
    throw new Error(`SignWell create doc failed (${r.status}) ${detail}`);
  }

  const iframeUrl =
    j?.embedded_signing_url ||
    j?.embedded_signing?.url ||
    j?.signing_url ||
    null;

  const documentId =
    j?.id ||
    j?.document?.id ||
    j?.document_id ||
    null;

  return { iframeUrl, documentId, raw: j };
}
