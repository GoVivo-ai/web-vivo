import { NextResponse } from "next/server";
import { hasSupabase } from "@/lib/supabase/config";
import { supabaseAdmin } from "@/lib/supabase/server";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const { name, email, message } = body as Record<string, string>;
  if (!email) return NextResponse.json({ ok: false, error: "email required" }, { status: 400 });
  if (!hasSupabase) {
    console.log("[contact] (no supabase configured)", { name, email, message });
    return NextResponse.json({ ok: true });
  }
  const sb = supabaseAdmin();
  const { error } = await sb.from("contact_messages").insert({ name, email, message });
  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
