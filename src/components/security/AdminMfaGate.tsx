"use client";

import React, { useEffect, useState } from 'react';
import { supabaseBrowser } from '@/lib/supabase/browser';
import { ensureInvestorAdminRole } from '@/lib/admin/adminApi';

/**
 * Admin MFA Gate
 *
 * - Client component (uses hooks)
 * - Enforces MFA (AAL2) for INVESTOR_ADMIN users
 * - Role enforcement is defensive; RLS is authoritative
 */
export function AdminMfaGate({ children }: { children: React.ReactNode }) {
  const [ok, setOk] = useState<boolean | null>(null);

  useEffect(() => {
    const supabase = supabaseBrowser();
    (async () => {
      try {
        // Ensure role (defensive check)
        await ensureInvestorAdminRole(supabase);

        // Check MFA level
        const { data, error } = await supabase.auth.getAssuranceLevel();
        if (error) throw error;

        setOk(data.currentLevel === 'aal2');
      } catch {
        setOk(false);
      }
    })();
  }, []);

  if (ok === null) return null;

  if (!ok) {
    return (
      <div style={{ padding: 16 }}>
        <h3>MFA Required</h3>
        <p>
          Please complete multi-factor authentication to access this area.
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
