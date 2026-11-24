import { requireAdmin } from "@/lib/adminGuard";
import { Shell } from "@/components/admin/Shell";
import { SubmissionsList } from "@/components/admin/SubmissionsList";
import { hasSupabase } from "@/lib/supabase/config";
import { supabaseAdmin } from "@/lib/supabase/server";
import { resumeLink } from "@/lib/resume-link";

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

    // Resumes live in a private bucket; each link signs a 15-minute URL on click.
    applications = applications.map((a) => ({ ...a, resume_url: a.resume_path ? resumeLink(a.id) : null }));
  }

  return (
    <Shell email={email} title="Submissions">
      {!configured && <div className="adm-notice" style={{ marginTop: 0 }}>Connect Supabase to collect submissions.</div>}
      <SubmissionsList messages={messages} applications={applications} />
    </Shell>
  );
}
