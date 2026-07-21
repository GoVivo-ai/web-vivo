import "server-only";
import { SEED } from "./seed";
import type { SiteContent, PageDoc } from "@/lib/blocks/types";
import { hasSupabase } from "@/lib/supabase/config";
import { supabaseAdmin } from "@/lib/supabase/server";

const SINGLETON_ID = "main";

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
    return data.doc as SiteContent;
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
