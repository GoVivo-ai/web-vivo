import { NextResponse } from "next/server";
import { hasSupabase } from "@/lib/supabase/config";

export const dynamic = "force-dynamic";

export function GET() {
  return NextResponse.json({ ok: true, supabase: hasSupabase });
}
