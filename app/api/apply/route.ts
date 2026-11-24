import { NextResponse } from "next/server";
import { hasSupabase } from "@/lib/supabase/config";
import { supabaseAdmin } from "@/lib/supabase/server";
import { fireApplicationCreated } from "@/lib/webhooks";
import { applicationLead } from "@/lib/leads";
import { sendEmail, esc } from "@/lib/email";
import { CONSENT_TEXT, RESUME_MAX_BYTES, RESUME_TYPES } from "@/lib/consent-texts";
import { checked, recordConsents, requestEvidence } from "@/lib/consents";
import { resumeLink } from "@/lib/resume-link";

export async function POST(req: Request) {
  const form = await req.formData().catch(() => null);
  if (!form) {
    return NextResponse.json({ ok: false, error: "expected multipart/form-data" }, { status: 400 });
  }

  const str = (k: string) => {
    const v = form.get(k);
    return typeof v === "string" ? v.trim() : "";
  };
  const role = str("role");
  const first_name = str("first_name");
  const last_name = str("last_name");
  const email = str("email");
  const phone = str("phone");
  const linkedin = str("linkedin");
  const english = str("english");
  const experience = str("experience");
  const story = str("story");
  const careersAuth = checked(form.get("careers_auth"));
  const careersPool = checked(form.get("careers_pool"));

  // Everything except the role-specific questions (experience, story) is required.
  const required = { first_name, last_name, email, phone, linkedin, english };
  const missing = Object.entries(required).filter(([, v]) => !v).map(([k]) => k);

  const resume = form.get("resume");
  if (!(resume instanceof File) || resume.size === 0) missing.push("resume");
  if (missing.length) return NextResponse.json({ ok: false, error: `required: ${missing.join(", ")}` }, { status: 400 });
  // The processing authorization is the legal basis for keeping any of this.
  if (!careersAuth) return NextResponse.json({ ok: false, error: "the data processing authorization is required" }, { status: 400 });

  const file = resume as File;
  const ext = RESUME_TYPES[file.type];
  if (!ext) return NextResponse.json({ ok: false, error: "resume must be a PDF or DOCX" }, { status: 400 });
  if (file.size > RESUME_MAX_BYTES) return NextResponse.json({ ok: false, error: "resume must be 5 MB or less" }, { status: 400 });

  if (!hasSupabase) {
    console.log("[apply] (no supabase configured)", { ...required, role, resume: file.name });
    return NextResponse.json({ ok: true });
  }

  const sb = supabaseAdmin();

  // The resume goes to a private bucket; the row only keeps its path.
  const slug = `${first_name}-${last_name}`.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "applicant";
  const rand = Math.random().toString(36).slice(2, 10);
  const resume_path = `resumes/${Date.now().toString(36)}-${rand}-${slug}.${ext}`;
  const up = await sb.storage.from("applications").upload(resume_path, new Uint8Array(await file.arrayBuffer()), {
    contentType: file.type,
    upsert: false,
  });
  if (up.error) return NextResponse.json({ ok: false, error: up.error.message }, { status: 500 });

  const { data, error } = await sb
    .from("applications")
    .insert({
      role, first_name, last_name, email, phone, linkedin, english, experience, story,
      resume_path, resume_name: file.name, source: "website", careers_pool: careersPool,
    })
    .select()
    .single();
  if (error) {
    // Don't leave an orphan file behind if the row never landed.
    await sb.storage.from("applications").remove([resume_path]);
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  // No proof of consent, no application: undo the row and the file.
  const consentError = await recordConsents(
    sb,
    {
      form_id: "careers",
      submission_id: data.id,
      email,
      marketing_cookies: checked(form.get("marketing_consent")),
      evidence: requestEvidence(req, form.get("page_url")),
    },
    [
      { type: "careers_auth", textId: CONSENT_TEXT.careersAuth, granted: true },
      { type: "careers_pool", textId: CONSENT_TEXT.careersPool, granted: careersPool },
      { type: "notice", textId: CONSENT_TEXT.careersCv, granted: true },
    ],
  );
  if (consentError) {
    console.error("[apply] consents insert failed:", consentError);
    await sb.from("applications").delete().eq("id", data.id);
    await sb.storage.from("applications").remove([resume_path]);
    return NextResponse.json({ ok: false, error: "could not save your application" }, { status: 500 });
  }

  // Downstream systems get a stable link that only opens for a signed-in
  // backoffice admin, who is then handed a 15-minute signed URL (doc 05 §6).
  const resume_url = resumeLink(data.id, req);
  await Promise.all([
    fireApplicationCreated({ ...data, resume_url }, applicationLead(data, resume_url)),
    notifyRecruiting(data, resume_url),
  ]);
  return NextResponse.json({ ok: true });
}

/**
 * Email whoever runs recruiting (APPLY_NOTIFY_EMAIL, comma-separated) so an
 * application does not sit unseen in the backoffice. The resume is never
 * attached: the link only opens after signing in to the backoffice.
 */
async function notifyRecruiting(a: Record<string, any>, resumeUrl: string) {
  const to = (process.env.APPLY_NOTIFY_EMAIL || "").split(",");
  if (!to.some((t) => t.trim())) return;

  const resumeHtml = a.resume_path
    ? `<p><a href="${esc(resumeUrl)}">Download resume — ${esc(a.resume_name)}</a><br>
        <span style="color:#64748B;font-size:13px">Requires signing in to the backoffice.</span></p>`
    : "";

  const row = (label: string, value: string, href?: string) =>
    value
      ? `<tr><td style="padding:4px 16px 4px 0;color:#64748B">${esc(label)}</td>
           <td style="padding:4px 0;color:#011640">${href ? `<a href="${esc(href)}">${esc(value)}</a>` : esc(value)}</td></tr>`
      : "";

  const adminUrl = `${(process.env.NEXT_PUBLIC_SITE_URL || "").replace(/\/$/, "")}/admin/submissions`;

  await sendEmail({
    to,
    replyTo: a.email,
    subject: `New application — ${a.first_name} ${a.last_name}${a.role ? ` · ${a.role}` : ""}`,
    html: `<div style="font-family:system-ui,sans-serif;color:#1E293B;line-height:1.55">
      <h2 style="color:#011640;margin:0 0 4px">${esc(`${a.first_name} ${a.last_name}`)}</h2>
      <p style="color:#64748B;margin:0 0 16px">${esc(a.role || "Careers application")} · from the website</p>
      <table style="border-collapse:collapse;font-size:14px">
        ${row("Email", a.email, `mailto:${a.email}`)}
        ${row("Phone", a.phone, `tel:${a.phone}`)}
        ${row("LinkedIn", a.linkedin, a.linkedin)}
        ${row("English", a.english)}
        ${row("Experience", a.experience)}
      </table>
      ${a.story ? `<p style="margin-top:16px"><b style="color:#011640">In their words</b><br>${esc(a.story)}</p>` : ""}
      ${resumeHtml}
      ${adminUrl.startsWith("http") ? `<p><a href="${esc(adminUrl)}">Open the backoffice</a></p>` : ""}
    </div>`,
  });
}
