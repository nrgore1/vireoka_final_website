/**
 * CANONICAL SECURE DOCUMENT DOWNLOAD
 *
 * RULE:
 * - ALL sensitive investor documents MUST be downloaded via the Edge Function
 * - Signed URLs from Supabase Storage are NOT allowed for confidential docs
 *
 * This helper centralizes enforcement.
 */

export function downloadInvestorDocument(args: {
  bucket: string;
  path: string;
  docId?: string;
  jwt: string;
}) {
  const params = new URLSearchParams({
    bucket: args.bucket,
    path: args.path,
  });

  if (args.docId) {
    params.set('doc_id', args.docId);
  }

  const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/watermarked-download?${params.toString()}`;

  return fetch(url, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${args.jwt}`,
    },
  }).then((res) => {
    if (!res.ok) {
      throw new Error('Download blocked or failed');
    }
    return res.blob();
  });
}
