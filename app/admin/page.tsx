import Link from "next/link";
import { requireAdmin } from "@/lib/adminGuard";
import { Shell } from "@/components/admin/Shell";
import { getSiteContent } from "@/lib/content/store";
import { hasSupabase } from "@/lib/supabase/config";
import { supabaseAdmin } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function Dashboard() {
  const { email, configured } = await requireAdmin();
  const content = await getSiteContent();

  let msgs = 0, apps = 0;
  if (hasSupabase) {
    const sb = supabaseAdmin();
    const [m, a] = await Promise.all([
      sb.from("contact_messages").select("id", { count: "exact", head: true }),
      sb.from("applications").select("id", { count: "exact", head: true }),
    ]);
    msgs = m.count ?? 0;
    apps = a.count ?? 0;
  }

  return (
    <Shell email={email} title="Dashboard" actions={<Link className="adm-btn" href="/admin/editor"><span>Open visual editor</span></Link>}>
      {!configured && (
        <div className="adm-notice" style={{ marginTop: 0, marginBottom: 20 }}>
          <b>Supabase not connected.</b> The site runs on seed content and changes can&apos;t be saved. Add your Supabase env vars and run the migration to enable editing.
        </div>
      )}
      <div className="wp-stat-row">
        <div className="wp-stat"><div className="n">{content.pages.length}</div><div className="l">Pages</div></div>
        <div className="wp-stat"><div className="n">{content.pages.reduce((a, p) => a + p.blocks.length, 0)}</div><div className="l">Sections</div></div>
        <div className="wp-stat"><div className="n">{msgs}</div><div className="l">Messages</div></div>
        <div className="wp-stat"><div className="n">{apps}</div><div className="l">Applications</div></div>
      </div>

      <div className="wp-panel">
        <h2>Recent pages</h2>
        {content.pages.slice(0, 6).map((p) => (
          <Link key={p.path} href={`/admin/editor?path=${encodeURIComponent(p.path)}`} className="wp-row" style={{ textDecoration: "none" }}>
            <div><div className="t">{p.title}</div><div className="path">{p.path}</div></div>
            <div className="sp" />
            <span className="s">{p.blocks.length} sections</span>
          </Link>
        ))}
      </div>

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <Link className="adm-btn ghost" href="/admin/pages">All pages</Link>
        <Link className="adm-btn ghost" href="/admin/users">Manage users</Link>
        <Link className="adm-btn ghost" href="/admin/submissions">Submissions</Link>
        <Link className="adm-btn ghost" href="/" target="_blank">View site ↗</Link>
      </div>
    </Shell>
  );
}
