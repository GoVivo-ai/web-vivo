-- Proof of consent (legal v1, doc 05 §6). One row per checkbox or notice shown,
-- per submission. Kept apart from the lead tables on purpose: deleting a lead
-- must never delete the record of what that person agreed to, so there is no
-- foreign key back to contact_messages / applications.

create table if not exists public.consents (
  id                uuid primary key default gen_random_uuid(),
  form_id           text not null check (form_id in ('contact', 'booking', 'newsletter', 'careers')),
  submission_id     uuid,
  subject_email     text not null,
  subject_phone     text,                      -- only on SMS rows
  consent_type      text not null check (consent_type in ('sms', 'email_marketing', 'careers_auth', 'careers_pool', 'notice')),
  consent_text_id   text not null,             -- e.g. sms-v1.0; changes whenever the wording does
  granted           boolean not null,
  marketing_cookies boolean,                   -- cookie banner's marketing choice at submit time
  ip_address        text,
  user_agent        text,
  page_url          text,
  created_at        timestamptz not null default now(),
  revoked_at        timestamptz                -- set on STOP / unsubscribe, never deleted
);

create index if not exists consents_email_idx on public.consents (lower(subject_email));
create index if not exists consents_phone_idx on public.consents (subject_phone) where subject_phone is not null;

-- Written and read only with the service-role key; no public policies.
alter table public.consents enable row level security;

-- The contact form now asks for a phone (needed for SMS consent).
alter table public.contact_messages add column if not exists phone text;

-- Careers retention fields (doc 05 §6). Automatic deletion comes in phase 3,
-- but the fields exist from day one.
alter table public.applications
  add column if not exists careers_pool      boolean not null default false,
  add column if not exists process_closed_at timestamptz;
