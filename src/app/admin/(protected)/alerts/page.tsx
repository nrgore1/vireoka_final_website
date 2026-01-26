import React from 'react';
import { AdminExpiringAccessPanel } from '@/components/admin/AdminExpiringAccessPanel';
import { AdminAuditPanel } from '@/components/admin/AdminAuditPanel';

/**
 * Admin Alerts Page
 * - Uses canonical admin components
 * - Protected by AdminGuard + AdminMfaGate via layout
 * - Import paths aligned with tsconfig baseUrl (@ -> src)
 */
export default function AdminAlertsPage() {
  return (
    <div style={{ padding: 24, display: 'grid', gap: 16 }}>
      <h1 style={{ margin: 0 }}>Admin Alerts</h1>
      <AdminExpiringAccessPanel days={7} />
      <AdminAuditPanel />
    </div>
  );
}
