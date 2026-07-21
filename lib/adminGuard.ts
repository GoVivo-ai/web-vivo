import "server-only";
import { redirect } from "next/navigation";
import { getAdminState } from "./auth";

/** Use at the top of every protected admin page. Returns the admin's email. */
export async function requireAdmin(): Promise<{ email: string; configured: boolean }> {
  const state = await getAdminState();
  if (!state.configured) return { email: "", configured: false };
  if (!state.user) redirect("/admin/login");
  if (!state.isAdmin) redirect("/admin/login?denied=1");
  return { email: state.user.email, configured: true };
}
