-- Careers applications now require a resume, and every lead carries its source
-- so Martek can weight a website lead differently from a Meta Ads one.

alter table public.applications
  add column if not exists resume_path text,
  add column if not exists resume_name text,
  add column if not exists source      text not null default 'website';

-- Private bucket for resumes. Files are never public: the backoffice reads them
-- through short-lived signed URLs generated with the service-role key.
insert into storage.buckets (id, name, public)
values ('applications', 'applications', false)
on conflict (id) do nothing;
