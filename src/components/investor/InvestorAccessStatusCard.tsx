"use client";

import React, { useEffect, useState } from 'react';
import { supabaseBrowser } from '@/lib/supabase/browser';
import { getInvestorAccessStatus } from '@/lib/investor/rpc';

/**
 * Investor Access Status Card
 *
 * Renders ONLY contract-backed fields.
 * Does NOT assume application workflow fields.
 */
export function InvestorAccessStatusCard() {
  const [status, setStatus] = useState<any>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    const supabase = supabaseBrowser();
    (async () => {
      try {
        const s = await getInvestorAccessStatus(supabase);
        setStatus(s);
      } catch (e: any) {
        setErr(e?.message ?? 'Failed to load investor access status');
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

  if (!status) return null;

  const hasAccess =
    typeof status.has_access === 'boolean'
      ? status.has_access
      : typeof status.active === 'boolean'
      ? status.active
      : false;

  return (
    <div style={{ padding: 12, border: '1px solid #ddd', borderRadius: 8 }}>
      <div style={{ fontWeight: 700, marginBottom: 8 }}>
        Investor Portal Access
      </div>

      <div style={{ fontSize: 13 }}>
        <div>
          <b>Status:</b>{' '}
          {hasAccess ? 'ACTIVE' : 'INACTIVE'}
        </div>

        {status.expires_at ? (
          <div>
            <b>Expires:</b>{' '}
            {new Date(status.expires_at).toLocaleString()}
          </div>
        ) : (
          <div>
            <b>Expires:</b> —
          </div>
        )}
      </div>
    </div>
  );
}
