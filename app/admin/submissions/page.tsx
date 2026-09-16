import { requireAdmin } from "@/lib/adminGuard";
import { Shell } from "@/components/admin/Shell";
import { SubmissionsList } from "@/components/admin/SubmissionsList";
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
      sb.from("contact_messages").select("*").order("created_at", { ascending: false }).limit(500),
      sb.from("applications").select("*").order("created_at", { ascending: false }).limit(500),
    ]);
    messages = m.data || [];
    applications = a.data || [];

    // Resumes live in a private bucket; hand the client short-lived signed URLs.
    const paths = applications.map((a) => a.resume_path).filter(Boolean) as string[];
    if (paths.length) {
      const { data: signed } = await sb.storage.from("applications").createSignedUrls(paths, 60 * 60);
      const byPath = new Map((signed || []).map((s) => [s.path, s.signedUrl]));
      applications = applications.map((a) => ({ ...a, resume_url: byPath.get(a.resume_path) || null }));
    }
  }

  return (
    <Shell email={email} title="Submissions">
      {!configured && <div className="adm-notice" style={{ marginTop: 0 }}>Connect Supabase to collect submissions.</div>}
      <SubmissionsList messages={messages} applications={applications} />
    </Shell>
  );
}
