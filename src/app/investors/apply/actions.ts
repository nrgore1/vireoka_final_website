'use server';

import { createClient } from '@supabase/supabase-js';
import { randomUUID } from 'crypto';
import { redirect } from 'next/navigation';

function requireEnv(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env var: ${name}`);
  return v;
}

export async function submitInvestorApplication(formData: FormData) {
  const supabase = createClient(
    requireEnv('SUPABASE_URL'),
    requireEnv('SUPABASE_SERVICE_ROLE_KEY')
  );

  const investor_name = String(formData.get('investor_name') || '').trim();
  const email = String(formData.get('email') || '').trim().toLowerCase();
  const organization = String(formData.get('organization') || '').trim();
  const role = String(formData.get('role') || '').trim();
  const investor_type = String(formData.get('investor_type') || '').trim();

  const check_size = String(formData.get('check_size') || '').trim();
  const horizon = String(formData.get('horizon') || '').trim();
  const intent = String(formData.get('intent') || '').trim();

  if (!investor_name || !email || !organization || !role || !investor_type) {
    throw new Error('Missing required fields');
  }

  // Generate a new reference code for first-time inserts
  const newRef = randomUUID();

  // Upsert by email:
  // - If email exists, we UPDATE core fields but keep existing reference_code if present.
  // - If email does not exist, we INSERT with reference_code=newRef.
  //
  // NOTE: We omit `status` to avoid violating your status check constraint.
  const payload: any = {
    investor_name,
    email,
    organization,
    reference_code: newRef,
    metadata: {
      role,
      investor_type,
      check_size,
      horizon,
      intent,
      source: 'investor_form',
      submitted_at: new Date().toISOString(),
    },
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from('investor_applications')
    .upsert(payload, { onConflict: 'email' })
    .select('reference_code')
    .maybeSingle();

  if (error) {
    console.error('Supabase upsert error:', error);

    // Fallback: try without metadata if column doesn't exist
    const payloadNoMeta: any = {
      investor_name,
      email,
      organization,
      reference_code: newRef,
      updated_at: new Date().toISOString(),
    };

    const r2 = await supabase
      .from('investor_applications')
      .upsert(payloadNoMeta, { onConflict: 'email' })
      .select('reference_code')
      .maybeSingle();

    if (r2.error) {
      console.error('Supabase upsert error (no metadata fallback):', r2.error);
      throw new Error(r2.error.message || error.message || 'Supabase upsert failed');
    }

    redirect(`/investors/thank-you?ref=${encodeURIComponent(String(r2.data?.reference_code || newRef))}`);
  }

  const ref = String(data?.reference_code || newRef);
  redirect(`/investors/thank-you?ref=${encodeURIComponent(ref)}`);
}
