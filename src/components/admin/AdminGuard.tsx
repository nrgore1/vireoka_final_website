"use client";

import React, { useEffect, useState } from 'react';
import { supabaseBrowser } from '@/lib/supabase/browser';
import { ensureInvestorAdminRole } from '@/lib/admin/adminApi';

/**
 * Canonical Admin Guard
 *
 * - Client component (uses hooks)
 * - Enforces INVESTOR_ADMIN role at UI level
 * - RLS remains the final authority
 */
export function AdminGuard({ children }: { children: React.ReactNode }) {
  const [ok, setOk] = useState<boolean | null>(null);

  useEffect(() => {
    const supabase = supabaseBrowser();
    (async () => {
      try {
        await ensureInvestorAdminRole(supabase);
        setOk(true);
      } catch {
        setOk(false);
      }
    })();
  }, []);

  if (ok === null) return null;

  if (!ok) {
    return (
      <div style={{ padding: 16 }}>
        Access denied.
      </div>
    );
  }

  return <>{children}</>;
}
