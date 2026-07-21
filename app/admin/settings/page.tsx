import { requireAdmin } from "@/lib/adminGuard";
import { Shell } from "@/components/admin/Shell";
import { getSiteContent } from "@/lib/content/store";
import { SettingsEditor } from "./SettingsEditor";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const { email, configured } = await requireAdmin();
  const content = await getSiteContent();
  return (
    <Shell email={email} title="Settings">
      <p className="muted" style={{ marginBottom: 18 }}>Global header, navigation and footer — shown on every page.</p>
      <SettingsEditor initial={content} canSave={configured} />
    </Shell>
  );
}
