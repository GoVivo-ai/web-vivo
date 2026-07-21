"use client";
import { useState } from "react";
import { Icon } from "@/components/Icon";
import type { SiteContent } from "@/lib/blocks/types";

export function SettingsEditor({ initial, canSave }: { initial: SiteContent; canSave: boolean }) {
  const [content, setContent] = useState<SiteContent>(initial);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const s = content.settings;
  const flash = (m: string) => { setMsg(m); setTimeout(() => setMsg(null), 2500); };

  const set = (fn: (c: SiteContent) => SiteContent) => setContent((c) => fn(structuredClone(c)));

  async function save() {
    if (!canSave) { flash("Connect Supabase to save."); return; }
    setSaving(true);
    const r = await fetch("/api/admin/save", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(content) });
    const j = await r.json();
    setSaving(false);
    flash(j.ok ? "Saved ✓" : j.error || "Failed");
  }

  return (
    <>
      <div className="wp-panel">
        <h2>Header</h2>
        <div style={{ padding: 18, display: "grid", gap: 12, maxWidth: 520 }}>
          <div><label className="wp-flabel">Book button label</label>
            <input className="ed-input" value={s.headerCta.label} onChange={(e) => set((c) => { c.settings.headerCta.label = e.target.value; return c; })} /></div>
          <div><label className="wp-flabel">Book button link</label>
            <input className="ed-input" value={s.headerCta.href} onChange={(e) => set((c) => { c.settings.headerCta.href = e.target.value; return c; })} /></div>
        </div>
      </div>

      <div className="wp-panel">
        <h2>Navigation</h2>
        <div style={{ padding: 18, display: "grid", gap: 8 }}>
          {s.nav.map((n, i) => (
            <div key={i} style={{ display: "flex", gap: 8 }}>
              <input className="ed-input" value={n.label} onChange={(e) => set((c) => { c.settings.nav[i].label = e.target.value; return c; })} placeholder="Label" />
              <input className="ed-input" value={n.href} onChange={(e) => set((c) => { c.settings.nav[i].href = e.target.value; return c; })} placeholder="/path" />
            </div>
          ))}
        </div>
      </div>

      <div className="wp-panel">
        <h2>Footer</h2>
        <div style={{ padding: 18, display: "grid", gap: 12, maxWidth: 620 }}>
          <div><label className="wp-flabel">Blurb</label>
            <textarea className="ed-textarea" value={s.footer.blurb} onChange={(e) => set((c) => { c.settings.footer.blurb = e.target.value; return c; })} /></div>
          <div><label className="wp-flabel">Copyright line</label>
            <input className="ed-input" value={s.footer.copyright} onChange={(e) => set((c) => { c.settings.footer.copyright = e.target.value; return c; })} /></div>
          <div><label className="wp-flabel">Contact line (phone · email · region)</label>
            <input className="ed-input" value={s.footer.contactLine} onChange={(e) => set((c) => { c.settings.footer.contactLine = e.target.value; return c; })} /></div>
        </div>
      </div>

      <button className="adm-btn" onClick={save} disabled={saving}><Icon name="save" size={16} /> {saving ? "Saving…" : "Save settings"}</button>
      {msg && <div className="ed-toast">{msg}</div>}
    </>
  );
}
