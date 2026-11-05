import { getAdminState } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase/server";
import { toCsv } from "@/lib/leads";

export const dynamic = "force-dynamic";

const BATCH = 1000;
const RESUME_LINK_TTL = 60 * 60 * 24 * 7;

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
    const paths = rows.map((r) => r.resume_path).filter(Boolean) as string[];
    const links = new Map<string, string>();
    for (let i = 0; i < paths.length; i += BATCH) {
      const { data } = await sb.storage.from("applications").createSignedUrls(paths.slice(i, i + BATCH), RESUME_LINK_TTL);
      for (const l of data || []) if (l.path && l.signedUrl) links.set(l.path, l.signedUrl);
    }
    rows = rows.map((r) => ({ ...r, resume_url: links.get(r.resume_path) || "" }));
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
