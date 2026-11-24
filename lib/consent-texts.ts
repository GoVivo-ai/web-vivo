/**
 * Version IDs of every consent text shown on the site (legal v1, doc 04).
 * The wording itself lives in components/blocks/ConsentCopy.tsx. Any change to
 * a text goes through Felipe first and MUST bump its ID here, so the consents
 * table always says exactly which wording a person agreed to.
 */
export const CONSENT_TEXT = {
  sms: "sms-v1.0",
  emailMarketing: "email-mkt-v1.0",
  contactNotice: "notice-v1.0",
  bookingNotice: "notice-booking-v1.0",
  careersCv: "careers-cv-v1.1",
  careersAuth: "careers-auth-v1.1",
  careersPool: "careers-pool-v1.1",
} as const;

/** Résumé rules for Careers (doc 04 §4, doc 05 §6). */
export const RESUME_MAX_BYTES = 5 * 1024 * 1024;
export const RESUME_TYPES: Record<string, string> = {
  "application/pdf": "pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
};

/**
 * The cookie banner's marketing choice at the moment of submitting, sent with
 * every form (doc 05 §6). CookieYes calls the marketing category
 * "advertisement". Without a banner answer it is false.
 */
export function marketingCookieConsent(): boolean {
  try {
    const c = (window as any).getCkyConsent?.();
    return Boolean(c?.categories?.advertisement);
  } catch {
    return false;
  }
}
