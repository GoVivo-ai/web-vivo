"use client";
import { useState } from "react";
import { Icon } from "@/components/Icon";

export type IntegrationsView = {
  ready: boolean;
  crmWebhookUrl: string;
  hasCrmSecret: boolean;
  leadWebhookUrl: string;
  hasLeadSecret: boolean;
};

function SecretField({ label, has, value, onChange, onRemove }: {
  label: string;
  has: boolean;
  value: string;
  onChange: (v: string) => void;
  onRemove: () => void;
}) {
  return (
    <div>
      <label className="wp-flabel">{label}</label>
      <input
        className="ed-input"
        type="password"
        autoComplete="new-password"
        value={value}
        placeholder={has ? "Saved — type to replace" : "Only if the receiver asks for one"}
        onChange={(e) => onChange(e.target.value)}
      />
      {has && <button type="button" className="adm-btn ghost sm" style={{ marginTop: 8 }} onClick={onRemove}>Remove secret</button>}
    </div>
  );
}

export function IntegrationsEditor({ initial, canSave }: { initial: IntegrationsView; canSave: boolean }) {
  const [crmUrl, setCrmUrl] = useState(initial.crmWebhookUrl);
  const [crmSecret, setCrmSecret] = useState("");
  const [hasCrmSecret, setHasCrmSecret] = useState(initial.hasCrmSecret);
  const [leadUrl, setLeadUrl] = useState(initial.leadWebhookUrl);
  const [leadSecret, setLeadSecret] = useState("");
  const [hasLeadSecret, setHasLeadSecret] = useState(initial.hasLeadSecret);
  const [savedCrmUrl, setSavedCrmUrl] = useState(initial.crmWebhookUrl);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const disabled = busy || !canSave || !initial.ready;

  async function put(body: Record<string, string>) {
    const r = await fetch("/api/admin/integrations", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    return (await r.json().catch(() => ({ ok: false }))) as { ok: boolean; error?: string };
  }

  async function save() {
    setBusy(true);
    const body: Record<string, string> = { crmWebhookUrl: crmUrl, leadWebhookUrl: leadUrl };
    if (crmSecret) body.crmWebhookSecret = crmSecret;
    if (leadSecret) body.leadWebhookSecret = leadSecret;
    const j = await put(body);
    setBusy(false);
    if (j.ok) {
      setSavedCrmUrl(crmUrl.trim());
      if (crmSecret) { setHasCrmSecret(true); setCrmSecret(""); }
      if (leadSecret) { setHasLeadSecret(true); setLeadSecret(""); }
    }
    setMsg(j.ok ? "Saved ✓" : j.error || "Could not save.");
  }

  async function removeSecret(key: "crmWebhookSecret" | "leadWebhookSecret") {
    setBusy(true);
    const j = await put({ [key]: "" });
    setBusy(false);
    if (j.ok) {
      if (key === "crmWebhookSecret") { setHasCrmSecret(false); setCrmSecret(""); }
      else { setHasLeadSecret(false); setLeadSecret(""); }
    }
    setMsg(j.ok ? "Secret removed ✓" : j.error || "Could not remove the secret.");
  }

  async function test() {
    setBusy(true);
    const r = await fetch("/api/admin/integrations", { method: "POST" });
    const j = (await r.json().catch(() => ({ ok: false }))) as { ok: boolean; error?: string };
    setBusy(false);
    setMsg(j.ok ? "Test lead sent ✓" : j.error || "The test failed.");
  }

  return (
    <div className="wp-panel" style={{ marginTop: 18 }}>
      <h2>Integrations</h2>
      <div style={{ padding: 18, display: "grid", gap: 12, maxWidth: 620 }}>
        {!initial.ready && canSave && (
          <div className="adm-notice" style={{ marginTop: 0 }}>
            Forwarding is off until the database update is run: <code>supabase/migrations/0003_integration_settings.sql</code>.
          </div>
        )}

        <p style={{ margin: 0, color: "#64748B", fontSize: 13 }}>
          <b>CRM connector.</b> Every new lead, from both the contact and the careers forms, is sent to this URL as it
          arrives. In Zapier, n8n or Make, create a trigger that catches a webhook, paste its URL here, save, and send a
          test lead so the connector has fields to map to your CRM.
        </p>
        <div><label className="wp-flabel">Connector webhook URL</label>
          <input className="ed-input" value={crmUrl} placeholder="https://hooks.zapier.com/…" onChange={(e) => setCrmUrl(e.target.value)} /></div>
        <SecretField label="Connector secret (optional)" has={hasCrmSecret} value={crmSecret} onChange={setCrmSecret} onRemove={() => removeSecret("crmWebhookSecret")} />

        <p style={{ margin: "12px 0 0", color: "#64748B", fontSize: 13 }}>
          <b>Martek.</b> Careers applications only. In Martek, open Settings → Connections → Incoming leads webhook,
          generate the URL and paste it here.
        </p>
        <div><label className="wp-flabel">Martek webhook URL</label>
          <input className="ed-input" value={leadUrl} placeholder="https://…/api/webhooks/leads/…" onChange={(e) => setLeadUrl(e.target.value)} /></div>
        <SecretField label="Martek secret (optional)" has={hasLeadSecret} value={leadSecret} onChange={setLeadSecret} onRemove={() => removeSecret("leadWebhookSecret")} />

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 6 }}>
          <button type="button" className="adm-btn" onClick={save} disabled={disabled}><Icon name="save" size={16} /> {busy ? "Working…" : "Save integrations"}</button>
          <button type="button" className="adm-btn ghost" onClick={test} disabled={disabled || !savedCrmUrl || crmUrl.trim() !== savedCrmUrl}>Send test lead</button>
        </div>
        {msg && <div role="status" style={{ color: "#64748B", fontSize: 13 }}>{msg}</div>}
      </div>
    </div>
  );
}
