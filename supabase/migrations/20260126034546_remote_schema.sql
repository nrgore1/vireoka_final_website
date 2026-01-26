drop extension if exists "pg_net";

create sequence "public"."investor_audit_id_seq";

create sequence "public"."investor_events_id_seq";

drop trigger if exists "set_investor_reference" on "public"."investor_applications";

drop policy "anon_insert_investor_applications" on "public"."investor_applications";

alter table "public"."investor_applications" drop constraint "investor_applications_reference_code_key";

drop index if exists "public"."investor_applications_reference_code_key";


  create table "public"."admins" (
    "id" uuid not null default gen_random_uuid(),
    "email" text not null,
    "role" text not null default 'admin'::text,
    "created_at" timestamp with time zone not null default now(),
    "last_login_at" timestamp with time zone
      );



  create table "public"."audit_logs" (
    "id" uuid not null default gen_random_uuid(),
    "actor_email" text,
    "action" text not null,
    "target" text,
    "metadata" jsonb,
    "created_at" timestamp with time zone default now()
      );



  create table "public"."email_logs" (
    "id" uuid not null default gen_random_uuid(),
    "recipient" text not null,
    "type" text not null,
    "status" text not null,
    "error" text,
    "created_at" timestamp with time zone default now()
      );



  create table "public"."email_tracking_events" (
    "id" uuid not null default gen_random_uuid(),
    "comm_id" uuid,
    "email" text not null,
    "event" text not null,
    "url" text,
    "user_agent" text,
    "ip" text,
    "created_at" timestamp with time zone default now()
      );



  create table "public"."investor_access_logs" (
    "id" uuid not null default gen_random_uuid(),
    "investor_email" text not null,
    "path" text not null,
    "event" text not null,
    "created_at" timestamp with time zone default now()
      );


alter table "public"."investor_access_logs" enable row level security;


  create table "public"."investor_access_requests" (
    "id" uuid not null default gen_random_uuid(),
    "email" text not null,
    "name" text,
    "firm" text,
    "message" text,
    "status" text default 'pending'::text,
    "created_at" timestamp with time zone default now(),
    "reviewed_at" timestamp with time zone,
    "ip" text,
    "user_agent" text
      );



  create table "public"."investor_audit" (
    "id" bigint not null default nextval('public.investor_audit_id_seq'::regclass),
    "email" text not null,
    "action" text not null,
    "meta" jsonb,
    "created_at" timestamp with time zone default now()
      );



  create table "public"."investor_comms" (
    "id" uuid not null default gen_random_uuid(),
    "email" text not null,
    "type" text not null,
    "subject" text,
    "status" text not null,
    "provider_id" text,
    "error" text,
    "meta" jsonb,
    "created_at" timestamp with time zone default now()
      );



  create table "public"."investor_events" (
    "id" bigint not null default nextval('public.investor_events_id_seq'::regclass),
    "email" text,
    "event" text not null,
    "path" text,
    "created_at" timestamp with time zone default now()
      );



  create table "public"."investor_preferences" (
    "email" text not null,
    "email_notifications" boolean default true,
    "analytics_enabled" boolean default true
      );



  create table "public"."investor_requests" (
    "id" uuid not null default gen_random_uuid(),
    "name" text not null,
    "email" text not null,
    "role" text not null,
    "firm" text,
    "comments" text,
    "created_at" timestamp with time zone default now()
      );



  create table "public"."investors" (
    "email" text not null,
    "status" text not null,
    "approved_at" timestamp with time zone,
    "expires_at" timestamp with time zone,
    "created_at" timestamp with time zone default now(),
    "nda_signed" boolean default false,
    "invited_at" timestamp with time zone default now(),
    "last_access" timestamp with time zone,
    "invite_expires_at" timestamp with time zone,
    "access_expires_at" timestamp with time zone,
    "nda_signed_at" timestamp with time zone,
    "nda_version_accepted" integer,
    "approved_by" text,
    "engagement_score" integer default 0,
    "role" text default 'investor'::text,
    "nda_accepted_at" timestamp with time zone,
    "hot_alerted_at" timestamp with time zone
      );


alter table "public"."investors" enable row level security;


  create table "public"."nda_versions" (
    "id" uuid not null default gen_random_uuid(),
    "version" integer not null,
    "file_path" text not null,
    "active" boolean default false,
    "created_at" timestamp with time zone default now()
      );



  create table "public"."page_access_logs" (
    "id" uuid not null default gen_random_uuid(),
    "email" text,
    "path" text,
    "created_at" timestamp with time zone default now()
      );


alter table "public"."investor_applications" add column "admin_notes" text;

alter table "public"."investor_applications" alter column "reference_code" set default ('INV-'::text || upper(substr((gen_random_uuid())::text, 1, 8)));

alter table "public"."investor_applications" alter column "status" set default 'SUBMITTED'::text;

alter sequence "public"."investor_audit_id_seq" owned by "public"."investor_audit"."id";

alter sequence "public"."investor_events_id_seq" owned by "public"."investor_events"."id";

CREATE UNIQUE INDEX admins_email_key ON public.admins USING btree (email);

CREATE UNIQUE INDEX admins_pkey ON public.admins USING btree (id);

CREATE UNIQUE INDEX audit_logs_pkey ON public.audit_logs USING btree (id);

CREATE UNIQUE INDEX email_logs_pkey ON public.email_logs USING btree (id);

CREATE UNIQUE INDEX email_tracking_events_pkey ON public.email_tracking_events USING btree (id);

CREATE INDEX idx_access_requests_email ON public.investor_access_requests USING btree (email);

CREATE INDEX idx_access_requests_ip_created ON public.investor_access_requests USING btree (ip, created_at);

CREATE INDEX idx_investor_comms_email_created ON public.investor_comms USING btree (email, created_at DESC);

CREATE INDEX idx_investors_email ON public.investors USING btree (email);

CREATE INDEX idx_tracking_comm ON public.email_tracking_events USING btree (comm_id, created_at DESC);

CREATE UNIQUE INDEX investor_access_logs_pkey ON public.investor_access_logs USING btree (id);

CREATE INDEX investor_access_requests_created_idx ON public.investor_access_requests USING btree (created_at DESC);

CREATE UNIQUE INDEX investor_access_requests_pkey ON public.investor_access_requests USING btree (id);

CREATE INDEX investor_applications_email_idx ON public.investor_applications USING btree (email);

CREATE INDEX investor_applications_status_idx ON public.investor_applications USING btree (status);

CREATE UNIQUE INDEX investor_audit_pkey ON public.investor_audit USING btree (id);

CREATE UNIQUE INDEX investor_comms_pkey ON public.investor_comms USING btree (id);

CREATE INDEX investor_events_email_created_idx ON public.investor_events USING btree (email, created_at DESC);

CREATE INDEX investor_events_event_created_idx ON public.investor_events USING btree (event, created_at DESC);

CREATE UNIQUE INDEX investor_events_pkey ON public.investor_events USING btree (id);

CREATE UNIQUE INDEX investor_preferences_pkey ON public.investor_preferences USING btree (email);

CREATE UNIQUE INDEX investor_requests_pkey ON public.investor_requests USING btree (id);

CREATE INDEX investors_access_expires_at_idx ON public.investors USING btree (access_expires_at);

CREATE INDEX investors_engagement_score_idx ON public.investors USING btree (engagement_score DESC);

CREATE UNIQUE INDEX investors_pkey ON public.investors USING btree (email);

CREATE INDEX investors_status_created_idx ON public.investors USING btree (status, created_at DESC);

CREATE UNIQUE INDEX nda_versions_one_active ON public.nda_versions USING btree (active) WHERE (active = true);

CREATE UNIQUE INDEX nda_versions_pkey ON public.nda_versions USING btree (id);

CREATE UNIQUE INDEX nda_versions_version_key ON public.nda_versions USING btree (version);

CREATE UNIQUE INDEX page_access_logs_pkey ON public.page_access_logs USING btree (id);

alter table "public"."admins" add constraint "admins_pkey" PRIMARY KEY using index "admins_pkey";

alter table "public"."audit_logs" add constraint "audit_logs_pkey" PRIMARY KEY using index "audit_logs_pkey";

alter table "public"."email_logs" add constraint "email_logs_pkey" PRIMARY KEY using index "email_logs_pkey";

alter table "public"."email_tracking_events" add constraint "email_tracking_events_pkey" PRIMARY KEY using index "email_tracking_events_pkey";

alter table "public"."investor_access_logs" add constraint "investor_access_logs_pkey" PRIMARY KEY using index "investor_access_logs_pkey";

alter table "public"."investor_access_requests" add constraint "investor_access_requests_pkey" PRIMARY KEY using index "investor_access_requests_pkey";

alter table "public"."investor_audit" add constraint "investor_audit_pkey" PRIMARY KEY using index "investor_audit_pkey";

alter table "public"."investor_comms" add constraint "investor_comms_pkey" PRIMARY KEY using index "investor_comms_pkey";

alter table "public"."investor_events" add constraint "investor_events_pkey" PRIMARY KEY using index "investor_events_pkey";

alter table "public"."investor_preferences" add constraint "investor_preferences_pkey" PRIMARY KEY using index "investor_preferences_pkey";

alter table "public"."investor_requests" add constraint "investor_requests_pkey" PRIMARY KEY using index "investor_requests_pkey";

alter table "public"."investors" add constraint "investors_pkey" PRIMARY KEY using index "investors_pkey";

alter table "public"."nda_versions" add constraint "nda_versions_pkey" PRIMARY KEY using index "nda_versions_pkey";

alter table "public"."page_access_logs" add constraint "page_access_logs_pkey" PRIMARY KEY using index "page_access_logs_pkey";

alter table "public"."admins" add constraint "admins_email_key" UNIQUE using index "admins_email_key";

alter table "public"."email_tracking_events" add constraint "email_tracking_events_comm_id_fkey" FOREIGN KEY (comm_id) REFERENCES public.investor_comms(id) ON DELETE CASCADE not valid;

alter table "public"."email_tracking_events" validate constraint "email_tracking_events_comm_id_fkey";

alter table "public"."nda_versions" add constraint "nda_versions_version_key" UNIQUE using index "nda_versions_version_key";

grant delete on table "public"."admins" to "anon";

grant insert on table "public"."admins" to "anon";

grant references on table "public"."admins" to "anon";

grant select on table "public"."admins" to "anon";

grant trigger on table "public"."admins" to "anon";

grant truncate on table "public"."admins" to "anon";

grant update on table "public"."admins" to "anon";

grant delete on table "public"."admins" to "authenticated";

grant insert on table "public"."admins" to "authenticated";

grant references on table "public"."admins" to "authenticated";

grant select on table "public"."admins" to "authenticated";

grant trigger on table "public"."admins" to "authenticated";

grant truncate on table "public"."admins" to "authenticated";

grant update on table "public"."admins" to "authenticated";

grant delete on table "public"."admins" to "service_role";

grant insert on table "public"."admins" to "service_role";

grant references on table "public"."admins" to "service_role";

grant select on table "public"."admins" to "service_role";

grant trigger on table "public"."admins" to "service_role";

grant truncate on table "public"."admins" to "service_role";

grant update on table "public"."admins" to "service_role";

grant delete on table "public"."audit_logs" to "anon";

grant insert on table "public"."audit_logs" to "anon";

grant references on table "public"."audit_logs" to "anon";

grant select on table "public"."audit_logs" to "anon";

grant trigger on table "public"."audit_logs" to "anon";

grant truncate on table "public"."audit_logs" to "anon";

grant update on table "public"."audit_logs" to "anon";

grant delete on table "public"."audit_logs" to "authenticated";

grant insert on table "public"."audit_logs" to "authenticated";

grant references on table "public"."audit_logs" to "authenticated";

grant select on table "public"."audit_logs" to "authenticated";

grant trigger on table "public"."audit_logs" to "authenticated";

grant truncate on table "public"."audit_logs" to "authenticated";

grant update on table "public"."audit_logs" to "authenticated";

grant delete on table "public"."audit_logs" to "service_role";

grant insert on table "public"."audit_logs" to "service_role";

grant references on table "public"."audit_logs" to "service_role";

grant select on table "public"."audit_logs" to "service_role";

grant trigger on table "public"."audit_logs" to "service_role";

grant truncate on table "public"."audit_logs" to "service_role";

grant update on table "public"."audit_logs" to "service_role";

grant delete on table "public"."email_logs" to "anon";

grant insert on table "public"."email_logs" to "anon";

grant references on table "public"."email_logs" to "anon";

grant select on table "public"."email_logs" to "anon";

grant trigger on table "public"."email_logs" to "anon";

grant truncate on table "public"."email_logs" to "anon";

grant update on table "public"."email_logs" to "anon";

grant delete on table "public"."email_logs" to "authenticated";

grant insert on table "public"."email_logs" to "authenticated";

grant references on table "public"."email_logs" to "authenticated";

grant select on table "public"."email_logs" to "authenticated";

grant trigger on table "public"."email_logs" to "authenticated";

grant truncate on table "public"."email_logs" to "authenticated";

grant update on table "public"."email_logs" to "authenticated";

grant delete on table "public"."email_logs" to "service_role";

grant insert on table "public"."email_logs" to "service_role";

grant references on table "public"."email_logs" to "service_role";

grant select on table "public"."email_logs" to "service_role";

grant trigger on table "public"."email_logs" to "service_role";

grant truncate on table "public"."email_logs" to "service_role";

grant update on table "public"."email_logs" to "service_role";

grant delete on table "public"."email_tracking_events" to "anon";

grant insert on table "public"."email_tracking_events" to "anon";

grant references on table "public"."email_tracking_events" to "anon";

grant select on table "public"."email_tracking_events" to "anon";

grant trigger on table "public"."email_tracking_events" to "anon";

grant truncate on table "public"."email_tracking_events" to "anon";

grant update on table "public"."email_tracking_events" to "anon";

grant delete on table "public"."email_tracking_events" to "authenticated";

grant insert on table "public"."email_tracking_events" to "authenticated";

grant references on table "public"."email_tracking_events" to "authenticated";

grant select on table "public"."email_tracking_events" to "authenticated";

grant trigger on table "public"."email_tracking_events" to "authenticated";

grant truncate on table "public"."email_tracking_events" to "authenticated";

grant update on table "public"."email_tracking_events" to "authenticated";

grant delete on table "public"."email_tracking_events" to "service_role";

grant insert on table "public"."email_tracking_events" to "service_role";

grant references on table "public"."email_tracking_events" to "service_role";

grant select on table "public"."email_tracking_events" to "service_role";

grant trigger on table "public"."email_tracking_events" to "service_role";

grant truncate on table "public"."email_tracking_events" to "service_role";

grant update on table "public"."email_tracking_events" to "service_role";

grant delete on table "public"."investor_access_logs" to "anon";

grant insert on table "public"."investor_access_logs" to "anon";

grant references on table "public"."investor_access_logs" to "anon";

grant select on table "public"."investor_access_logs" to "anon";

grant trigger on table "public"."investor_access_logs" to "anon";

grant truncate on table "public"."investor_access_logs" to "anon";

grant update on table "public"."investor_access_logs" to "anon";

grant delete on table "public"."investor_access_logs" to "authenticated";

grant insert on table "public"."investor_access_logs" to "authenticated";

grant references on table "public"."investor_access_logs" to "authenticated";

grant select on table "public"."investor_access_logs" to "authenticated";

grant trigger on table "public"."investor_access_logs" to "authenticated";

grant truncate on table "public"."investor_access_logs" to "authenticated";

grant update on table "public"."investor_access_logs" to "authenticated";

grant delete on table "public"."investor_access_logs" to "service_role";

grant insert on table "public"."investor_access_logs" to "service_role";

grant references on table "public"."investor_access_logs" to "service_role";

grant select on table "public"."investor_access_logs" to "service_role";

grant trigger on table "public"."investor_access_logs" to "service_role";

grant truncate on table "public"."investor_access_logs" to "service_role";

grant update on table "public"."investor_access_logs" to "service_role";

grant delete on table "public"."investor_access_requests" to "anon";

grant insert on table "public"."investor_access_requests" to "anon";

grant references on table "public"."investor_access_requests" to "anon";

grant select on table "public"."investor_access_requests" to "anon";

grant trigger on table "public"."investor_access_requests" to "anon";

grant truncate on table "public"."investor_access_requests" to "anon";

grant update on table "public"."investor_access_requests" to "anon";

grant delete on table "public"."investor_access_requests" to "authenticated";

grant insert on table "public"."investor_access_requests" to "authenticated";

grant references on table "public"."investor_access_requests" to "authenticated";

grant select on table "public"."investor_access_requests" to "authenticated";

grant trigger on table "public"."investor_access_requests" to "authenticated";

grant truncate on table "public"."investor_access_requests" to "authenticated";

grant update on table "public"."investor_access_requests" to "authenticated";

grant delete on table "public"."investor_access_requests" to "service_role";

grant insert on table "public"."investor_access_requests" to "service_role";

grant references on table "public"."investor_access_requests" to "service_role";

grant select on table "public"."investor_access_requests" to "service_role";

grant trigger on table "public"."investor_access_requests" to "service_role";

grant truncate on table "public"."investor_access_requests" to "service_role";

grant update on table "public"."investor_access_requests" to "service_role";

grant delete on table "public"."investor_audit" to "anon";

grant insert on table "public"."investor_audit" to "anon";

grant references on table "public"."investor_audit" to "anon";

grant select on table "public"."investor_audit" to "anon";

grant trigger on table "public"."investor_audit" to "anon";

grant truncate on table "public"."investor_audit" to "anon";

grant update on table "public"."investor_audit" to "anon";

grant delete on table "public"."investor_audit" to "authenticated";

grant insert on table "public"."investor_audit" to "authenticated";

grant references on table "public"."investor_audit" to "authenticated";

grant select on table "public"."investor_audit" to "authenticated";

grant trigger on table "public"."investor_audit" to "authenticated";

grant truncate on table "public"."investor_audit" to "authenticated";

grant update on table "public"."investor_audit" to "authenticated";

grant delete on table "public"."investor_audit" to "service_role";

grant insert on table "public"."investor_audit" to "service_role";

grant references on table "public"."investor_audit" to "service_role";

grant select on table "public"."investor_audit" to "service_role";

grant trigger on table "public"."investor_audit" to "service_role";

grant truncate on table "public"."investor_audit" to "service_role";

grant update on table "public"."investor_audit" to "service_role";

grant delete on table "public"."investor_comms" to "anon";

grant insert on table "public"."investor_comms" to "anon";

grant references on table "public"."investor_comms" to "anon";

grant select on table "public"."investor_comms" to "anon";

grant trigger on table "public"."investor_comms" to "anon";

grant truncate on table "public"."investor_comms" to "anon";

grant update on table "public"."investor_comms" to "anon";

grant delete on table "public"."investor_comms" to "authenticated";

grant insert on table "public"."investor_comms" to "authenticated";

grant references on table "public"."investor_comms" to "authenticated";

grant select on table "public"."investor_comms" to "authenticated";

grant trigger on table "public"."investor_comms" to "authenticated";

grant truncate on table "public"."investor_comms" to "authenticated";

grant update on table "public"."investor_comms" to "authenticated";

grant delete on table "public"."investor_comms" to "service_role";

grant insert on table "public"."investor_comms" to "service_role";

grant references on table "public"."investor_comms" to "service_role";

grant select on table "public"."investor_comms" to "service_role";

grant trigger on table "public"."investor_comms" to "service_role";

grant truncate on table "public"."investor_comms" to "service_role";

grant update on table "public"."investor_comms" to "service_role";

grant delete on table "public"."investor_events" to "anon";

grant insert on table "public"."investor_events" to "anon";

grant references on table "public"."investor_events" to "anon";

grant select on table "public"."investor_events" to "anon";

grant trigger on table "public"."investor_events" to "anon";

grant truncate on table "public"."investor_events" to "anon";

grant update on table "public"."investor_events" to "anon";

grant delete on table "public"."investor_events" to "authenticated";

grant insert on table "public"."investor_events" to "authenticated";

grant references on table "public"."investor_events" to "authenticated";

grant select on table "public"."investor_events" to "authenticated";

grant trigger on table "public"."investor_events" to "authenticated";

grant truncate on table "public"."investor_events" to "authenticated";

grant update on table "public"."investor_events" to "authenticated";

grant delete on table "public"."investor_events" to "service_role";

grant insert on table "public"."investor_events" to "service_role";

grant references on table "public"."investor_events" to "service_role";

grant select on table "public"."investor_events" to "service_role";

grant trigger on table "public"."investor_events" to "service_role";

grant truncate on table "public"."investor_events" to "service_role";

grant update on table "public"."investor_events" to "service_role";

grant delete on table "public"."investor_preferences" to "anon";

grant insert on table "public"."investor_preferences" to "anon";

grant references on table "public"."investor_preferences" to "anon";

grant select on table "public"."investor_preferences" to "anon";

grant trigger on table "public"."investor_preferences" to "anon";

grant truncate on table "public"."investor_preferences" to "anon";

grant update on table "public"."investor_preferences" to "anon";

grant delete on table "public"."investor_preferences" to "authenticated";

grant insert on table "public"."investor_preferences" to "authenticated";

grant references on table "public"."investor_preferences" to "authenticated";

grant select on table "public"."investor_preferences" to "authenticated";

grant trigger on table "public"."investor_preferences" to "authenticated";

grant truncate on table "public"."investor_preferences" to "authenticated";

grant update on table "public"."investor_preferences" to "authenticated";

grant delete on table "public"."investor_preferences" to "service_role";

grant insert on table "public"."investor_preferences" to "service_role";

grant references on table "public"."investor_preferences" to "service_role";

grant select on table "public"."investor_preferences" to "service_role";

grant trigger on table "public"."investor_preferences" to "service_role";

grant truncate on table "public"."investor_preferences" to "service_role";

grant update on table "public"."investor_preferences" to "service_role";

grant delete on table "public"."investor_requests" to "anon";

grant insert on table "public"."investor_requests" to "anon";

grant references on table "public"."investor_requests" to "anon";

grant select on table "public"."investor_requests" to "anon";

grant trigger on table "public"."investor_requests" to "anon";

grant truncate on table "public"."investor_requests" to "anon";

grant update on table "public"."investor_requests" to "anon";

grant delete on table "public"."investor_requests" to "authenticated";

grant insert on table "public"."investor_requests" to "authenticated";

grant references on table "public"."investor_requests" to "authenticated";

grant select on table "public"."investor_requests" to "authenticated";

grant trigger on table "public"."investor_requests" to "authenticated";

grant truncate on table "public"."investor_requests" to "authenticated";

grant update on table "public"."investor_requests" to "authenticated";

grant delete on table "public"."investor_requests" to "service_role";

grant insert on table "public"."investor_requests" to "service_role";

grant references on table "public"."investor_requests" to "service_role";

grant select on table "public"."investor_requests" to "service_role";

grant trigger on table "public"."investor_requests" to "service_role";

grant truncate on table "public"."investor_requests" to "service_role";

grant update on table "public"."investor_requests" to "service_role";

grant delete on table "public"."investors" to "anon";

grant insert on table "public"."investors" to "anon";

grant references on table "public"."investors" to "anon";

grant select on table "public"."investors" to "anon";

grant trigger on table "public"."investors" to "anon";

grant truncate on table "public"."investors" to "anon";

grant update on table "public"."investors" to "anon";

grant delete on table "public"."investors" to "authenticated";

grant insert on table "public"."investors" to "authenticated";

grant references on table "public"."investors" to "authenticated";

grant select on table "public"."investors" to "authenticated";

grant trigger on table "public"."investors" to "authenticated";

grant truncate on table "public"."investors" to "authenticated";

grant update on table "public"."investors" to "authenticated";

grant delete on table "public"."investors" to "service_role";

grant insert on table "public"."investors" to "service_role";

grant references on table "public"."investors" to "service_role";

grant select on table "public"."investors" to "service_role";

grant trigger on table "public"."investors" to "service_role";

grant truncate on table "public"."investors" to "service_role";

grant update on table "public"."investors" to "service_role";

grant delete on table "public"."nda_versions" to "anon";

grant insert on table "public"."nda_versions" to "anon";

grant references on table "public"."nda_versions" to "anon";

grant select on table "public"."nda_versions" to "anon";

grant trigger on table "public"."nda_versions" to "anon";

grant truncate on table "public"."nda_versions" to "anon";

grant update on table "public"."nda_versions" to "anon";

grant delete on table "public"."nda_versions" to "authenticated";

grant insert on table "public"."nda_versions" to "authenticated";

grant references on table "public"."nda_versions" to "authenticated";

grant select on table "public"."nda_versions" to "authenticated";

grant trigger on table "public"."nda_versions" to "authenticated";

grant truncate on table "public"."nda_versions" to "authenticated";

grant update on table "public"."nda_versions" to "authenticated";

grant delete on table "public"."nda_versions" to "service_role";

grant insert on table "public"."nda_versions" to "service_role";

grant references on table "public"."nda_versions" to "service_role";

grant select on table "public"."nda_versions" to "service_role";

grant trigger on table "public"."nda_versions" to "service_role";

grant truncate on table "public"."nda_versions" to "service_role";

grant update on table "public"."nda_versions" to "service_role";

grant delete on table "public"."page_access_logs" to "anon";

grant insert on table "public"."page_access_logs" to "anon";

grant references on table "public"."page_access_logs" to "anon";

grant select on table "public"."page_access_logs" to "anon";

grant trigger on table "public"."page_access_logs" to "anon";

grant truncate on table "public"."page_access_logs" to "anon";

grant update on table "public"."page_access_logs" to "anon";

grant delete on table "public"."page_access_logs" to "authenticated";

grant insert on table "public"."page_access_logs" to "authenticated";

grant references on table "public"."page_access_logs" to "authenticated";

grant select on table "public"."page_access_logs" to "authenticated";

grant trigger on table "public"."page_access_logs" to "authenticated";

grant truncate on table "public"."page_access_logs" to "authenticated";

grant update on table "public"."page_access_logs" to "authenticated";

grant delete on table "public"."page_access_logs" to "service_role";

grant insert on table "public"."page_access_logs" to "service_role";

grant references on table "public"."page_access_logs" to "service_role";

grant select on table "public"."page_access_logs" to "service_role";

grant trigger on table "public"."page_access_logs" to "service_role";

grant truncate on table "public"."page_access_logs" to "service_role";

grant update on table "public"."page_access_logs" to "service_role";


  create policy "Insert access logs"
  on "public"."investor_access_logs"
  as permissive
  for insert
  to public
with check (true);



  create policy "no_public_read_investor_applications"
  on "public"."investor_applications"
  as permissive
  for select
  to anon
using (false);



  create policy "public_can_submit_investor_application"
  on "public"."investor_applications"
  as permissive
  for insert
  to anon, authenticated
with check (true);



  create policy "Investor self read"
  on "public"."investors"
  as permissive
  for select
  to public
using ((email = (auth.jwt() ->> 'email'::text)));



