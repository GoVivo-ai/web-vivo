import { getIntegrations } from "@/lib/integrations";
import type { Lead } from "@/lib/leads";

type Target = { url: string; secret?: string };

/**
 * Outbound lead webhooks, configured in the backoffice (Settings → Integrations)
 * so no deploy is needed to point the site somewhere new.
 *
 * - The CRM connector gets every lead as { event, lead, sent_at }.
 * - Martech gets careers applications only, as { event, data: row, sent_at }.
 *   APPLY_WEBHOOK_URL / APPLY_WEBHOOK_SECRET (env, comma-separated URLs) still
 *   work as an extra destination for these.
 *
 * A secret travels as the X-Webhook-Secret header. Delivery is best-effort:
 * failures are logged and never break the request that triggered the event.
 */
export async function fireContactCreated(lead: Lead) {
  const { crmWebhookUrl, crmWebhookSecret } = await getIntegrations();
  if (!crmWebhookUrl) return;
  await post({ url: crmWebhookUrl, secret: crmWebhookSecret || undefined }, "contact.created", { lead });
}

export async function fireApplicationCreated(row: unknown, lead: Lead) {
  const i = await getIntegrations();
  const recruiting: Target[] = [];
  if (i.leadWebhookUrl) recruiting.push({ url: i.leadWebhookUrl, secret: i.leadWebhookSecret || undefined });

  const envSecret = process.env.APPLY_WEBHOOK_SECRET || undefined;
  for (const url of (process.env.APPLY_WEBHOOK_URL || "").split(",").map((u) => u.trim()).filter(Boolean)) {
    if (!recruiting.some((t) => t.url === url)) recruiting.push({ url, secret: envSecret });
  }

  const event = "application.created";
  await Promise.all([
    ...recruiting.map((t) => post(t, event, { data: row })),
    // The same URL in both fields must not deliver the application twice.
    i.crmWebhookUrl && !recruiting.some((t) => t.url === i.crmWebhookUrl)
      ? post({ url: i.crmWebhookUrl, secret: i.crmWebhookSecret || undefined }, event, { lead })
      : null,
  ]);
}

/** Sends a sample lead to the CRM connector and reports what happened. */
export async function sendTestLead(target: Target, lead: Lead) {
  return post(target, "lead.test", { test: true, lead });
}

async function post(target: Target, event: string, body: Record<string, unknown>): Promise<{ ok: boolean; status?: number }> {
  // Only the host is logged: webhook URLs often carry their secret in the path.
  const host = new URL(target.url).host;
  try {
    const res = await fetch(target.url, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        ...(target.secret ? { "x-webhook-secret": target.secret } : {}),
      },
      body: JSON.stringify({ event, ...body, sent_at: new Date().toISOString() }),
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) console.error(`[webhook] ${event} → ${host} responded ${res.status}`);
    return { ok: res.ok, status: res.status };
  } catch (err) {
    console.error(`[webhook] ${event} → ${host} failed:`, (err as Error).name);
    return { ok: false };
  }
}
