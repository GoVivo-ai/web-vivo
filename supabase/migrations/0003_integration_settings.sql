-- Webhook URLs and secrets move out of site_content, which is world-readable,
-- into a table only the service-role key can reach. Safe to run more than once.

begin;

create table if not exists public.integration_settings (
  id                  text primary key default 'main' check (id = 'main'),
  lead_webhook_url    text,
  lead_webhook_secret text,
  crm_webhook_url     text,
  crm_webhook_secret  text,
  updated_at          timestamptz not null default now()
);

-- RLS on with no policies: anon and authenticated clients get nothing.
alter table public.integration_settings enable row level security;
revoke all on public.integration_settings from anon, authenticated;

-- Carry over anything already configured in Settings → Integrations.
insert into public.integration_settings (id, lead_webhook_url, lead_webhook_secret)
select 'main',
       nullif(trim(doc #>> '{settings,integrations,leadWebhookUrl}'), ''),
       nullif(trim(doc #>> '{settings,integrations,leadWebhookSecret}'), '')
from public.site_content
where id = 'main'
on conflict (id) do nothing;

update public.site_content
set doc = doc #- '{settings,integrations}'
where doc #> '{settings,integrations}' is not null;

commit;
