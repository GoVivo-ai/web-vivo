import "server-only";
import type { supabaseAdmin } from "@/lib/supabase/server";

type FormId = "contact" | "booking" | "newsletter" | "careers";
type ConsentType = "sms" | "email_marketing" | "careers_auth" | "careers_pool" | "notice";

export type ConsentItem = {
  type: ConsentType;
  textId: string;
  granted: boolean;
  phone?: string | null;
};

/** Who submitted and from where — the evidence fields doc 04 asks for. */
export function requestEvidence(req: Request, pageUrl: unknown) {
  const h = req.headers;
  const ip = (h.get("x-forwarded-for") || "").split(",")[0].trim() || h.get("x-real-ip") || null;
  let page_url = typeof pageUrl === "string" ? pageUrl.slice(0, 2000) : "";
  if (!/^https?:\/\//.test(page_url)) page_url = h.get("referer") || "";
  return { ip_address: ip, user_agent: h.get("user-agent")?.slice(0, 1000) || null, page_url: page_url || null };
}

/** Writes one consents row per item. Returns an error message, or null. */
export async function recordConsents(
  sb: ReturnType<typeof supabaseAdmin>,
  base: {
    form_id: FormId;
    submission_id: string | null;
    email: string;
    marketing_cookies: boolean;
    evidence: ReturnType<typeof requestEvidence>;
  },
  items: ConsentItem[],
): Promise<string | null> {
  const rows = items.map((i) => ({
    form_id: base.form_id,
    submission_id: base.submission_id,
    subject_email: base.email.trim().toLowerCase(),
    subject_phone: i.type === "sms" ? i.phone || null : null,
    consent_type: i.type,
    consent_text_id: i.textId,
    granted: i.granted,
    marketing_cookies: base.marketing_cookies,
    ...base.evidence,
  }));
  const { error } = await sb.from("consents").insert(rows);
  return error ? error.message : null;
}

/** A checkbox value from JSON or multipart: only an explicit yes counts. */
export function checked(v: unknown): boolean {
  return v === true || v === "true" || v === "on" || v === "1";
}
