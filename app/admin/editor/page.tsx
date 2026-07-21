import Link from "next/link";
import { requireAdmin } from "@/lib/adminGuard";
import { getSiteContent } from "@/lib/content/store";
import { Editor } from "./Editor";

export const dynamic = "force-dynamic";

export default async function EditorPage({ searchParams }: { searchParams: Promise<{ path?: string }> }) {
  const { configured } = await requireAdmin();
  const { path } = await searchParams;
  const content = await getSiteContent();
  const initialPath = content.pages.some((p) => p.path === path) ? path! : content.pages[0].path;

  return (
    <>
      <div className="adm-topbar">
        <Link href="/admin" className="brand" style={{ color: "#fff", display: "inline-flex", alignItems: "center", gap: 8 }}>← <span>Admin</span></Link>
        <span className="who">Visual editor · click any text or image on the page to edit it</span>
        <div className="sp" />
        <Link href="/" target="_blank">View site ↗</Link>
      </div>
      <Editor initial={content} initialPath={initialPath} canSave={configured} />
    </>
  );
}
