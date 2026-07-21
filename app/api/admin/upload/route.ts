import { NextResponse } from "next/server";
import { getAdminState } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase/server";
import { SUPABASE_URL } from "@/lib/supabase/config";

export const dynamic = "force-dynamic";

/** Admin-only image upload → Supabase Storage (public `media` bucket). Returns a public URL. */
export async function POST(req: Request) {
  const state = await getAdminState();
  if (!state.configured || !("user" in state) || !state.user || !state.isAdmin) {
    return NextResponse.json({ ok: false, error: "Not authorized" }, { status: 401 });
  }
  const form = await req.formData().catch(() => null);
  const file = form?.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ ok: false, error: "No file" }, { status: 400 });
  }
  if (file.size > 8 * 1024 * 1024) {
    return NextResponse.json({ ok: false, error: "Max 8 MB" }, { status: 400 });
  }
  const ext = (file.name.split(".").pop() || "bin").toLowerCase().replace(/[^a-z0-9]/g, "");
  const rand = Math.random().toString(36).slice(2, 10);
  const path = `uploads/${Date.now().toString(36)}-${rand}.${ext}`;
  const bytes = new Uint8Array(await file.arrayBuffer());

  const sb = supabaseAdmin();
  const { error } = await sb.storage.from("media").upload(path, bytes, {
    contentType: file.type || "application/octet-stream",
    upsert: true,
  });
  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });

  const url = `${SUPABASE_URL}/storage/v1/object/public/media/${path}`;
  return NextResponse.json({ ok: true, url });
}
