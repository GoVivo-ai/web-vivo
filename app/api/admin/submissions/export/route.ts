import { getAdminState } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase/server";
import { toCsv } from "@/lib/leads";
import { resumeLink } from "@/lib/resume-link";

export const dynamic = "force-dynamic";

const BATCH = 1000;

const EXPORTS = {
  messages: { table: "contact_messages", columns: ["created_at", "name", "email", "message"] },
  applications: {
    table: "applications",
    columns: ["created_at", "first_name", "last_name", "email", "phone", "role", "linkedin", "english", "experience", "story", "source", "resume_name", "resume_url"],
  },
} as const;

const fail = (status: number, error: string) => Response.json({ ok: false, error }, { status });

export async function GET(req: Request) {
  const s = await getAdminState();
  if (!s.configured) return fail(400, "Supabase not configured");
  if (!s.user || !s.isAdmin) return fail(401, "Not authorized");

  const type = new URL(req.url).searchParams.get("type");
  if (type !== "messages" && type !== "applications") return fail(400, "type must be messages or applications");
  const { table, columns } = EXPORTS[type];

  const sb = supabaseAdmin();
  let rows: Record<string, any>[] = [];
  for (let from = 0; ; from += BATCH) {
    const { data, error } = await sb.from(table).select("*").order("created_at", { ascending: false }).range(from, from + BATCH - 1);
    if (error) return fail(500, error.message);
    rows = rows.concat(data || []);
    if (!data || data.length < BATCH) break;
  }

  if (type === "applications") {
    // Never bucket URLs in a file that gets forwarded: each link asks for a
    // backoffice login and then opens a 15-minute signed URL.
    rows = rows.map((r) => ({ ...r, resume_url: r.resume_path ? resumeLink(r.id, req) : "" }));
  }

  const day = new Date().toISOString().slice(0, 10);
  return new Response(toCsv([...columns], rows), {
    headers: {
      "content-type": "text/csv; charset=utf-8",
      "content-disposition": `attachment; filename="vivo-${type}-${day}.csv"`,
      "cache-control": "no-store",
    },
  });
}
