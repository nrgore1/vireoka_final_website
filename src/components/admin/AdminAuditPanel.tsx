"use client";

import React, { useEffect, useState } from 'react';
import { supabaseBrowser } from '@/lib/supabase/browser';
import { adminListAuditEvents } from '@/lib/admin/adminApi';

export function AdminAuditPanel() {
  const [events, setEvents] = useState<any[]>([]);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    const supabase = supabaseBrowser();
    (async () => {
      try {
        const rows = await adminListAuditEvents(supabase, 200);
        setEvents(rows ?? []);
      } catch (e: any) {
        setErr(e?.message ?? 'Failed to load audit events');
      }
    })();
  }, []);

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
        Audit Events (latest)
      </div>

      <div style={{ maxHeight: 360, overflow: 'auto', fontSize: 12 }}>
        {events.map((e) => (
          <div
            key={e.id}
            style={{ borderTop: '1px solid #eee', padding: '6px 0' }}
          >
            <div>
              <b>{e.event_type}</b> •{' '}
              {new Date(e.created_at).toLocaleString()}
            </div>
            <div style={{ opacity: 0.85 }}>
              {e.user_id} • {e.entity_type ?? '-'} • {e.entity_id ?? '-'}
            </div>
          </div>
        ))}
        {events.length === 0 ? <div>No events.</div> : null}
      </div>
    </div>
  );
}
