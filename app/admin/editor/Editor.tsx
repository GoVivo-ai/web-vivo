"use client";
import { useMemo, useState } from "react";
import { Icon } from "@/components/Icon";
import { FieldEditor } from "@/components/admin/FieldEditor";
import { BlocksView } from "@/components/blocks/render";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { BLOCKS, BLOCK_BY_TYPE, blockLabel } from "@/lib/blocks/registry";
import type { Block, SiteContent } from "@/lib/blocks/types";

let uidCounter = 0;
const uid = () => `b-${Date.now().toString(36)}-${uidCounter++}`;

export function Editor({ initial, initialPath, canSave }: { initial: SiteContent; initialPath: string; canSave: boolean }) {
  const [content, setContent] = useState<SiteContent>(initial);
  const [path, setPath] = useState<string>(initialPath);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [dirty, setDirty] = useState(false);

  const pageIndex = content.pages.findIndex((p) => p.path === path);
  const page = content.pages[pageIndex];

  const groups = useMemo(() => {
    const g: Record<string, typeof BLOCKS> = {};
    BLOCKS.forEach((b) => { (g[b.group] ||= []).push(b); });
    return g;
  }, []);

  function mutatePage(fn: (blocks: Block[]) => Block[]) {
    setContent((c) => {
      const pages = c.pages.map((p, i) => (i === pageIndex ? { ...p, blocks: fn(p.blocks) } : p));
      return { ...c, pages };
    });
    setDirty(true);
  }

  const updateProps = (id: string, props: Record<string, unknown>) =>
    mutatePage((bs) => bs.map((b) => (b.id === id ? { ...b, props } : b)));
  const setField = (id: string, key: string, value: unknown) => {
    const b = page.blocks.find((x) => x.id === id);
    if (!b) return;
    updateProps(id, { ...b.props, [key]: value });
  };
  const move = (idx: number, dir: number) =>
    mutatePage((bs) => {
      const j = idx + dir;
      if (j < 0 || j >= bs.length) return bs;
      const next = [...bs];
      [next[idx], next[j]] = [next[j], next[idx]];
      return next;
    });
  const toggleHidden = (id: string) => mutatePage((bs) => bs.map((b) => (b.id === id ? { ...b, hidden: !b.hidden } : b)));
  const remove = (id: string) => {
    mutatePage((bs) => bs.filter((b) => b.id !== id));
    if (selectedId === id) setSelectedId(null);
  };
  const addBlock = (type: string) => {
    const def = BLOCK_BY_TYPE[type];
    const nb: Block = { id: uid(), type, props: JSON.parse(JSON.stringify(def?.defaults || {})) };
    mutatePage((bs) => [...bs, nb]);
    setSelectedId(nb.id);
    setPaletteOpen(false);
  };

  async function save() {
    if (!canSave) { setToast("Connect Supabase to save."); setTimeout(() => setToast(null), 2500); return; }
    setSaving(true);
    try {
      const res = await fetch("/api/admin/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(content),
      });
      const j = await res.json();
      if (j.ok) { setToast("Saved ✓"); setDirty(false); }
      else setToast(j.error || "Save failed");
    } catch {
      setToast("Save failed");
    }
    setSaving(false);
    setTimeout(() => setToast(null), 2500);
  }

  const def = selectedId ? BLOCK_BY_TYPE[page?.blocks.find((b) => b.id === selectedId)?.type || ""] : null;
  const selectedBlock = page?.blocks.find((b) => b.id === selectedId);

  return (
    <div className="ed">
      {/* ── LEFT: structure + fields ── */}
      <div className="ed-side">
        <div className="ed-side-head">
          <select value={path} onChange={(e) => { setPath(e.target.value); setSelectedId(null); }}>
            {content.pages.map((p) => <option key={p.path} value={p.path}>{p.title}</option>)}
          </select>
          <button className="adm-btn sm" onClick={save} disabled={saving}>
            {saving ? "Saving…" : dirty ? "Save" : "Saved"}
          </button>
        </div>

        <div className="ed-blocklist">
          {page?.blocks.map((b, idx) => (
            <div key={b.id} className={`ed-block${selectedId === b.id ? " active" : ""}${b.hidden ? " hidden-block" : ""}`}>
              <div className="ed-block-row" onClick={() => setSelectedId(selectedId === b.id ? null : b.id)}>
                <Icon name={def && selectedId === b.id ? def.icon : (BLOCK_BY_TYPE[b.type]?.icon || "square")} size={16} />
                <span className="lbl">{blockLabel(b.type)}</span>
                <button className="ed-icobtn" title="Move up" onClick={(e) => { e.stopPropagation(); move(idx, -1); }} disabled={idx === 0}><Icon name="chevron-up" size={15} /></button>
                <button className="ed-icobtn" title="Move down" onClick={(e) => { e.stopPropagation(); move(idx, 1); }} disabled={idx === page.blocks.length - 1}><Icon name="chevron-down" size={15} /></button>
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

      {/* ── RIGHT: live preview ── */}
      <div className="ed-preview">
        <div className="ed-preview-head">
          <Icon name="eye" size={14} /> Live preview · {page?.title}
          {dirty && <span style={{ color: "var(--vivo-yellow-600)", fontWeight: 700 }}>· unsaved changes</span>}
        </div>
        <div className="ed-preview-frame">
          {page && (
            <>
              <Header settings={content.settings} activeGroup={page.navGroup} />
              <main>
                <BlocksView blocks={page.blocks} />
              </main>
              <Footer settings={content.settings} />
            </>
          )}
        </div>
      </div>

      {/* ── Add-section palette ── */}
      {paletteOpen && (
        <div className="ed-modal-bg" onClick={() => setPaletteOpen(false)}>
          <div className="ed-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Add a section</h3>
            {Object.entries(groups).map(([group, list]) => (
              <div key={group}>
                <div className="sub-head" style={{ padding: "10px 18px 4px" }}><span className="n">{group}</span></div>
                <div className="ed-palette">
                  {list.map((bd) => (
                    <button key={bd.type} onClick={() => addBlock(bd.type)}>
                      <Icon name={bd.icon} size={15} /> {bd.label}
                    </button>
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
