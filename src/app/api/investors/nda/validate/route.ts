import { NextResponse } from 'next/server';
import { getServiceSupabase } from '@/lib/supabase/serverClients';
import { sha256 } from '@/lib/security/tokens';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const token = url.searchParams.get('token');

  if (!token) return NextResponse.json({ ok: false, error: 'Missing token' }, { status: 400 });

  const supabase = getServiceSupabase();
  const tokenHash = sha256(token);

  const { data: link, error } = await supabase
    .from('investor_nda_links')
    .select('id,application_id,expires_at,used_at')
    .eq('token_hash', tokenHash)
    .maybeSingle();

  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  if (!link) return NextResponse.json({ ok: false, error: 'Invalid link' }, { status: 404 });

  const expired = new Date(link.expires_at).getTime() < Date.now();
  if (expired) return NextResponse.json({ ok: false, error: 'Link expired' }, { status: 410 });
  if (link.used_at) return NextResponse.json({ ok: false, error: 'Link already used' }, { status: 409 });

  // You can return more app info if you want, but keep minimal.
  return NextResponse.json({ ok: true, application_id: link.application_id });
}
