import Link from "next/link";
import { requireAdmin } from "@/lib/adminGuard";
import { Topbar } from "@/components/admin/Topbar";
import { getSiteContent } from "@/lib/content/store";
import { hasSupabase } from "@/lib/supabase/config";

export const dynamic = "force-dynamic";

export default async function Dashboard() {
  const { email, configured } = await requireAdmin();
  const content = await getSiteContent();

  return (
    <>
      <Topbar email={email} active="dash" />
      <div className="adm-wrap">
        <h1>Pages</h1>
        <p className="muted">Every page and section of the Vivo website is editable here. Open a page to edit it in the visual editor.</p>

        {!configured && (
          <div className="adm-notice">
            <b>Read-only preview.</b> Supabase isn&apos;t connected, so changes can&apos;t be saved yet. Add your
            Supabase env vars and run <code>supabase/migrations/0001_init.sql</code> to enable editing and persistence.
          </div>
        )}

        <div className="adm-cards">
          {content.pages.map((p) => (
            <Link key={p.path} href={`/admin/editor?path=${encodeURIComponent(p.path)}`} className="adm-card">
              <div className="t">{p.title}</div>
              <div className="p">{p.blocks.length} section{p.blocks.length === 1 ? "" : "s"}</div>
              <div className="path">{p.path}</div>
            </Link>
          ))}
        </div>

        <h2 className="sec">Quick links</h2>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <Link className="adm-btn ghost" href="/admin/editor">Open visual editor</Link>
          <Link className="adm-btn ghost" href="/admin/submissions">View submissions</Link>
          <Link className="adm-btn ghost" href="/" target="_blank">Open live site ↗</Link>
        </div>
      </div>
    </>
  );
}
