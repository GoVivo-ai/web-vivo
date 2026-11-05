import { NextResponse } from "next/server";
import { getAdminState } from "@/lib/auth";
import { getIntegrations, saveIntegrations, webhookUrlProblem, type IntegrationsPatch } from "@/lib/integrations";
import { sampleLead } from "@/lib/leads";
import { sendTestLead } from "@/lib/webhooks";

export const dynamic = "force-dynamic";

async function isAdmin() {
  const s = await getAdminState();
  return s.configured && !!s.user && s.isAdmin;
}

const denied = () => NextResponse.json({ ok: false, error: "Not authorized" }, { status: 401 });

/** Save. A secret left out of the body stays as it is; an empty one is removed. */
export async function PUT(req: Request) {
  if (!(await isAdmin())) return denied();
  const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body) return NextResponse.json({ ok: false, error: "Invalid request" }, { status: 400 });

  const patch: IntegrationsPatch = {};
  for (const key of ["leadWebhookUrl", "crmWebhookUrl", "leadWebhookSecret", "crmWebhookSecret"] as const) {
    const raw = body[key];
    if (raw === undefined) continue;
    if (typeof raw !== "string") return NextResponse.json({ ok: false, error: "Invalid request" }, { status: 400 });
    const value = raw.trim();
    if (value && key.endsWith("Url")) {
      const problem = webhookUrlProblem(value);
      if (problem) return NextResponse.json({ ok: false, error: problem }, { status: 400 });
    }
    patch[key] = value || null;
  }

  const res = await saveIntegrations(patch);
  return NextResponse.json(res, { status: res.ok ? 200 : 500 });
}

/** Send a test lead to the saved CRM connector. */
export async function POST() {
  if (!(await isAdmin())) return denied();
  const { crmWebhookUrl, crmWebhookSecret } = await getIntegrations();
  if (!crmWebhookUrl) return NextResponse.json({ ok: false, error: "Save a connector URL first." }, { status: 400 });
  const res = await sendTestLead({ url: crmWebhookUrl, secret: crmWebhookSecret || undefined }, sampleLead());
  return NextResponse.json({
    ok: res.ok,
    error: res.ok ? undefined : res.status ? `The connector responded ${res.status}.` : "The connector could not be reached.",
  });
}
