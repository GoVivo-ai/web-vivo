import { requireAdmin } from "@/lib/adminGuard";
import { Shell } from "@/components/admin/Shell";
import { hasSupabase } from "@/lib/supabase/config";
import { supabaseAdmin } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function Submissions() {
  const { email, configured } = await requireAdmin();

  let messages: any[] = [];
  let applications: any[] = [];
  if (hasSupabase) {
    const sb = supabaseAdmin();
    const [m, a] = await Promise.all([
      sb.from("contact_messages").select("*").order("created_at", { ascending: false }).limit(100),
      sb.from("applications").select("*").order("created_at", { ascending: false }).limit(100),
    ]);
    messages = m.data || [];
    applications = a.data || [];
  }
  const fmt = (d: string) => new Date(d).toLocaleString();

  return (
    <Shell email={email} title="Submissions">
      {!configured && <div className="adm-notice" style={{ marginTop: 0 }}>Connect Supabase to collect submissions.</div>}

      <div className="wp-panel">
        <h2>Messages &amp; call requests ({messages.length})</h2>
        {messages.length === 0 ? <div className="wp-row"><span className="s">No messages yet.</span></div> : messages.map((m) => (
          <div className="wp-row" key={m.id}>
            <div>
              <div className="t">{m.name || "—"} · <span className="s">{m.email}</span></div>
              <div className="s">{m.message}</div>
            </div>
            <div className="sp" />
            <span className="s">{fmt(m.created_at)}</span>
          </div>
        ))}
      </div>

      <div className="wp-panel">
        <h2>Applications ({applications.length})</h2>
        {applications.length === 0 ? <div className="wp-row"><span className="s">No applications yet.</span></div> : applications.map((a) => (
          <div className="wp-row" key={a.id}>
            <div>
              <div className="t">{a.first_name} {a.last_name} · <span className="s">{a.role}</span></div>
              <div className="s">{a.email} · {a.phone} · English {a.english}</div>
              {a.story && <div className="s">{a.story}</div>}
            </div>
            <div className="sp" />
            <span className="s">{fmt(a.created_at)}</span>
          </div>
        ))}
      </div>
    </Shell>
  );
}
