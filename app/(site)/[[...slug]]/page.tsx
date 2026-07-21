import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getSiteContent } from "@/lib/content/store";
import { SiteChrome } from "@/components/site/SiteChrome";
import { BlocksView } from "@/components/blocks/render";

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
  const page = pages.find((p) => p.path === pathFromSlug(slug));
  if (!page) return {};
  return {
    title: page.path === "/" ? undefined : page.title,
    description: page.description,
  };
}

export default async function Page({ params }: { params: Promise<{ slug?: string[] }> }) {
  const { slug } = await params;
  const content = await getSiteContent();
  const page = content.pages.find((p) => p.path === pathFromSlug(slug));
  if (!page) notFound();
  return (
    <SiteChrome settings={content.settings} activeGroup={page.navGroup}>
      <BlocksView blocks={page.blocks} />
    </SiteChrome>
  );
}
