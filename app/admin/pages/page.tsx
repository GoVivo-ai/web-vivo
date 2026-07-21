import Link from "next/link";
import { requireAdmin } from "@/lib/adminGuard";
import { Shell } from "@/components/admin/Shell";
import { getSiteContent } from "@/lib/content/store";

export const dynamic = "force-dynamic";

export default async function PagesList() {
  const { email } = await requireAdmin();
  const content = await getSiteContent();
  return (
    <Shell email={email} title="Pages">
      <p className="muted" style={{ marginBottom: 18 }}>Every page of the website. Click one to edit it in the visual editor.</p>
      <div className="wp-panel">
        {content.pages.map((p) => (
          <div className="wp-row" key={p.path}>
            <div><div className="t">{p.title}</div><div className="path">{p.path}</div></div>
            <div className="sp" />
            <span className="s">{p.blocks.length} sections</span>
            <Link className="adm-btn ghost sm" href={`/admin/editor?path=${encodeURIComponent(p.path)}`}>Edit</Link>
            <Link className="adm-btn ghost sm" href={p.path} target="_blank">View ↗</Link>
          </div>
        ))}
      </div>
    </Shell>
  );
}
