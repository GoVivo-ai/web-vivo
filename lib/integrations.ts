import "server-only";
import { hasSupabase } from "@/lib/supabase/config";
import { supabaseAdmin } from "@/lib/supabase/server";

/**
 * Where leads are forwarded. Lives in its own table rather than in
 * site_content because site content is world-readable and reaches public
 * pages; these URLs would let anyone post fake leads.
 */
export type Integrations = {
  /** False until migration 0003 has been run. */
  ready: boolean;
  leadWebhookUrl: string | null;
  leadWebhookSecret: string | null;
  crmWebhookUrl: string | null;
  crmWebhookSecret: string | null;
};

export type IntegrationsPatch = Partial<Omit<Integrations, "ready">>;

const TABLE = "integration_settings";
const ID = "main";
const NONE = { leadWebhookUrl: null, leadWebhookSecret: null, crmWebhookUrl: null, crmWebhookSecret: null };

export async function getIntegrations(): Promise<Integrations> {
  if (!hasSupabase) return { ready: false, ...NONE };
  try {
    const { data, error } = await supabaseAdmin().from(TABLE).select("*").eq("id", ID).maybeSingle();
    if (error) {
      console.error("[integrations] read failed:", error.message);
      return { ready: false, ...NONE };
    }
    return {
      ready: true,
      leadWebhookUrl: data?.lead_webhook_url ?? null,
      leadWebhookSecret: data?.lead_webhook_secret ?? null,
      crmWebhookUrl: data?.crm_webhook_url ?? null,
      crmWebhookSecret: data?.crm_webhook_secret ?? null,
    };
  } catch (err) {
    console.error("[integrations] read failed:", err);
    return { ready: false, ...NONE };
  }
}

export async function saveIntegrations(patch: IntegrationsPatch): Promise<{ ok: boolean; error?: string }> {
  const row: Record<string, string | null> = { id: ID, updated_at: new Date().toISOString() };
  if (patch.leadWebhookUrl !== undefined) row.lead_webhook_url = patch.leadWebhookUrl;
  if (patch.leadWebhookSecret !== undefined) row.lead_webhook_secret = patch.leadWebhookSecret;
  if (patch.crmWebhookUrl !== undefined) row.crm_webhook_url = patch.crmWebhookUrl;
  if (patch.crmWebhookSecret !== undefined) row.crm_webhook_secret = patch.crmWebhookSecret;
  const { error } = await supabaseAdmin().from(TABLE).upsert(row);
  return error ? { ok: false, error: error.message } : { ok: true };
}

/** Returns why a webhook URL is unacceptable, or null when it is fine. */
export function webhookUrlProblem(value: string): string | null {
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    return "That is not a valid URL.";
  }
  if (url.protocol !== "https:") return "The URL must start with https://";
  if (url.username || url.password) return "The URL must not contain a username or password.";
  const host = url.hostname.toLowerCase();
  const internal =
    host === "localhost" ||
    host.endsWith(".localhost") ||
    host.endsWith(".local") ||
    host.startsWith("[") ||
    /^(0|10|127)\./.test(host) ||
    /^169\.254\./.test(host) ||
    /^192\.168\./.test(host) ||
    /^172\.(1[6-9]|2\d|3[01])\./.test(host);
  return internal ? "The URL must point to a public address." : null;
}
