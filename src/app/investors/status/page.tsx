'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabaseBrowser } from '@/lib/supabase/browser';
import { InvestorAccessStatusCard } from '@/components/investor/InvestorAccessStatusCard';

/**
 * Investor Status Page
 *
 * - Public route
 * - Anonymous users are redirected to login
 * - Logged-in users see their status
 */
export default function InvestorStatusPage() {
  const router = useRouter();

  useEffect(() => {
    const supabase = supabaseBrowser();
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        router.replace('/login?redirect=/investors/status');
      }
    });
  }, [router]);

  return (
    <div style={{ maxWidth: 720, margin: '64px auto', padding: 16 }}>
      <h1>Investor Access Status</h1>
      <InvestorAccessStatusCard />
    </div>
  );
}
