import { requireAdmin } from "@/lib/adminGuard";
import { Topbar } from "@/components/admin/Topbar";
import { getSiteContent } from "@/lib/content/store";
import { Editor } from "./Editor";

export const dynamic = "force-dynamic";

export default async function EditorPage({ searchParams }: { searchParams: Promise<{ path?: string }> }) {
  const { email, configured } = await requireAdmin();
  const { path } = await searchParams;
  const content = await getSiteContent();
  const initialPath = content.pages.some((p) => p.path === path) ? path! : content.pages[0].path;

  return (
    <>
      <Topbar email={email} active="editor" />
      <Editor initial={content} initialPath={initialPath} canSave={configured} />
    </>
  );
}
