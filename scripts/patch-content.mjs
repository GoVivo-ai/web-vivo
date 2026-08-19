#!/usr/bin/env node
/**
 * Patches the LIVE content document (site_content.id = 'main') with the
 * 2026-08 website fixes requested by Laura. Idempotent — safe to re-run.
 *
 *   node scripts/patch-content.mjs --dry     # show what would change
 *   node scripts/patch-content.mjs           # apply
 *
 * Reads NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY from the
 * environment or from .env.local. Content that only exists in code (favicon,
 * flip-card renderer, hidden photo notes, footer links) ships with the deploy;
 * this script only touches the stored JSON the renderers read from.
 */
import { readFileSync, existsSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";

// ── env ──
if (existsSync(".env.local")) {
  for (const line of readFileSync(".env.local", "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*"?([^"\n]*)"?\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
  }
}
const URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!URL || !KEY) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}
const DRY = process.argv.includes("--dry");

// ── inputs (fill the empty ones when Laura sends them) ──
const FOOTER = { phone: "(385) 342-5646", email: "info@govivo.ai", contactLine: "Latin America · US-aligned time zones" };
const STEP_IMAGES = [
  { image: "/images/how-it-works/step-1-map.jpg", imageAlt: "Two people reviewing an operations map" },
  { image: "/images/how-it-works/step-2-recruit.jpg", imageAlt: "Specialist being trained on the team's process" },
  { image: "/images/how-it-works/step-3-live.jpg", imageAlt: "Team live on calls with metrics in view" },
  { image: "/images/how-it-works/step-4-runs.jpg", imageAlt: "Owner reviewing results while the team runs the operation" },
];
/** Home → Industries flip-card images (folder "Home-Industries"). Paths under /public or media URLs. */
const HOME_INDUSTRY_IMAGES = { "/industries/home-services": "/images/home/industries/home-services.jpg", "/industries/transportation": "/images/home/industries/transportation.jpg", "/industries/logistics": "/images/home/industries/logistics.jpg" };
/** Industries pages: "What we do" split photo (folder "Industries"; logistics from "contenidos"). Heroes stay navy per Laura. */
const INDUSTRY_SPLIT_IMAGES = { "/industries/home-services": "/images/industries/home-services-crew.jpg", "/industries/transportation": "/images/industries/transportation-driver.jpg", "/industries/logistics": "/images/industries/logistics-tracking.jpg" };
/** About: founder portraits by name + team / culture photos (folder "About"). */
const ABOUT_FOUNDERS = { "Daniel Hernández": "/images/about/daniel-hernandez.jpg", "Juan Pablo Rivas": "/images/about/juan-pablo-rivas.jpg", "Felipe Jiménez": "/images/about/felipe-jimenez.jpg", "Víctor Sandoval": "/images/about/victor-sandoval.jpg" };
const ABOUT_TEAM_IMAGE = "/images/about/team.jpg";
const ABOUT_CULTURE_IMAGE = "/images/about/culture.jpg";
const COMPANY_LINKEDIN = ""; // e.g. https://www.linkedin.com/company/…
const CAREERS_HERO_IMAGE = ""; // Laura: keep the navy hero (Careers/Hero.jpg is at /images/careers/hero.jpg if wanted later)
const CAREER_ROLE_IMAGES = { "/careers/customer-service-representative": "/images/careers/customer-service.jpg", "/careers/sales-representative": "/images/careers/sales.jpg", "/careers/back-office-representative": "/images/careers/back-office.jpg" };
const CAREERS_CULTURE_IMAGE = "/images/careers/culture-benefits.jpg";
const BOOKING_URL = ""; // Google Calendar appointment schedule of info@govivo.ai (embed URL)

// ── patch ──
const sb = createClient(URL, KEY, { auth: { persistSession: false } });
const { data, error } = await sb.from("site_content").select("doc").eq("id", "main").maybeSingle();
if (error) throw error;
if (!data?.doc) { console.error("No stored content — site runs on seed; nothing to patch."); process.exit(0); }
const doc = data.doc;
const before = JSON.stringify(doc);
const log = [];
const page = (p) => doc.pages.find((x) => x.path === p);
const block = (p, id) => page(p)?.blocks.find((b) => b.id === id);
const set = (obj, key, val, what) => { if (val && obj && obj[key] !== val) { obj[key] = val; log.push(what); } };

// Footer
doc.settings ??= {}; doc.settings.footer ??= {};
set(doc.settings.footer, "phone", FOOTER.phone, "footer.phone");
set(doc.settings.footer, "email", FOOTER.email, "footer.email");
if (/\[ add/.test(doc.settings.footer.contactLine || "")) set(doc.settings.footer, "contactLine", FOOTER.contactLine, "footer.contactLine");

// Home: process images + flip cards
const steps = block("/", "home-steps");
steps?.props.steps?.forEach((s, i) => { if (STEP_IMAGES[i]) { set(s, "image", STEP_IMAGES[i].image, `home-steps[${i}].image`); set(s, "imageAlt", STEP_IMAGES[i].imageAlt, `home-steps[${i}].imageAlt`); } });
const ind = block("/", "home-industries");
if (ind && ind.props.flip !== true) { ind.props.flip = true; log.push("home-industries.flip"); }
ind?.props.cards?.forEach((c) => set(c, "image", HOME_INDUSTRY_IMAGES[c.href], `home-industries ${c.href} image`));

// Industries: "What we do" split photo
for (const [path, img] of Object.entries(INDUSTRY_SPLIT_IMAGES)) {
  const split = page(path)?.blocks.find((b) => b.type === "splitDo");
  set(split?.props, "image", img, `${path} splitDo image`);
}

// About
block("/about", "ab-founders")?.props.people?.forEach((m) => set(m, "image", ABOUT_FOUNDERS[m.name], `founder ${m.name} image`));
set(block("/about", "ab-team")?.props, "image", ABOUT_TEAM_IMAGE, "about team image");
set(block("/about", "ab-culture")?.props, "image", ABOUT_CULTURE_IMAGE, "about culture image");
const abCta = block("/about", "ab-cta");
if (abCta?.props.secondaryCta) set(abCta.props.secondaryCta, "href", COMPANY_LINKEDIN, "Company LinkedIn href");

// Careers: role card photos + culture photo (+ hero only if provided)
block("/careers", "ca-roles")?.props.cards?.forEach((c) => set(c, "image", CAREER_ROLE_IMAGES[c.href], `careers role ${c.href} image`));
{ const cu = block("/careers", "ca-culture"); if (cu && !cu.props.image) set(cu.props, "image", CAREERS_CULTURE_IMAGE, "careers culture image"); }
const caHero = block("/careers", "ca-hero");
if (caHero && CAREERS_HERO_IMAGE) { set(caHero.props, "image", CAREERS_HERO_IMAGE, "careers hero image"); set(caHero.props, "variant", "photo", "careers hero variant"); }

// Book a clarity call
set(block("/book", "bk")?.props, "calendlyUrl", BOOKING_URL, "book calendar url");

if (!log.length) { console.log("Nothing to change."); process.exit(0); }
console.log((DRY ? "Would change:\n  " : "Changing:\n  ") + log.join("\n  "));
if (DRY || JSON.stringify(doc) === before) process.exit(0);
const { error: e2 } = await sb.from("site_content").upsert({ id: "main", doc, updated_at: new Date().toISOString() });
if (e2) throw e2;
console.log("Saved.");
