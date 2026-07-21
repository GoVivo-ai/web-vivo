import { NextResponse } from "next/server";
import { hasSupabase } from "@/lib/supabase/config";
import { supabaseAdmin } from "@/lib/supabase/server";

export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as Record<string, string>;
  const { role, first_name, last_name, email, phone, linkedin, english, experience, story } = body;
  if (!email) return NextResponse.json({ ok: false, error: "email required" }, { status: 400 });
  if (!hasSupabase) {
    console.log("[apply] (no supabase configured)", body);
    return NextResponse.json({ ok: true });
  }
  const sb = supabaseAdmin();
  const { error } = await sb.from("applications").insert({ role, first_name, last_name, email, phone, linkedin, english, experience, story });
  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
