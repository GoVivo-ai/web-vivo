import { NextResponse } from "next/server";
import { getAdminState } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

async function guard() {
  const s = await getAdminState();
  if (!s.configured || !("user" in s) || !s.user || !s.isAdmin) return false;
  return true;
}

/** List all auth users + whether each is an admin. */
export async function GET() {
  if (!(await guard())) return NextResponse.json({ ok: false, error: "Not authorized" }, { status: 401 });
  const sb = supabaseAdmin();
  const { data, error } = await sb.auth.admin.listUsers({ page: 1, perPage: 200 });
  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  const { data: admins } = await sb.from("admin_users").select("user_id");
  const adminSet = new Set((admins || []).map((a) => a.user_id));
  const users = data.users.map((u) => ({
    id: u.id,
    email: u.email,
    created_at: u.created_at,
    last_sign_in_at: u.last_sign_in_at,
    isAdmin: adminSet.has(u.id),
  }));
  return NextResponse.json({ ok: true, users });
}

/** Create a new user (optionally admin). */
export async function POST(req: Request) {
  if (!(await guard())) return NextResponse.json({ ok: false, error: "Not authorized" }, { status: 401 });
  const { email, password, makeAdmin } = (await req.json().catch(() => ({}))) as { email?: string; password?: string; makeAdmin?: boolean };
  if (!email || !password) return NextResponse.json({ ok: false, error: "Email and password required" }, { status: 400 });
  if (password.length < 8) return NextResponse.json({ ok: false, error: "Password must be at least 8 characters" }, { status: 400 });
  const sb = supabaseAdmin();
  const { data, error } = await sb.auth.admin.createUser({ email, password, email_confirm: true });
  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  if (makeAdmin && data.user) await sb.from("admin_users").upsert({ user_id: data.user.id, email });
  return NextResponse.json({ ok: true });
}

/** Toggle admin rights or reset password. body: { id, admin?, password? } */
export async function PATCH(req: Request) {
  if (!(await guard())) return NextResponse.json({ ok: false, error: "Not authorized" }, { status: 401 });
  const { id, admin, password, email } = (await req.json().catch(() => ({}))) as { id?: string; admin?: boolean; password?: string; email?: string };
  if (!id) return NextResponse.json({ ok: false, error: "id required" }, { status: 400 });
  const sb = supabaseAdmin();
  if (typeof admin === "boolean") {
    if (admin) await sb.from("admin_users").upsert({ user_id: id, email });
    else await sb.from("admin_users").delete().eq("user_id", id);
  }
  if (password) {
    if (password.length < 8) return NextResponse.json({ ok: false, error: "Password too short" }, { status: 400 });
    const { error } = await sb.auth.admin.updateUserById(id, { password });
    if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}

/** Delete a user. body: { id } */
export async function DELETE(req: Request) {
  if (!(await guard())) return NextResponse.json({ ok: false, error: "Not authorized" }, { status: 401 });
  const state = await getAdminState();
  const { id } = (await req.json().catch(() => ({}))) as { id?: string };
  if (!id) return NextResponse.json({ ok: false, error: "id required" }, { status: 400 });
  if ("user" in state && state.user?.id === id) return NextResponse.json({ ok: false, error: "You can't delete your own account" }, { status: 400 });
  const sb = supabaseAdmin();
  await sb.from("admin_users").delete().eq("user_id", id);
  const { error } = await sb.auth.admin.deleteUser(id);
  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
