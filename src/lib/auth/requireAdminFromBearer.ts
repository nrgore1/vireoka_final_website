import { getAnonSupabase, getServiceSupabase } from '@/lib/supabase/serverClients';

export async function requireAdminFromBearer(req: Request) {
  const auth = req.headers.get('authorization') || '';
  const token = auth.startsWith('Bearer ') ? auth.slice('Bearer '.length) : null;
  if (!token) return { ok: false as const, status: 401, error: 'Missing Authorization bearer token' };

  const anon = getAnonSupabase();
  const { data: userData, error: userErr } = await anon.auth.getUser(token);
  if (userErr || !userData?.user) {
    return { ok: false as const, status: 401, error: 'Invalid or expired session' };
  }

  const userId = userData.user.id;

  const svc = getServiceSupabase();
  const { data: roleRow, error: roleErr } = await svc
    .from('user_roles')
    .select('role')
    .eq('user_id', userId)
    .in('role', ['admin', 'investor_admin'])
    .limit(1)
    .maybeSingle();

  if (roleErr) {
    return { ok: false as const, status: 500, error: roleErr.message };
  }

  if (!roleRow) {
    return { ok: false as const, status: 403, error: 'Forbidden' };
  }

  return { ok: true as const, userId, role: roleRow.role };
}
