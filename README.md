# Vivo — marketing website + backoffice

Faithful Next.js recreation of the Vivo marketing site (12 views) with a Supabase
backend and an **Elementor-style visual admin** where every page and section is editable.

- **Framework:** Next.js 15 (App Router, standalone output) + TypeScript
- **Backend:** Supabase (auth + Postgres) — cloud or self-hosted (Coolify)
- **Deploy:** Docker image, built for Coolify
- **Design system:** Vivo tokens ported 1:1 from the design handoff (`styles/tokens.css`)

Every page funnels to one goal: **Book a clarity call** (`/book`).

## Routes

| Path | View |
|------|------|
| `/` | Home |
| `/how-it-works` | How it works |
| `/industries/home-services` | Home Services |
| `/industries/transportation` | NEMT & Student Transportation |
| `/industries/logistics` | 3PL & Logistics |
| `/about` | About us |
| `/insights` | Insights hub |
| `/careers` | Careers hub |
| `/careers/customer-service-representative` | CSR role |
| `/careers/sales-representative` | Sales role |
| `/careers/back-office-representative` | Back Office role |
| `/book` | Book a clarity call |
| `/admin` | Backoffice (auth-gated) |

The site renders from a single editable content document. With no Supabase configured it
runs on the seed content in `lib/content/seed.ts`; once connected, content comes from the
`site_content` table and is edited in `/admin`.

## Local development

```bash
npm install
cp .env.example .env.local   # fill in your Supabase values (optional to start)
npm run dev                  # http://localhost:3000
```

The site works with **no** env vars (seed content, forms log to console). Add Supabase to
enable persistence, the admin editor, and form storage.

## Environment variables

```
NEXT_PUBLIC_SUPABASE_URL=<your supabase url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon key>
SUPABASE_SERVICE_ROLE_KEY=<service role key>   # server only — never public
NEXT_PUBLIC_SITE_URL=https://govivo.ai         # for metadata/OG
```

`NEXT_PUBLIC_*` are inlined at build time — in Coolify set them as **build args** too
(see Dockerfile). The service-role key is used only server-side for content saves and
form inserts.

## Supabase setup (cloud or self-hosted)

1. Open the SQL editor and run `supabase/migrations/0001_init.sql`.
   It creates `site_content`, `contact_messages`, `applications`, `admin_users`, plus RLS.
2. Create your login: **Authentication → Users → Add user** (email + password).
3. The **first** authenticated user is treated as admin automatically (bootstrap).
   To lock it down, insert your `user_id` into `admin_users` and remove others.
4. Sign in at `/admin`, edit any page, hit **Save** — content is upserted into `site_content`.

### Using self-hosted Supabase on Coolify

The self-hosted stack exposes the same API as cloud. Use the **Kong gateway URL** as
`NEXT_PUBLIC_SUPABASE_URL` (e.g. `http://supabasekong-xxxx.sslip.io`) and the legacy
`anon` / `service_role` keys from **Settings → API → API keys (legacy)**.

**About the "unhealthy" status in Coolify:** that health flag almost always comes from the
`analytics` (Logflare) or `vector` container, **not** the REST/Auth API — the database and
API usually keep serving. Quick checks:

```bash
# Auth reachable?
curl -i https://<kong-url>/auth/v1/health
# REST reachable? (expects your anon key)
curl -i https://<kong-url>/rest/v1/ -H "apikey: <anon-key>"
```

If those return 200, the app will work regardless of the analytics container. To clear the
red flag, in Coolify either disable the `analytics`/`vector` service or fix its
`LOGFLARE_API_KEY`, then redeploy. Also make sure the site is served over **HTTPS** so the
browser Supabase client (which runs on your HTTPS page) isn't blocked by mixed content.

## Deploy on Coolify

1. New Resource → **Dockerfile** (or Nixpacks) from `github.com/GoVivo-ai/web-vivo`.
2. Set env vars above (mark the three `NEXT_PUBLIC_*` as build-time args as well).
3. Port **3000**. Health check path: `/api/health`.
4. Deploy. The image is a Next.js standalone server (`node server.js`).

## The visual editor (`/admin`)

- **Pages** — every view listed; open one to edit.
- **Editor** — left: section list with reorder ↑↓, show/hide 👁, delete 🗑, and an
  **Add section** palette of ~30 block types. Selecting a section reveals a schema-driven
  form (text, lists, repeatable item groups, images, buttons). Right: **live preview** that
  updates as you type. **Save** writes the whole document to Supabase.
- **Submissions** — contact messages and job applications.

Block types and their editable fields live in `lib/blocks/registry.ts`; the renderers are
in `components/blocks/`. Content is one JSON document (`SiteContent`) — pages → blocks →
props — which keeps saves atomic and the editor simple.

## Structure

```
app/(site)/[[...slug]]   dynamic route → renders any page's blocks
app/admin/…              backoffice (login, dashboard, editor, submissions)
app/api/…                contact, apply, admin/save, health
components/blocks/        faithful section renderers + forms
components/site/          header, footer, chrome
lib/blocks/              types + field-schema registry
lib/content/             seed content + Supabase-backed store
lib/supabase/            browser/server/middleware clients
styles/                  ported Vivo tokens + site.css + admin.css
supabase/migrations/     SQL schema
```
