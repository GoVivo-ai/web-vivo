import "server-only";
import { SEED } from "./seed";
import type { SiteContent, PageDoc } from "@/lib/blocks/types";
import { hasSupabase } from "@/lib/supabase/config";
import { supabaseAdmin } from "@/lib/supabase/server";

const SINGLETON_ID = "main";

/**
 * Pages added to the seed after the site was first saved don't exist in the
 * stored doc. Append any seed page whose path the stored doc doesn't have, so
 * new pages ship with a deploy without overwriting edited content.
 */
function withNewSeedPages(doc: SiteContent): SiteContent {
  const have = new Set(doc.pages.map((p) => p.path));
  const missing = SEED.pages.filter((p) => !have.has(p.path));
  return missing.length ? { ...doc, pages: [...doc.pages, ...missing] } : doc;
}

const MEDIA_KEYS = ["image", "imageAlt", "flip"] as const;
const ITEM_LISTS = ["steps", "cards", "people", "items"] as const;

function fillMissing(target: Record<string, unknown>, source: Record<string, unknown>) {
  for (const k of MEDIA_KEYS) {
    const v = source[k];
    if (v !== undefined && v !== "" && (target[k] === undefined || target[k] === "")) target[k] = v;
  }
}

/**
 * Photos and media flags added to the seed after the site was first saved are
 * missing from the stored doc (the editor saved the whole document without
 * them). Fill those gaps from the seed — block by block (matched by id) and,
 * inside repeatable lists, item by item (matched by index) — without ever
 * overriding a value an editor has set. Footer phone / email work the same way.
 */
function withSeedMedia(doc: SiteContent): SiteContent {
  const seedBlocks = new Map(SEED.pages.flatMap((p) => p.blocks.map((b) => [b.id, b] as const)));
  for (const page of doc.pages) {
    for (const block of page.blocks) {
      const seed = seedBlocks.get(block.id);
      if (!seed || seed.type !== block.type) continue;
      const props = block.props as Record<string, unknown>;
      const sprops = seed.props as Record<string, unknown>;
      fillMissing(props, sprops);
      for (const list of ITEM_LISTS) {
        const a = props[list], b = sprops[list];
        if (!Array.isArray(a) || !Array.isArray(b)) continue;
        a.forEach((item, i) => {
          if (item && typeof item === "object" && b[i] && typeof b[i] === "object") fillMissing(item as Record<string, unknown>, b[i] as Record<string, unknown>);
        });
      }
    }
  }
  const f = doc.settings?.footer as Record<string, unknown> | undefined;
  if (f) {
    if (!f.phone) f.phone = SEED.settings.footer.phone;
    if (!f.email) f.email = SEED.settings.footer.email;
    if (typeof f.contactLine === "string" && /\[ add/.test(f.contactLine)) f.contactLine = SEED.settings.footer.contactLine;
  }
  return doc;
}

/**
 * The entire site content is stored as one JSON document in the `site_content`
 * table (id = 'main'). This keeps the editor simple and atomic. Falls back to
 * the seed when Supabase isn't configured or the row doesn't exist yet.
 */
export async function getSiteContent(): Promise<SiteContent> {
  if (!hasSupabase) return SEED;
  try {
    const sb = supabaseAdmin();
    const { data, error } = await sb.from("site_content").select("doc").eq("id", SINGLETON_ID).maybeSingle();
    if (error || !data?.doc) return SEED;
    return withSeedMedia(withNewSeedPages(data.doc as SiteContent));
  } catch {
    return SEED;
  }
}

export async function saveSiteContent(doc: SiteContent): Promise<{ ok: boolean; error?: string }> {
  if (!hasSupabase) return { ok: false, error: "Supabase not configured" };
  try {
    const sb = supabaseAdmin();
    const { error } = await sb
      .from("site_content")
      .upsert({ id: SINGLETON_ID, doc, updated_at: new Date().toISOString() });
    if (error) return { ok: false, error: error.message };
    return { ok: true };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}

export async function getPage(path: string): Promise<PageDoc | undefined> {
  const content = await getSiteContent();
  return content.pages.find((p) => p.path === path);
}

export async function getAllPaths(): Promise<string[]> {
  const content = await getSiteContent();
  return content.pages.map((p) => p.path);
}
