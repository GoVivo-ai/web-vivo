import { requireAdmin } from "@/lib/adminGuard";
import { Topbar } from "@/components/admin/Topbar";
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
    <>
      <Topbar email={email} active="subs" />
      <div className="adm-wrap">
        <h1>Submissions</h1>
        {!configured && <div className="adm-notice">Connect Supabase to collect and view form submissions.</div>}

        <h2 className="sec">Messages &amp; call requests ({messages.length})</h2>
        {messages.length === 0 ? <p className="muted">No messages yet.</p> : (
          <div className="adm-cards">
            {messages.map((m) => (
              <div className="adm-card" key={m.id}>
                <div className="t">{m.name || "—"}</div>
                <div className="p">{m.email}</div>
                <div className="p" style={{ marginTop: 8 }}>{m.message}</div>
                <div className="path">{fmt(m.created_at)}</div>
              </div>
            ))}
          </div>
        )}

        <h2 className="sec">Applications ({applications.length})</h2>
        {applications.length === 0 ? <p className="muted">No applications yet.</p> : (
          <div className="adm-cards">
            {applications.map((a) => (
              <div className="adm-card" key={a.id}>
                <div className="t">{a.first_name} {a.last_name}</div>
                <div className="p">{a.role} · English {a.english}</div>
                <div className="p">{a.email} · {a.phone}</div>
                {a.story && <div className="p" style={{ marginTop: 8 }}>{a.story}</div>}
                <div className="path">{fmt(a.created_at)}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
