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
    return withNewSeedPages(data.doc as SiteContent);
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
