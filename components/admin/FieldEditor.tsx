"use client";
import { useState } from "react";
import { Icon } from "../Icon";
import type { FieldDef } from "@/lib/blocks/types";

type Val = any;

export function ImageField({ value, onChange, label, help }: { value?: string; onChange: (v: string) => void; label?: string; help?: string }) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  async function upload(file: File) {
    setBusy(true);
    setErr(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const j = await res.json();
      if (j.ok) onChange(j.url);
      else setErr(j.error || "Upload failed");
    } catch {
      setErr("Upload failed");
    }
    setBusy(false);
  }
  return (
    <div className="ed-field">
      {label && <label>{label}</label>}
      {help && <div className="help">{help}</div>}
      {value ? (
        <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 6 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="" style={{ width: 54, height: 40, objectFit: "cover", borderRadius: 6, border: "1px solid var(--vivo-border)" }} />
          <button className="ed-icobtn" title="Remove" onClick={() => onChange("")}><Icon name="x" size={15} /></button>
        </div>
      ) : null}
      <div style={{ display: "flex", gap: 6 }}>
        <input className="ed-input" value={value ?? ""} onChange={(e) => onChange(e.target.value)} placeholder="/photos/… or upload →" />
        <label className="adm-btn ghost sm" style={{ whiteSpace: "nowrap", cursor: "pointer" }}>
          {busy ? "…" : "Upload"}
          <input type="file" accept="image/*" style={{ display: "none" }} disabled={busy}
            onChange={(e) => { const f = e.target.files?.[0]; if (f) upload(f); e.currentTarget.value = ""; }} />
        </label>
      </div>
      {err && <div className="help" style={{ color: "#b42318" }}>{err}</div>}
    </div>
  );
}

function ListEditor({ field, value, onChange }: { field: FieldDef; value: Val; onChange: (v: Val) => void }) {
  const arr: string[] = Array.isArray(value) ? value : [];
  const set = (i: number, v: string) => onChange(arr.map((x, j) => (j === i ? v : x)));
  const add = () => onChange([...arr, ""]);
  const rm = (i: number) => onChange(arr.filter((_, j) => j !== i));
  const move = (i: number, d: number) => {
    const j = i + d;
    if (j < 0 || j >= arr.length) return;
    const next = [...arr];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };
  return (
    <div>
      {arr.map((v, i) => (
        <div className="ed-sub" key={i}>
          <div className="sub-head">
            <span className="n">{field.itemLabel || "item"} {i + 1}</span>
            <span style={{ display: "flex", gap: 2 }}>
              <button className="ed-icobtn" onClick={() => move(i, -1)} disabled={i === 0}><Icon name="chevron-up" size={14} /></button>
              <button className="ed-icobtn" onClick={() => move(i, 1)} disabled={i === arr.length - 1}><Icon name="chevron-down" size={14} /></button>
              <button className="ed-icobtn" onClick={() => rm(i)}><Icon name="trash-2" size={14} /></button>
            </span>
          </div>
          {field.richItems ? (
            <textarea className="ed-textarea" value={v} onChange={(e) => set(i, e.target.value)} />
          ) : (
            <input className="ed-input" value={v} onChange={(e) => set(i, e.target.value)} />
          )}
        </div>
      ))}
      <button className="ed-additem" onClick={add}>+ Add {field.itemLabel || "item"}</button>
    </div>
  );
}

function ItemsEditor({ field, value, onChange }: { field: FieldDef; value: Val; onChange: (v: Val) => void }) {
  const arr: Record<string, Val>[] = Array.isArray(value) ? value : [];
  const setItem = (i: number, key: string, v: Val) => onChange(arr.map((x, j) => (j === i ? { ...x, [key]: v } : x)));
  const add = () => {
    const blank: Record<string, Val> = {};
    (field.fields || []).forEach((f) => (blank[f.key] = f.type === "list" || f.type === "items" ? [] : ""));
    onChange([...arr, blank]);
  };
  const rm = (i: number) => onChange(arr.filter((_, j) => j !== i));
  const move = (i: number, d: number) => {
    const j = i + d;
    if (j < 0 || j >= arr.length) return;
    const next = [...arr];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };
  return (
    <div>
      {arr.map((item, i) => (
        <div className="ed-sub" key={i}>
          <div className="sub-head">
            <span className="n">{field.itemLabel || "item"} {i + 1}</span>
            <span style={{ display: "flex", gap: 2 }}>
              <button className="ed-icobtn" onClick={() => move(i, -1)} disabled={i === 0}><Icon name="chevron-up" size={14} /></button>
              <button className="ed-icobtn" onClick={() => move(i, 1)} disabled={i === arr.length - 1}><Icon name="chevron-down" size={14} /></button>
              <button className="ed-icobtn" onClick={() => rm(i)}><Icon name="trash-2" size={14} /></button>
            </span>
          </div>
          {(field.fields || []).map((f) => (
            <FieldEditor key={f.key} field={f} value={item[f.key]} onChange={(v) => setItem(i, f.key, v)} />
          ))}
        </div>
      ))}
      <button className="ed-additem" onClick={add}>+ Add {field.itemLabel || "item"}</button>
    </div>
  );
}

export function FieldEditor({ field, value, onChange }: { field: FieldDef; value: Val; onChange: (v: Val) => void }) {
  const labelBlock = (
    <>
      <label>{field.label}</label>
      {field.help && <div className="help">{field.help}</div>}
    </>
  );

  switch (field.type) {
    case "text":
      return <div className="ed-field">{labelBlock}<input className="ed-input" value={value ?? ""} onChange={(e) => onChange(e.target.value)} /></div>;
    case "textarea":
    case "richtext":
      return <div className="ed-field">{labelBlock}<textarea className="ed-textarea" value={value ?? ""} onChange={(e) => onChange(e.target.value)} /></div>;
    case "image":
      return <ImageField value={value} onChange={onChange} label={field.label} help={field.help} />;
    case "select":
      return (
        <div className="ed-field">
          {labelBlock}
          <select className="ed-select" value={value ?? ""} onChange={(e) => onChange(e.target.value)}>
            {(field.options || []).map((o) => <option key={o} value={o}>{o}</option>)}
          </select>
        </div>
      );
    case "boolean":
      return (
        <div className="ed-field" style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <input type="checkbox" checked={Boolean(value)} onChange={(e) => onChange(e.target.checked)} />
          <label style={{ margin: 0 }}>{field.label}</label>
        </div>
      );
    case "cta": {
      const v = (value || {}) as { label?: string; href?: string; icon?: string };
      return (
        <div className="ed-field">
          {labelBlock}
          <div className="ed-sub">
            <input className="ed-input" style={{ marginBottom: 6 }} placeholder="Button label" value={v.label ?? ""} onChange={(e) => onChange({ ...v, label: e.target.value })} />
            <input className="ed-input" placeholder="/book or https://…" value={v.href ?? ""} onChange={(e) => onChange({ ...v, href: e.target.value })} />
          </div>
        </div>
      );
    }
    case "list":
      return <div className="ed-field">{labelBlock}<ListEditor field={field} value={value} onChange={onChange} /></div>;
    case "items":
      return <div className="ed-field">{labelBlock}<ItemsEditor field={field} value={value} onChange={onChange} /></div>;
    default:
      return null;
  }
}
