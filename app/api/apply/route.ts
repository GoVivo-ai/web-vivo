import { NextResponse } from "next/server";
import { hasSupabase } from "@/lib/supabase/config";
import { supabaseAdmin } from "@/lib/supabase/server";
import { fireWebhook } from "@/lib/webhooks";

export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as Record<string, string>;
  const { role, first_name, last_name, email, phone, linkedin, english, experience, story } = body;
  // Everything except the role-specific questions (experience, story) is required.
  const required = { first_name, last_name, email, phone, linkedin, english };
  const missing = Object.entries(required).filter(([, v]) => !v?.trim()).map(([k]) => k);
  if (missing.length) return NextResponse.json({ ok: false, error: `required: ${missing.join(", ")}` }, { status: 400 });
  if (!hasSupabase) {
    console.log("[apply] (no supabase configured)", body);
    return NextResponse.json({ ok: true });
  }
  const sb = supabaseAdmin();
  const { data, error } = await sb
    .from("applications")
    .insert({ role, first_name, last_name, email, phone, linkedin, english, experience, story })
    .select()
    .single();
  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  await fireWebhook("application.created", data);
  return NextResponse.json({ ok: true });
}
