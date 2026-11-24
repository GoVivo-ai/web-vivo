import type { Metadata } from "next";
import { getSiteContent } from "@/lib/content/store";
import { loadLegalDoc, LEGAL_DOCS, type LegalSlug } from "@/lib/legal";
import { SITE_URL } from "@/lib/seo";
import { SiteChrome } from "./SiteChrome";

export function legalMetadata(slug: LegalSlug): Metadata {
  const title = LEGAL_DOCS[slug];
  return {
    title,
    description: `${title} for Go Vivo Inc. (govivo.ai).`,
    alternates: { canonical: `${SITE_URL}/${slug}` },
  };
}

export async function LegalPage({ slug }: { slug: LegalSlug }) {
  const [content, doc] = await Promise.all([getSiteContent(), loadLegalDoc(slug)]);
  return (
    <SiteChrome settings={content.settings} activeGroup={null}>
      <section className="section section--navy on-dark legal-hero">
        <div className="container narrow">
          <span className="eyebrow">Legal</span>
          <h1>{doc.title}</h1>
        </div>
      </section>
      <section className="section legal-section">
        <div className="container narrow">
          <article className="legal-doc" dangerouslySetInnerHTML={{ __html: doc.html }} />
        </div>
      </section>
    </SiteChrome>
  );
}
