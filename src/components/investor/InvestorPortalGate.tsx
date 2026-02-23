"use client";

import React, { useEffect, useState } from 'react';
import { supabaseBrowser } from '@/lib/supabase/browser';
import { hasActiveInvestorAccess, logPortalEvent } from '@/lib/investor/rpc';

/**
 * Canonical Investor Portal Gate
 *
 * - Client component (uses hooks)
 * - Enforces active investor access via hasActiveInvestorAccess()
 * - Logs PORTAL_ENTRY on success
 * - RLS remains the final authority
 */
export function InvestorPortalGate({
  children,
  fallback,
}: {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  const [allowed, setAllowed] = useState<boolean | null>(null);

  useEffect(() => {
    const supabase = supabaseBrowser();
    (async () => {
      try {
        const ok = await hasActiveInvestorAccess(supabase);
        if (ok) {
          await logPortalEvent(supabase, {
            event_type: 'PORTAL_ENTRY',
            entity_type: 'INVESTOR_PORTAL',
          });
        }
        setAllowed(ok);
      } catch {
        setAllowed(false);
      }
    })();
  }, []);

  if (allowed === null) return null;

  if (!allowed) {
    return (
      <>
        {fallback ?? (
          <div style={{ padding: 16 }}>
            Vireoka Intelligence access required.
          </div>
        )}
      </>
    );
  }

  return <>{children}</>;
}
