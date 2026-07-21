import { requireAdmin } from "@/lib/adminGuard";
import { Shell } from "@/components/admin/Shell";
import { MediaLibrary } from "./MediaLibrary";

export const dynamic = "force-dynamic";

export default async function MediaPage() {
  const { email } = await requireAdmin();
  return (
    <Shell email={email} title="Media">
      <p className="muted" style={{ marginBottom: 18 }}>All images uploaded to the site. Copy a URL to reuse it, or upload new photos.</p>
      <MediaLibrary />
    </Shell>
  );
}
