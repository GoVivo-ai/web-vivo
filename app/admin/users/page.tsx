import { requireAdmin } from "@/lib/adminGuard";
import { getAdminState } from "@/lib/auth";
import { Shell } from "@/components/admin/Shell";
import { UsersManager } from "./UsersManager";

export const dynamic = "force-dynamic";

export default async function UsersPage() {
  const { email } = await requireAdmin();
  const state = await getAdminState();
  const selfId = "user" in state && state.user ? state.user.id : "";
  return (
    <Shell email={email} title="Users">
      <p className="muted" style={{ marginBottom: 18 }}>Create logins for your team and control who can access the admin. Admins can edit the website and manage everything here.</p>
      <UsersManager selfId={selfId} />
    </Shell>
  );
}
