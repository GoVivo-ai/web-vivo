/**
 * Transactional email over the Resend HTTP API — no SDK, same best-effort
 * contract as `fireWebhook`: a failure is logged and never breaks the request
 * that triggered it.
 *
 * Configure with:
 *   RESEND_API_KEY   the API key
 *   MAIL_FROM        verified sender, e.g. "Vivo <no-reply@govivo.ai>"
 * When either is missing the payload is logged and nothing is sent, so local
 * development and preview deploys keep working without credentials.
 */
export async function sendEmail({
  to,
  subject,
  html,
  replyTo,
}: {
  to: string[];
  subject: string;
  html: string;
  replyTo?: string;
}) {
  const recipients = to.map((t) => t.trim()).filter(Boolean);
  if (!recipients.length) return;

  const key = process.env.RESEND_API_KEY;
  const from = process.env.MAIL_FROM;
  if (!key || !from) {
    console.log(`[email] (not configured) would send "${subject}" to ${recipients.join(", ")}`);
    return;
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { authorization: `Bearer ${key}`, "content-type": "application/json" },
      body: JSON.stringify({ from, to: recipients, subject, html, ...(replyTo ? { reply_to: replyTo } : {}) }),
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) console.error(`[email] "${subject}" responded ${res.status}: ${await res.text().catch(() => "")}`);
  } catch (err) {
    console.error(`[email] "${subject}" failed:`, err);
  }
}

/** Minimal HTML escaping for values interpolated into an email body. */
export function esc(value: string | null | undefined) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
