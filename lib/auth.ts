import "server-only";
import { supabaseServer } from "./supabase/server";
import { hasSupabase } from "./supabase/config";

export type AdminState =
  | { configured: false }
  | { configured: true; user: null }
  | { configured: true; user: { id: string; email: string }; isAdmin: boolean };

/** Resolve the current admin session + whether they're allowed in the backoffice. */
export async function getAdminState(): Promise<AdminState> {
  if (!hasSupabase) return { configured: false };
  const sb = await supabaseServer();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) return { configured: true, user: null };
  const { data: admin } = await sb.from("admin_users").select("user_id").eq("user_id", user.id).maybeSingle();
  // If no admin_users rows exist at all, treat the first authenticated user as admin
  // (bootstrap). Otherwise require an explicit admin_users record.
  let isAdmin = Boolean(admin);
  if (!isAdmin) {
    const { count } = await sb.from("admin_users").select("user_id", { count: "exact", head: true });
    if ((count ?? 0) === 0) isAdmin = true;
  }
  return { configured: true, user: { id: user.id, email: user.email || "" }, isAdmin };
}
