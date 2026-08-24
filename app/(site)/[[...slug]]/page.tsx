import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getSiteContent } from "@/lib/content/store";
import { SiteChrome } from "@/components/site/SiteChrome";
import { BlocksView } from "@/components/blocks/render";
import { SITE_URL, OG_IMAGE } from "@/lib/seo";

export const dynamic = "force-dynamic";

function pathFromSlug(slug?: string[]): string {
  if (!slug || slug.length === 0) return "/";
  return "/" + slug.join("/");
}

export async function generateStaticParams() {
  const { pages } = await getSiteContent();
  return pages.map((p) => ({ slug: p.path === "/" ? [] : p.path.slice(1).split("/") }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug?: string[] }> }): Promise<Metadata> {
  const { slug } = await params;
  const { pages } = await getSiteContent();
  const path = pathFromSlug(slug);
  const page = pages.find((p) => p.path === path);
  if (!page) return {};
  const article = page.blocks.find((b) => b.type === "article")?.props as Record<string, any> | undefined;
  const title = page.path === "/" ? "Vivo — Get your time back without letting go of your business" : `${page.title} · Vivo`;
  const image = (article?.image as string) || OG_IMAGE;
  const url = `${SITE_URL}${path === "/" ? "" : path}`;
  return {
    title: page.path === "/" ? undefined : page.title,
    description: page.description,
    alternates: { canonical: url },
    openGraph: {
      type: article ? "article" : "website",
      url,
      siteName: "Vivo",
      title,
      description: page.description,
      images: [{ url: image, alt: (article?.imageAlt as string) || "Vivo" }],
      ...(article?.date ? { publishedTime: new Date(article.date as string).toISOString() } : {}),
    },
    twitter: { card: "summary_large_image", title, description: page.description, images: [image] },
  };
}

/** Article schema so insight posts can show up as articles, not loose pages. */
function articleJsonLd(path: string, page: { title: string; description?: string }, a: Record<string, any>) {
  const published = a.date ? new Date(a.date as string) : undefined;
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: (a.title as string) || page.title,
    description: page.description,
    image: [`${SITE_URL}${a.image}`],
    ...(published && !isNaN(published.getTime()) ? { datePublished: published.toISOString() } : {}),
    author: { "@type": "Organization", name: "Vivo", url: SITE_URL },
    publisher: { "@type": "Organization", name: "Vivo", url: SITE_URL },
    mainEntityOfPage: { "@type": "WebPage", "@id": `${SITE_URL}${path}` },
  };
}

export default async function Page({ params }: { params: Promise<{ slug?: string[] }> }) {
  const { slug } = await params;
  const path = pathFromSlug(slug);
  const content = await getSiteContent();
  const page = content.pages.find((p) => p.path === path);
  if (!page) notFound();
  const article = page.blocks.find((b) => b.type === "article")?.props as Record<string, any> | undefined;
  return (
    <SiteChrome settings={content.settings} activeGroup={page.navGroup}>
      {article && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd(path, page, article)) }}
        />
      )}
      <BlocksView blocks={page.blocks} />
    </SiteChrome>
  );
}
