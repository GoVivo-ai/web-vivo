import { getSiteContent } from "@/lib/content/store";

/**
 * Outbound event webhooks. Each event is POSTed as
 *   { "event": "application.created", "data": { ...row }, "sent_at": "ISO date" }
 *
 * Where to send it is configured in the backoffice (Settings → Integrations),
 * so whoever runs recruiting can point the site at Martek — or anywhere —
 * without a deploy. APPLY_WEBHOOK_URL / APPLY_WEBHOOK_SECRET (env, comma-
 * separated URLs) still work as an extra destination. If a secret is set it
 * travels as the X-Webhook-Secret header.
 *
 * Delivery is best-effort: failures are logged and never break the request
 * that triggered the event.
 */
export async function fireWebhook(event: string, data: unknown) {
  const targets = await webhookTargets();
  if (!targets.length) return;

  const payload = JSON.stringify({ event, data, sent_at: new Date().toISOString() });

  await Promise.all(
    targets.map(async ({ url, secret }) => {
      try {
        const res = await fetch(url, {
          method: "POST",
          headers: {
            "content-type": "application/json",
            ...(secret ? { "x-webhook-secret": secret } : {}),
          },
          body: payload,
          signal: AbortSignal.timeout(5000),
        });
        if (!res.ok) console.error(`[webhook] ${event} → ${url} responded ${res.status}`);
      } catch (err) {
        console.error(`[webhook] ${event} → ${url} failed:`, err);
      }
    })
  );
}

async function webhookTargets(): Promise<{ url: string; secret?: string }[]> {
  const targets: { url: string; secret?: string }[] = [];

  const { settings } = await getSiteContent();
  const configured = settings.integrations?.leadWebhookUrl?.trim();
  if (configured) targets.push({ url: configured, secret: settings.integrations?.leadWebhookSecret?.trim() || undefined });

  const envSecret = process.env.APPLY_WEBHOOK_SECRET || undefined;
  for (const url of (process.env.APPLY_WEBHOOK_URL || "").split(",").map((u) => u.trim()).filter(Boolean)) {
    if (!targets.some((t) => t.url === url)) targets.push({ url, secret: envSecret });
  }
  return targets;
}
