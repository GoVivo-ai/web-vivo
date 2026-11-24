import { NextResponse } from "next/server";
import { hasSupabase } from "@/lib/supabase/config";
import { supabaseAdmin } from "@/lib/supabase/server";
import { fireContactCreated } from "@/lib/webhooks";
import { contactLead } from "@/lib/leads";
import { CONSENT_TEXT } from "@/lib/consent-texts";
import { checked, recordConsents, requestEvidence } from "@/lib/consents";

export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  const s = (k: string) => (typeof body[k] === "string" ? (body[k] as string).trim() : "");
  const name = s("name");
  const email = s("email");
  const message = s("message");
  const phone = s("phone") || null;
  const sms = checked(body.sms_consent);
  const emailMarketing = checked(body.email_marketing_consent);

  if (!email) return NextResponse.json({ ok: false, error: "email required" }, { status: 400 });
  // SMS consent is optional, but it means nothing without a number to text.
  if (sms && !phone) return NextResponse.json({ ok: false, error: "phone required to receive text messages" }, { status: 400 });

  if (!hasSupabase) {
    console.log("[contact] (no supabase configured)", { name, email, phone, message, sms, emailMarketing });
    return NextResponse.json({ ok: true });
  }
  const sb = supabaseAdmin();
  const { data, error } = await sb.from("contact_messages").insert({ name, email, phone, message }).select().single();
  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });

  // No proof of consent, no submission: the row goes if its consents can't be stored.
  const consentError = await recordConsents(
    sb,
    {
      form_id: "contact",
      submission_id: data.id,
      email,
      marketing_cookies: checked(body.marketing_consent),
      evidence: requestEvidence(req, body.page_url),
    },
    [
      { type: "sms", textId: CONSENT_TEXT.sms, granted: sms, phone },
      { type: "email_marketing", textId: CONSENT_TEXT.emailMarketing, granted: emailMarketing },
      { type: "notice", textId: CONSENT_TEXT.contactNotice, granted: true },
    ],
  );
  if (consentError) {
    console.error("[contact] consents insert failed:", consentError);
    await sb.from("contact_messages").delete().eq("id", data.id);
    return NextResponse.json({ ok: false, error: "could not save your message" }, { status: 500 });
  }

  await fireContactCreated(contactLead(data));
  return NextResponse.json({ ok: true });
}
