import { requireAdmin } from "@/lib/adminGuard";
import { Shell } from "@/components/admin/Shell";
import { getSiteContent } from "@/lib/content/store";
import { getIntegrations } from "@/lib/integrations";
import { SettingsEditor } from "./SettingsEditor";
import { IntegrationsEditor } from "./IntegrationsEditor";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const { email, configured } = await requireAdmin();
  const content = await getSiteContent();
  const i = await getIntegrations();
  return (
    <Shell email={email} title="Settings">
      <p className="muted" style={{ marginBottom: 18 }}>Global header, navigation and footer — shown on every page.</p>
      <SettingsEditor initial={content} canSave={configured} />
      {/* Secrets stay on the server; the browser only learns whether one is set. */}
      <IntegrationsEditor
        canSave={configured}
        initial={{
          ready: i.ready,
          crmWebhookUrl: i.crmWebhookUrl || "",
          hasCrmSecret: !!i.crmWebhookSecret,
          leadWebhookUrl: i.leadWebhookUrl || "",
          hasLeadSecret: !!i.leadWebhookSecret,
        }}
      />
    </Shell>
  );
}
