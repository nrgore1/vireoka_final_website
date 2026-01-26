import { SupabaseClient } from '@supabase/supabase-js';

/**
 * Sends NDA invitation email via Edge Function.
 * This is called after an application is approved.
 */
export async function sendNdaInvitationEmail(
  supabase: SupabaseClient,
  args: { email: string; reference_code: string }
) {
  const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/send-nda-invitation`;

  // Use current session token if available (preferred)
  const { data } = await supabase.auth.getSession();
  const accessToken = data.session?.access_token;

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    },
    body: JSON.stringify(args),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`send-nda-invitation failed: ${res.status} ${text}`);
  }
}
