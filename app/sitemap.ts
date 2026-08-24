import type { MetadataRoute } from "next";
import { getSiteContent } from "@/lib/content/store";
import { SITE_URL } from "@/lib/seo";

export const dynamic = "force-dynamic";

/** Priority by depth: home first, then top-level pages, then articles/roles. */
function priority(path: string): number {
  if (path === "/") return 1;
  if (path === "/book") return 0.9;
  return path.slice(1).includes("/") ? 0.6 : 0.8;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { pages } = await getSiteContent();
  const lastModified = new Date();
  return pages.map((p) => ({
    url: `${SITE_URL}${p.path === "/" ? "" : p.path}`,
    lastModified,
    changeFrequency: p.path.startsWith("/insights/") ? "yearly" : "monthly",
    priority: priority(p.path),
  }));
}
