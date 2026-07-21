import { NextResponse } from "next/server";
import { getAdminState } from "@/lib/auth";
import { saveSiteContent } from "@/lib/content/store";
import type { SiteContent } from "@/lib/blocks/types";

export async function POST(req: Request) {
  const state = await getAdminState();
  if (!state.configured) return NextResponse.json({ ok: false, error: "Supabase not configured" }, { status: 400 });
  if (!state.user || !state.isAdmin) return NextResponse.json({ ok: false, error: "Not authorized" }, { status: 401 });

  const doc = (await req.json().catch(() => null)) as SiteContent | null;
  if (!doc || !Array.isArray(doc.pages)) return NextResponse.json({ ok: false, error: "Invalid document" }, { status: 400 });

  const res = await saveSiteContent(doc);
  if (!res.ok) return NextResponse.json(res, { status: 500 });
  return NextResponse.json({ ok: true });
}
