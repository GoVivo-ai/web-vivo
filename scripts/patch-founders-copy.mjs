#!/usr/bin/env node
/**
 * Applies the 2026-08 "About Us: Founders" copy (vivo-about-founders-copy.docx)
 * to the LIVE content document (site_content.id = 'main'). Idempotent.
 *
 *   node scripts/patch-founders-copy.mjs --dry   # show what would change
 *   node scripts/patch-founders-copy.mjs         # apply
 *
 * The `punch` field itself is rendered by code (components/blocks/render.tsx),
 * so this only ships once the deploy with the new founders block is live.
 */
import { readFileSync, existsSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";

if (existsSync(".env.local")) {
  for (const line of readFileSync(".env.local", "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*"?([^"\n]*)"?\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
  }
}
const URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!URL || !KEY) { console.error("Missing NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY"); process.exit(1); }
const DRY = process.argv.includes("--dry");

const HEAD = { eyebrow: "Founders", title: "The team behind your team." };
const PEOPLE = {
  "Daniel Hernández": { role: "CEO", punch: "He's sat in your chair.", text: "Ran home services and NEMT operations inside US businesses. Based in Utah. He knows how the business works before we build the team around it." },
  "Juan Pablo Rivas": { role: "COO", punch: "Delivery is never left to chance.", text: "Builds the structure behind every POD. Hiring, training, standards, and the reporting that keeps a team performing long after month one." },
  "Felipe Jiménez": { role: "CGO", punch: "Growth is part of the operation.", text: "Builds the demand side. Positioning, campaigns, and the sales process that turn a stable operation into new revenue." },
  "Víctor Sandoval": { role: "CTO", punch: "You stop guessing what's working.", text: "Builds the technology layer under every team. Dashboards, integrations, and tracking, so the results are visible while the work happens." },
};

const sb = createClient(URL, KEY, { auth: { persistSession: false } });
const { data, error } = await sb.from("site_content").select("doc").eq("id", "main").maybeSingle();
if (error) throw error;
if (!data?.doc) { console.error("No stored content — site runs on seed; nothing to patch."); process.exit(0); }
const doc = data.doc;
const before = JSON.stringify(doc);
const log = [];
const set = (obj, key, val, what) => { if (val && obj && obj[key] !== val) { obj[key] = val; log.push(what); } };

const props = doc.pages.find((p) => p.path === "/about")?.blocks.find((b) => b.id === "ab-founders")?.props;
if (!props) { console.error("Block ab-founders not found on /about."); process.exit(1); }
set(props, "eyebrow", HEAD.eyebrow, "founders.eyebrow");
set(props, "title", HEAD.title, "founders.title");
for (const m of props.people || []) {
  const c = PEOPLE[m.name];
  if (!c) { console.warn(`No copy for "${m.name}" — left untouched.`); continue; }
  set(m, "role", c.role, `${m.name}.role`);
  set(m, "punch", c.punch, `${m.name}.punch`);
  set(m, "text", c.text, `${m.name}.bio`);
}

if (!log.length) { console.log("Nothing to change."); process.exit(0); }
console.log((DRY ? "Would change:\n  " : "Changing:\n  ") + log.join("\n  "));
if (DRY || JSON.stringify(doc) === before) process.exit(0);
const { error: e2 } = await sb.from("site_content").upsert({ id: "main", doc, updated_at: new Date().toISOString() });
if (e2) throw e2;
console.log("Saved.");
