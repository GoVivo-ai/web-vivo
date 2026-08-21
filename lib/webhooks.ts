/**
 * Outbound event webhooks. Set APPLY_WEBHOOK_URL to one or more URLs
 * (comma-separated) to receive a POST for each event:
 *   { "event": "application.created", "data": { ...row }, "sent_at": "ISO date" }
 * If APPLY_WEBHOOK_SECRET is set it is sent as the X-Webhook-Secret header
 * so the receiver can verify the sender.
 *
 * Delivery is best-effort: failures are logged and never break the request
 * that triggered the event.
 */
export async function fireWebhook(event: string, data: unknown) {
  const urls = (process.env.APPLY_WEBHOOK_URL || "")
    .split(",")
    .map((u) => u.trim())
    .filter(Boolean);
  if (!urls.length) return;

  const secret = process.env.APPLY_WEBHOOK_SECRET;
  const payload = JSON.stringify({ event, data, sent_at: new Date().toISOString() });

  await Promise.all(
    urls.map(async (url) => {
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
