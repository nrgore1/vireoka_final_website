"use client";

import React, { useEffect, useState } from 'react';
import { supabaseBrowser } from '@/lib/supabase/browser';

type Row = {
  grant_id: string;
  user_id: string;
  expires_at: string;
  starts_at: string;
  scope: string;
  revoked_at: string | null;
};

export function AdminExpiringAccessPanel({ days = 7 }: { days?: number }) {
  const [rows, setRows] = useState<Row[]>([]);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    const supabase = supabaseBrowser();
    (async () => {
      try {
        const { data, error } = await supabase.rpc('admin_list_expiring_access', {
          p_days: days,
          p_limit: 200,
        });
        if (error) throw error;
        setRows((data ?? []) as Row[]);
      } catch (e: any) {
        setErr(e?.message ?? 'Failed to load expiring access');
      }
    })();
  }, [days]);

  if (err) {
    return (
      <div style={{ padding: 12, border: '1px solid #ddd', borderRadius: 8 }}>
        Error: {err}
      </div>
    );
  }

  return (
    <div style={{ padding: 12, border: '1px solid #ddd', borderRadius: 8 }}>
      <div style={{ fontWeight: 700, marginBottom: 8 }}>
        Expiring Access (next {days} days)
      </div>

      <div style={{ maxHeight: 360, overflow: 'auto', fontSize: 12 }}>
        {rows.map((r) => (
          <div
            key={r.grant_id}
            style={{ borderTop: '1px solid #eee', padding: '8px 0' }}
          >
            <div>
              <b>Expires:</b>{' '}
              {new Date(r.expires_at).toLocaleString()}
            </div>
            <div style={{ opacity: 0.85 }}>
              user_id: {r.user_id} • scope: {r.scope} • grant_id:{' '}
              {r.grant_id}
            </div>
          </div>
        ))}
        {rows.length === 0 ? <div>No expiring grants.</div> : null}
      </div>
    </div>
  );
}
