import { NextResponse } from "next/server";
import { getAdminState } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase/server";
import { SUPABASE_URL, hasSupabase } from "@/lib/supabase/config";

export const dynamic = "force-dynamic";

async function guard() {
  const s = await getAdminState();
  return s.configured && "user" in s && !!s.user && s.isAdmin;
}

export async function GET() {
  if (!hasSupabase) return NextResponse.json({ ok: true, items: [] });
  if (!(await guard())) return NextResponse.json({ ok: false, error: "Not authorized" }, { status: 401 });
  const sb = supabaseAdmin();
  const { data, error } = await sb.storage.from("media").list("uploads", { limit: 200, sortBy: { column: "created_at", order: "desc" } });
  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  const items = (data || []).filter((f) => f.id).map((f) => ({
    name: f.name,
    url: `${SUPABASE_URL}/storage/v1/object/public/media/uploads/${f.name}`,
    size: f.metadata?.size,
  }));
  return NextResponse.json({ ok: true, items });
}

export async function DELETE(req: Request) {
  if (!(await guard())) return NextResponse.json({ ok: false, error: "Not authorized" }, { status: 401 });
  const { name } = (await req.json().catch(() => ({}))) as { name?: string };
  if (!name) return NextResponse.json({ ok: false, error: "name required" }, { status: 400 });
  const sb = supabaseAdmin();
  const { error } = await sb.storage.from("media").remove([`uploads/${name}`]);
  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
