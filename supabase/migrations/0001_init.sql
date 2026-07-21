-- ══════════════════════════════════════════════════════════════
-- Vivo website — Supabase schema
-- Run in the Supabase SQL editor (cloud or self-hosted / Coolify).
-- ══════════════════════════════════════════════════════════════

-- Full editable site content as one JSON document (id = 'main').
create table if not exists public.site_content (
  id          text primary key default 'main',
  doc         jsonb not null,
  updated_at  timestamptz not null default now()
);

-- Contact / "book a call" message submissions.
create table if not exists public.contact_messages (
  id          uuid primary key default gen_random_uuid(),
  name        text,
  email       text,
  message     text,
  created_at  timestamptz not null default now()
);

-- Careers applications.
create table if not exists public.applications (
  id          uuid primary key default gen_random_uuid(),
  role        text,
  first_name  text,
  last_name   text,
  email       text,
  phone       text,
  linkedin    text,
  english     text,
  experience  text,
  story       text,
  created_at  timestamptz not null default now()
);

-- Who is allowed into the admin backoffice.
create table if not exists public.admin_users (
  user_id     uuid primary key references auth.users(id) on delete cascade,
  email       text,
  created_at  timestamptz not null default now()
);

-- ── Row Level Security ─────────────────────────────────────────
alter table public.site_content   enable row level security;
alter table public.contact_messages enable row level security;
alter table public.applications   enable row level security;
alter table public.admin_users    enable row level security;

-- Public site content is world-readable (marketing pages).
drop policy if exists "site_content read" on public.site_content;
create policy "site_content read" on public.site_content
  for select using (true);

-- Only admins may update content via the client. (Server writes use the
-- service-role key, which bypasses RLS.)
drop policy if exists "site_content admin write" on public.site_content;
create policy "site_content admin write" on public.site_content
  for all using (exists (select 1 from public.admin_users a where a.user_id = auth.uid()))
  with check (exists (select 1 from public.admin_users a where a.user_id = auth.uid()));

-- Anyone can submit a message / application (writes go through the server anyway).
drop policy if exists "contact insert" on public.contact_messages;
create policy "contact insert" on public.contact_messages for insert with check (true);
drop policy if exists "applications insert" on public.applications;
create policy "applications insert" on public.applications for insert with check (true);

-- Admins can read submissions.
drop policy if exists "contact admin read" on public.contact_messages;
create policy "contact admin read" on public.contact_messages
  for select using (exists (select 1 from public.admin_users a where a.user_id = auth.uid()));
drop policy if exists "applications admin read" on public.applications;
create policy "applications admin read" on public.applications
  for select using (exists (select 1 from public.admin_users a where a.user_id = auth.uid()));

drop policy if exists "admin self read" on public.admin_users;
create policy "admin self read" on public.admin_users
  for select using (auth.uid() = user_id);
