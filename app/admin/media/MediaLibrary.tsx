"use client";
import { useEffect, useState } from "react";
import { Icon } from "@/components/Icon";

type Item = { name: string; url: string; size?: number };

export function MediaLibrary() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const flash = (m: string) => { setMsg(m); setTimeout(() => setMsg(null), 2000); };

  async function load() {
    setLoading(true);
    const r = await fetch("/api/admin/media");
    const j = await r.json();
    if (j.ok) setItems(j.items);
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  async function upload(file: File) {
    setBusy(true);
    const fd = new FormData(); fd.append("file", file);
    const r = await fetch("/api/admin/upload", { method: "POST", body: fd });
    const j = await r.json();
    setBusy(false);
    if (j.ok) { flash("Uploaded ✓"); load(); } else flash(j.error || "Failed");
  }
  async function del(name: string) {
    if (!confirm("Delete this image?")) return;
    await fetch("/api/admin/media", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name }) });
    load();
  }

  return (
    <>
      <label className="wp-uploadzone" style={{ display: "block", marginBottom: 22 }}>
        {busy ? "Uploading…" : "Click to upload an image (PNG, JPG, WebP · max 8 MB)"}
        <input type="file" accept="image/*" style={{ display: "none" }} disabled={busy}
          onChange={(e) => { const f = e.target.files?.[0]; if (f) upload(f); e.currentTarget.value = ""; }} />
      </label>

      {loading ? <p className="muted">Loading…</p> : items.length === 0 ? (
        <p className="muted">No images yet. Upload one above, or use the Upload buttons inside the visual editor.</p>
      ) : (
        <div className="wp-media">
          {items.map((it) => (
            <div className="cell" key={it.name}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={it.url} alt="" />
              <div className="meta">
                <button onClick={() => { navigator.clipboard?.writeText(it.url); flash("URL copied"); }} title="Copy URL"><Icon name="link" size={14} /></button>
                <span>{it.size ? Math.round(it.size / 1024) + " KB" : ""}</span>
                <button onClick={() => del(it.name)} title="Delete"><Icon name="trash-2" size={14} /></button>
              </div>
            </div>
          ))}
        </div>
      )}
      {msg && <div className="ed-toast">{msg}</div>}
    </>
  );
}
