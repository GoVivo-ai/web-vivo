"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Icon } from "@/components/Icon";
import { FieldEditor } from "@/components/admin/FieldEditor";
import { BlocksView } from "@/components/blocks/render";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { BLOCKS, BLOCK_BY_TYPE, blockLabel } from "@/lib/blocks/registry";
import type { Block, FieldDef, SiteContent } from "@/lib/blocks/types";

let uidCounter = 0;
const uid = () => `b-${Date.now().toString(36)}-${uidCounter++}`;

/** decode entities/tags in an authored value to the plain text the DOM shows */
function plainText(v: unknown): string {
  const s = String(v ?? "");
  if (typeof document === "undefined") return s;
  const d = document.createElement("div");
  d.innerHTML = s;
  return (d.textContent || "").trim();
}

function setByPath(obj: any, path: string, value: unknown) {
  const keys = path.split(".");
  const clone = structuredClone(obj);
  let o = clone;
  for (let i = 0; i < keys.length - 1; i++) o = o[keys[i]];
  o[keys[keys.length - 1]] = value;
  return clone;
}

/** every editable text target (path + value + rich) for a block, from its schema */
function collectTargets(fields: FieldDef[], props: any): { path: string; value: string; rich: boolean }[] {
  const out: { path: string; value: string; rich: boolean }[] = [];
  for (const f of fields) {
    const v = props[f.key];
    if (f.type === "text" || f.type === "textarea") { if (v) out.push({ path: f.key, value: v, rich: false }); }
    else if (f.type === "richtext") { if (v) out.push({ path: f.key, value: v, rich: true }); }
    else if (f.type === "list" && Array.isArray(v)) v.forEach((s, i) => { if (s) out.push({ path: `${f.key}.${i}`, value: s, rich: !!f.richItems }); });
    else if (f.type === "items" && Array.isArray(v)) v.forEach((it, i) => (f.fields || []).forEach((sf) => {
      const sv = it?.[sf.key];
      if ((sf.type === "text" || sf.type === "textarea" || sf.type === "richtext") && sv) out.push({ path: `${f.key}.${i}.${sf.key}`, value: sv, rich: sf.type === "richtext" });
    }));
  }
  return out;
}

export function Editor({ initial, initialPath, canSave }: { initial: SiteContent; initialPath: string; canSave: boolean }) {
  const [content, setContent] = useState<SiteContent>(initial);
  const [path, setPath] = useState<string>(initialPath);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [dirty, setDirty] = useState(false);
  const [inlineMode, setInlineMode] = useState(true);
  const [rect, setRect] = useState<DOMRect | null>(null);
  const previewRef = useRef<HTMLDivElement | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);
  const imgFieldRef = useRef<string | null>(null);

  const pageIndex = content.pages.findIndex((p) => p.path === path);
  const page = content.pages[pageIndex];

  const groups = useMemo(() => {
    const g: Record<string, typeof BLOCKS> = {};
    BLOCKS.forEach((b) => { (g[b.group] ||= []).push(b); });
    return g;
  }, []);

  function mutatePage(fn: (blocks: Block[]) => Block[]) {
    setContent((c) => ({ ...c, pages: c.pages.map((p, i) => (i === pageIndex ? { ...p, blocks: fn(p.blocks) } : p)) }));
    setDirty(true);
  }
  const updateProps = (id: string, props: Record<string, unknown>) => mutatePage((bs) => bs.map((b) => (b.id === id ? { ...b, props } : b)));
  const setField = (id: string, key: string, value: unknown) => {
    const b = page.blocks.find((x) => x.id === id);
    if (b) updateProps(id, { ...b.props, [key]: value });
  };
  const patchPath = (id: string, path: string, value: unknown) => {
    const b = page.blocks.find((x) => x.id === id);
    if (b) updateProps(id, setByPath(b.props, path, value));
  };
  const idx = page?.blocks.findIndex((b) => b.id === selectedId) ?? -1;
  const move = (i: number, dir: number) => mutatePage((bs) => {
    const j = i + dir; if (j < 0 || j >= bs.length) return bs;
    const next = [...bs]; [next[i], next[j]] = [next[j], next[i]]; return next;
  });
  const toggleHidden = (id: string) => mutatePage((bs) => bs.map((b) => (b.id === id ? { ...b, hidden: !b.hidden } : b)));
  const duplicate = (id: string) => mutatePage((bs) => {
    const i = bs.findIndex((b) => b.id === id); if (i < 0) return bs;
    const copy: Block = { ...structuredClone(bs[i]), id: uid() };
    return [...bs.slice(0, i + 1), copy, ...bs.slice(i + 1)];
  });
  const remove = (id: string) => { mutatePage((bs) => bs.filter((b) => b.id !== id)); if (selectedId === id) setSelectedId(null); };
  const addBlock = (type: string) => {
    const def = BLOCK_BY_TYPE[type];
    const nb: Block = { id: uid(), type, props: structuredClone(def?.defaults || {}) };
    const at = idx >= 0 ? idx + 1 : (page?.blocks.length ?? 0);
    mutatePage((bs) => [...bs.slice(0, at), nb, ...bs.slice(at)]);
    setSelectedId(nb.id); setPaletteOpen(false);
  };

  async function save() {
    if (!canSave) { setToast("Connect Supabase to save."); setTimeout(() => setToast(null), 2500); return; }
    setSaving(true);
    try {
      const res = await fetch("/api/admin/save", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(content) });
      const j = await res.json();
      if (j.ok) { setToast("Saved ✓"); setDirty(false); } else setToast(j.error || "Save failed");
    } catch { setToast("Save failed"); }
    setSaving(false);
    setTimeout(() => setToast(null), 2500);
  }

  const def = selectedId ? BLOCK_BY_TYPE[page?.blocks.find((b) => b.id === selectedId)?.type || ""] : null;

  /* ── position the floating toolbar over the selected block ── */
  const updateRect = useCallback(() => {
    if (!selectedId || !previewRef.current) { setRect(null); return; }
    const el = previewRef.current.querySelector(`[data-bid="${selectedId}"]`);
    setRect(el ? el.getBoundingClientRect() : null);
  }, [selectedId]);

  useEffect(() => {
    updateRect();
    const pv = previewRef.current;
    pv?.addEventListener("scroll", updateRect, { passive: true });
    window.addEventListener("resize", updateRect);
    return () => { pv?.removeEventListener("scroll", updateRect); window.removeEventListener("resize", updateRect); };
  }, [updateRect, content, inlineMode]);

  /* ── select a block by clicking it in the preview ── */
  useEffect(() => {
    if (!inlineMode) return;
    const pv = previewRef.current; if (!pv) return;
    const onClick = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      if (t.closest("[data-ep]") || t.closest("[data-epimg]")) return; // editing text/image
      const blk = t.closest<HTMLElement>("[data-bid]");
      if (blk) { e.preventDefault(); setSelectedId(blk.dataset.bid || null); }
    };
    pv.addEventListener("click", onClick);
    return () => pv.removeEventListener("click", onClick);
  }, [inlineMode]);

  /* ── annotate the selected block's text/images as inline-editable ── */
  useEffect(() => {
    if (!inlineMode) return;
    const pv = previewRef.current; if (!pv) return;
    // clear previous
    pv.querySelectorAll("[data-ep]").forEach((el) => { el.removeAttribute("data-ep"); el.removeAttribute("data-eprich"); (el as HTMLElement).contentEditable = "false"; el.removeAttribute("contenteditable"); });
    pv.querySelectorAll("[data-epimg]").forEach((el) => { el.removeAttribute("data-epimg"); el.querySelector(".ed-imgbtn")?.remove(); });
    if (!selectedId || !def) return;
    const block = pv.querySelector<HTMLElement>(`[data-bid="${selectedId}"]`); if (!block) return;
    const props = page.blocks.find((b) => b.id === selectedId)?.props || {};

    // text targets → smallest matching element
    const claimed = new Set<Element>();
    for (const t of collectTargets(def.fields, props)) {
      const target = plainText(t.value);
      if (!target) continue;
      let best: HTMLElement | null = null, bestCount = Infinity;
      block.querySelectorAll<HTMLElement>("*").forEach((el) => {
        if (claimed.has(el) || el.closest(".win")) return;
        if ((el.textContent || "").trim() === target) {
          const c = el.querySelectorAll("*").length;
          if (c < bestCount) { best = el; bestCount = c; }
        }
      });
      if (best) {
        claimed.add(best);
        const be = best as HTMLElement;
        be.setAttribute("data-ep", t.path);
        if (t.rich) be.setAttribute("data-eprich", "1");
        be.contentEditable = "true";
        be.spellcheck = false;
      }
    }
    // first top-level image field → clickable image/placeholder (host = the box we overlay)
    const imgField = def.fields.find((f) => f.type === "image");
    if (imgField) {
      const holder = block.querySelector<HTMLElement>("img, .ph");
      if (holder) {
        const host = (holder.tagName === "IMG" ? holder.parentElement || holder : holder) as HTMLElement;
        host.setAttribute("data-epimg", imgField.key);
        // Only add relative positioning when the host is statically positioned —
        // never override an already-absolute overlay (e.g. the hero background).
        if (getComputedStyle(host).position === "static") host.style.position = "relative";
        if (!host.querySelector(".ed-imgbtn")) {
          const btn = document.createElement("div");
          btn.className = "ed-imgbtn";
          btn.textContent = "Click to upload";
          host.appendChild(btn);
        }
      }
    }
  }, [selectedId, def, content, inlineMode, page]);

  /* ── commit inline text edits on blur ── */
  useEffect(() => {
    const pv = previewRef.current; if (!pv) return;
    const onBlur = (e: FocusEvent) => {
      const el = (e.target as HTMLElement).closest<HTMLElement>("[data-ep]");
      if (!el || !selectedId) return;
      const path = el.getAttribute("data-ep")!;
      const rich = el.hasAttribute("data-eprich");
      const value = rich ? el.innerHTML : (el.textContent || "");
      patchPath(selectedId, path, value);
    };
    const onImgClick = (e: MouseEvent) => {
      const el = (e.target as HTMLElement).closest<HTMLElement>("[data-epimg]");
      if (!el) return;
      e.preventDefault(); e.stopPropagation();
      imgFieldRef.current = el.getAttribute("data-epimg");
      fileRef.current?.click();
    };
    pv.addEventListener("focusout", onBlur);
    pv.addEventListener("click", onImgClick);
    return () => { pv.removeEventListener("focusout", onBlur); pv.removeEventListener("click", onImgClick); };
  }, [selectedId, page]); // eslint-disable-line

  async function onPickFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]; e.currentTarget.value = "";
    if (!f || !selectedId || !imgFieldRef.current) return;
    setToast("Uploading…");
    const fd = new FormData(); fd.append("file", f);
    try {
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const j = await res.json();
      if (j.ok) { setField(selectedId, imgFieldRef.current, j.url); setToast("Image updated ✓"); }
      else setToast(j.error || "Upload failed");
    } catch { setToast("Upload failed"); }
    setTimeout(() => setToast(null), 2000);
  }

  return (
    <div className="ed">
      {/* ── LEFT: structure + fields ── */}
      <div className="ed-side">
        <div className="ed-side-head">
          <select value={path} onChange={(e) => { setPath(e.target.value); setSelectedId(null); }}>
            {content.pages.map((p) => <option key={p.path} value={p.path}>{p.title}</option>)}
          </select>
          <button className="adm-btn sm" onClick={save} disabled={saving}>{saving ? "Saving…" : dirty ? "Save" : "Saved"}</button>
        </div>

        <div className="ed-blocklist">
          {page?.blocks.map((b, i) => (
            <div key={b.id} className={`ed-block${selectedId === b.id ? " active" : ""}${b.hidden ? " hidden-block" : ""}`}>
              <div className="ed-block-row" onClick={() => setSelectedId(selectedId === b.id ? null : b.id)}>
                <Icon name={BLOCK_BY_TYPE[b.type]?.icon || "square"} size={16} />
                <span className="lbl">{blockLabel(b.type)}</span>
                <button className="ed-icobtn" title="Move up" onClick={(e) => { e.stopPropagation(); move(i, -1); }} disabled={i === 0}><Icon name="chevron-up" size={15} /></button>
                <button className="ed-icobtn" title="Move down" onClick={(e) => { e.stopPropagation(); move(i, 1); }} disabled={i === page.blocks.length - 1}><Icon name="chevron-down" size={15} /></button>
                <button className="ed-icobtn" title="Duplicate" onClick={(e) => { e.stopPropagation(); duplicate(b.id); }}><Icon name="copy" size={14} /></button>
                <button className="ed-icobtn" title={b.hidden ? "Show" : "Hide"} onClick={(e) => { e.stopPropagation(); toggleHidden(b.id); }}><Icon name={b.hidden ? "eye-off" : "eye"} size={15} /></button>
                <button className="ed-icobtn" title="Delete" onClick={(e) => { e.stopPropagation(); if (confirm("Delete this section?")) remove(b.id); }}><Icon name="trash-2" size={15} /></button>
              </div>
              {selectedId === b.id && def && (
                <div className="ed-fields">
                  {def.fields.map((f) => (
                    <FieldEditor key={f.key} field={f} value={(b.props as any)[f.key]} onChange={(v) => setField(b.id, f.key, v)} />
                  ))}
                </div>
              )}
            </div>
          ))}
          <button className="ed-additem" onClick={() => setPaletteOpen(true)}>+ Add section</button>
        </div>
      </div>

      {/* ── RIGHT: live, editable preview ── */}
      <div className={`ed-preview${inlineMode ? " ed-mode" : ""}`} ref={previewRef}>
        <div className="ed-preview-head">
          <Icon name="eye" size={14} /> {page?.title}
          {dirty && <span style={{ color: "var(--vivo-yellow-600)", fontWeight: 700 }}>· unsaved</span>}
          <span className="ed-preview-toggle">
            <button className={inlineMode ? "on" : ""} onClick={() => setInlineMode(true)}>Edit</button>
            <button className={!inlineMode ? "on" : ""} onClick={() => { setInlineMode(false); setSelectedId(null); }}>Preview</button>
          </span>
        </div>
        <div>
          {page && (
            <>
              <Header settings={content.settings} activeGroup={page.navGroup} />
              <main><BlocksView blocks={page.blocks} editable={inlineMode} /></main>
              <Footer settings={content.settings} />
            </>
          )}
        </div>
      </div>

      {/* floating toolbar over the selected section */}
      {inlineMode && rect && selectedId && typeof document !== "undefined" && createPortal(
        <div className="ed-toolbar" style={{ top: Math.max(8, rect.top + 6), left: Math.min(rect.right - 190, window.innerWidth - 200) }}>
          <span className="lbl">{blockLabel(page.blocks.find((b) => b.id === selectedId)?.type || "")}</span>
          <button title="Move up" onClick={() => move(idx, -1)} disabled={idx <= 0}><Icon name="chevron-up" size={16} /></button>
          <button title="Move down" onClick={() => move(idx, 1)} disabled={idx >= page.blocks.length - 1}><Icon name="chevron-down" size={16} /></button>
          <button title="Duplicate" onClick={() => duplicate(selectedId)}><Icon name="copy" size={15} /></button>
          <button title={page.blocks.find((b) => b.id === selectedId)?.hidden ? "Show" : "Hide"} onClick={() => toggleHidden(selectedId)}><Icon name="eye" size={15} /></button>
          <button title="Add section below" onClick={() => setPaletteOpen(true)}><Icon name="plus" size={16} /></button>
          <button title="Delete" onClick={() => { if (confirm("Delete this section?")) remove(selectedId); }}><Icon name="trash-2" size={15} /></button>
        </div>, document.body)}

      <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={onPickFile} />

      {/* Add-section palette */}
      {paletteOpen && (
        <div className="ed-modal-bg" onClick={() => setPaletteOpen(false)}>
          <div className="ed-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Add a section</h3>
            {Object.entries(groups).map(([group, list]) => (
              <div key={group}>
                <div className="sub-head" style={{ padding: "10px 18px 4px" }}><span className="n">{group}</span></div>
                <div className="ed-palette">
                  {list.map((bd) => (
                    <button key={bd.type} onClick={() => addBlock(bd.type)}><Icon name={bd.icon} size={15} /> {bd.label}</button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {toast && <div className="ed-toast">{toast}</div>}
    </div>
  );
}
