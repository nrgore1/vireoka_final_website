import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));

    const {
      event_type,
      entity_type = null,
      entity_id = null,
      metadata = {},
    } = body ?? {};

    // event_type is the only required field
    if (!event_type || typeof event_type !== 'string') {
      return NextResponse.json(
        { ok: false, error: 'event_type required' },
        { status: 200 } // <-- DO NOT break UX flows
      );
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY! // server-only
    );

    const authHeader = req.headers.get('authorization');
    let userId: string | null = null;

    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.replace('Bearer ', '');
      const { data } = await supabase.auth.getUser(token);
      userId = data?.user?.id ?? null;
    }

    await supabase.from('portal_audit_events').insert({
      user_id: userId,
      event_type,
      entity_type,
      entity_id,
      metadata,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[investors/event]', err);

    // Observability must never break UX
    return NextResponse.json({ ok: false }, { status: 200 });
  }
}
