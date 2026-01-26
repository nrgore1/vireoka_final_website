-- ============================================
-- Create audit log table for investor workflow
-- ============================================

create table if not exists investor_application_audit_logs (
  id uuid primary key default gen_random_uuid(),

  application_id uuid not null
    references investor_applications(id)
    on delete cascade,

  actor_type text not null, -- public | admin | system
  actor_id uuid,            -- admin user id (nullable)

  action text not null,     -- submit | approve | reject | update_status
  from_status text,
  to_status text,

  ip text,
  user_agent text,

  metadata jsonb not null default '{}'::jsonb,

  created_at timestamptz not null default now()
);
