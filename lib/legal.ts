import { readFile } from "node:fs/promises";
import path from "node:path";
import { marked } from "marked";

/**
 * Legal documents live as Markdown in content/legal, outside the CMS, so their
 * wording only changes through a reviewed commit — never from /admin.
 */
export const LEGAL_DOCS = {
  "privacy-policy": "Privacy Policy",
  "cookie-policy": "Cookie Policy",
  "candidate-privacy-notice": "Candidate Privacy Notice",
  terms: "Website Terms of Use",
  "sms-terms": "SMS Terms",
  "platform-terms": "Platform Terms of Service",
  subprocessors: "Subprocessors",
} as const;

export type LegalSlug = keyof typeof LEGAL_DOCS;

/**
 * Written but not live yet. Subprocessors waits on the website database's
 * hosting region. Remove a slug from here to publish it.
 */
const HELD: ReadonlySet<LegalSlug> = new Set<LegalSlug>(["subprocessors"]);

export function isPublished(slug: LegalSlug): boolean {
  return !HELD.has(slug);
}

export async function loadLegalDoc(slug: LegalSlug): Promise<{ title: string; html: string }> {
  const file = path.join(process.cwd(), "content", "legal", `${slug}.md`);
  const md = await readFile(file, "utf8");
  // The first "# " line is the page title; it goes in the hero, not the body.
  const [first, ...rest] = md.split("\n");
  const title = first.startsWith("# ") ? first.slice(2).trim() : LEGAL_DOCS[slug];
  const body = first.startsWith("# ") ? rest.join("\n") : md;
  const html = await marked.parse(body, { gfm: true, breaks: true });
  return { title, html: openLegalLinksInNewTab(html) };
}

/** Links to other legal pages open in a new tab, as the consent copy requires. */
function openLegalLinksInNewTab(html: string): string {
  return html.replace(/<a href="(https?:\/\/[^"]+)"/g, '<a href="$1" target="_blank" rel="noopener noreferrer"');
}
