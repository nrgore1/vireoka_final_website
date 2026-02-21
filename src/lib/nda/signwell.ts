type SignWellCreateDocArgs = {
  templateId: string;
  signerEmail: string;
  signerName: string;
  // Optional: if you want the signer redirected after signing
  redirectUrl?: string;
  // Optional: for audit/logging
  metadata?: Record<string, any>;
};

type SignWellDoc = {
  id: string;
  status?: string;
  recipients?: Array<{ email?: string; name?: string; status?: string }>;
  completed_pdf_url?: string;
};

function apiKey() {
  const key = process.env.SIGNWELL_API_KEY;
  if (!key) throw new Error("SIGNWELL_API_KEY is not set");
  return key;
}

async function signwellFetch(path: string, init?: RequestInit) {
  const url = `https://www.signwell.com/api/v1${path}`;
  const res = await fetch(url, {
    ...init,
    headers: {
      "accept": "application/json",
      "content-type": "application/json",
      "X-Api-Key": apiKey(),
      ...(init?.headers || {}),
    },
  });

  const text = await res.text().catch(() => "");
  const json = text ? JSON.parse(text) : null;

  if (!res.ok) {
    const msg = json?.error || json?.message || text || `SignWell error (${res.status})`;
    throw new Error(msg);
  }

  return json;
}

// Create + send a document from a template
// Endpoint: POST /document_templates/documents/ :contentReference[oaicite:2]{index=2}
export async function createNdaFromTemplate(args: SignWellCreateDocArgs) {
  const payload: any = {
    template_id: args.templateId,
    name: "Vireoka Mutual NDA",
    subject: "Please sign the Vireoka NDA",
    message: "Please review and sign the NDA to unlock investor portal access.",
    // Most SignWell flows auto-send unless draft=true; we want send.
    draft: false,
    recipients: [
      {
        email: args.signerEmail,
        name: args.signerName || args.signerEmail,
        role: "signer",
      },
    ],
    metadata: args.metadata || {},
  };

  // Optional redirect after signing (if supported by your template)
  if (args.redirectUrl) payload.redirect_url = args.redirectUrl;

  const doc = await signwellFetch("/document_templates/documents/", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  return doc as { id: string; status?: string; signing_url?: string; embed_url?: string };
}

export async function getDocument(documentId: string) {
  const doc = await signwellFetch(`/documents/${encodeURIComponent(documentId)}/`, { method: "GET" });
  return doc as SignWellDoc;
}
