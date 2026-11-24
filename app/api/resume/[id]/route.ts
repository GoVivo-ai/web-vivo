import { NextResponse } from "next/server";
import { getAdminState } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase/server";
import { RESUME_SIGNED_TTL } from "@/lib/resume-link";

export const dynamic = "force-dynamic";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Opens a candidate's résumé. Only a signed-in backoffice admin gets through,
 * and what they get is a signed URL that expires in 15 minutes (legal v1,
 * doc 05 §6). Anyone else is sent to the login, then back here.
 */
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!UUID.test(id)) return NextResponse.json({ ok: false, error: "not found" }, { status: 404 });

  const s = await getAdminState();
  if (!s.configured) return NextResponse.json({ ok: false, error: "not configured" }, { status: 503 });
  if (!s.user || !s.isAdmin) {
    const login = new URL("/admin/login", req.url);
    login.searchParams.set("next", `/api/resume/${id}`);
    if (s.user) login.searchParams.set("denied", "1");
    return NextResponse.redirect(login, { headers: { "cache-control": "no-store" } });
  }

  const sb = supabaseAdmin();
  const { data: app } = await sb.from("applications").select("resume_path").eq("id", id).maybeSingle();
  if (!app?.resume_path) return NextResponse.json({ ok: false, error: "not found" }, { status: 404 });

  const { data } = await sb.storage.from("applications").createSignedUrl(app.resume_path, RESUME_SIGNED_TTL);
  if (!data?.signedUrl) return NextResponse.json({ ok: false, error: "could not open the resume" }, { status: 500 });
  return NextResponse.redirect(data.signedUrl, { headers: { "cache-control": "no-store" } });
}
