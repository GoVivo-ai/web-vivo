"use client";

import { useEffect, useMemo, useState } from "react";

type Message = {
  id: string;
  name: string | null;
  email: string;
  message: string;
  created_at: string;
};

type Application = {
  id: string;
  role: string | null;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  linkedin: string | null;
  english: string;
  experience: string | null;
  story: string | null;
  source: string | null;
  resume_name: string | null;
  /** Short-lived signed URL, minted server-side; null when there is no resume. */
  resume_url: string | null;
  created_at: string;
};

type Field = { label: string; value: string | null; href?: string; long?: boolean };
type Detail = { title: string; subtitle: string; fields: Field[] };

const fmt = (d: string) => new Date(d).toLocaleString();

function inDateRange(created: string, from: string, to: string) {
  const t = new Date(created).getTime();
  if (from && t < new Date(from).getTime()) return false;
  // "to" is inclusive: anything before the end of that day.
  if (to && t >= new Date(to).getTime() + 24 * 60 * 60 * 1000) return false;
  return true;
}

function messageDetail(m: Message): Detail {
  return {
    title: m.name || m.email,
    subtitle: fmt(m.created_at),
    fields: [
      { label: "Name", value: m.name },
      { label: "Email", value: m.email, href: `mailto:${m.email}` },
      { label: "Received", value: fmt(m.created_at) },
      { label: "Message", value: m.message, long: true },
    ],
  };
}

function applicationDetail(a: Application): Detail {
  return {
    title: `${a.first_name} ${a.last_name}`,
    subtitle: [a.role, fmt(a.created_at)].filter(Boolean).join(" · "),
    fields: [
      { label: "Role", value: a.role },
      { label: "Email", value: a.email, href: `mailto:${a.email}` },
      { label: "Phone", value: a.phone, href: `tel:${a.phone}` },
      { label: "LinkedIn", value: a.linkedin, href: a.linkedin || undefined },
      { label: "English", value: a.english },
      { label: "Source", value: a.source },
      { label: "Resume", value: a.resume_url ? a.resume_name || "Download" : null, href: a.resume_url || undefined },
      { label: "Received", value: fmt(a.created_at) },
      { label: "Experience", value: a.experience, long: true },
      { label: "Story", value: a.story, long: true },
    ],
  };
}

function DetailModal({ detail, onClose }: { detail: Detail; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="ed-modal-bg" onClick={onClose}>
      <div className="ed-modal" role="dialog" aria-modal="true" aria-label={detail.title} onClick={(e) => e.stopPropagation()}>
        <h3>
          {detail.title}
          <span className="sub-detail-sub">{detail.subtitle}</span>
        </h3>
        <dl className="sub-detail">
          {detail.fields.map((f) => (
            <div className={`sub-detail-row${f.long ? " long" : ""}`} key={f.label}>
              <dt>{f.label}</dt>
              <dd>
                {!f.value ? (
                  <span className="muted">—</span>
                ) : f.href ? (
                  <a href={f.href} target={f.href.startsWith("http") ? "_blank" : undefined} rel="noreferrer">{f.value}</a>
                ) : (
                  f.value
                )}
              </dd>
            </div>
          ))}
        </dl>
        <div className="sub-detail-foot">
          <button type="button" className="adm-btn ghost sm" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}

export function SubmissionsList({ messages, applications }: { messages: Message[]; applications: Application[] }) {
  const [msgQuery, setMsgQuery] = useState("");
  const [appQuery, setAppQuery] = useState("");
  const [appRole, setAppRole] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [detail, setDetail] = useState<Detail | null>(null);

  const roles = useMemo(
    () => Array.from(new Set(applications.map((a) => a.role).filter(Boolean))).sort() as string[],
    [applications]
  );

  const filteredMessages = useMemo(() => {
    const q = msgQuery.trim().toLowerCase();
    return messages.filter((m) => {
      if (!inDateRange(m.created_at, from, to)) return false;
      if (!q) return true;
      return [m.name, m.email, m.message].some((v) => v?.toLowerCase().includes(q));
    });
  }, [messages, msgQuery, from, to]);

  const filteredApplications = useMemo(() => {
    const q = appQuery.trim().toLowerCase();
    return applications.filter((a) => {
      if (!inDateRange(a.created_at, from, to)) return false;
      if (appRole && a.role !== appRole) return false;
      if (!q) return true;
      return [a.first_name, a.last_name, a.email, a.phone, a.linkedin, a.experience, a.story]
        .some((v) => v?.toLowerCase().includes(q));
    });
  }, [applications, appQuery, appRole, from, to]);

  /** Rows open the detail view on click, Enter or Space. */
  const openable = (d: Detail) => ({
    role: "button" as const,
    tabIndex: 0,
    onClick: () => setDetail(d),
    onKeyDown: (e: React.KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setDetail(d); }
    },
  });

  return (
    <>
      <div className="wp-panel">
        <div className="sub-filters">
          <span className="s">Date range</span>
          <input className="ed-input" type="date" value={from} onChange={(e) => setFrom(e.target.value)} aria-label="From date" />
          <span className="s">to</span>
          <input className="ed-input" type="date" value={to} onChange={(e) => setTo(e.target.value)} aria-label="To date" />
          {(from || to) && (
            <button type="button" className="adm-btn ghost sm" onClick={() => { setFrom(""); setTo(""); }}>Clear</button>
          )}
        </div>
      </div>

      <div className="wp-panel">
        <h2>Messages &amp; call requests ({filteredMessages.length}{filteredMessages.length !== messages.length ? ` of ${messages.length}` : ""})</h2>
        <div className="sub-filters">
          <input
            className="ed-input"
            type="search"
            placeholder="Search name, email, message…"
            value={msgQuery}
            onChange={(e) => setMsgQuery(e.target.value)}
          />
        </div>
        {filteredMessages.length === 0 ? (
          <div className="wp-row"><span className="s">{messages.length === 0 ? "No messages yet." : "No messages match the filters."}</span></div>
        ) : filteredMessages.map((m) => (
          <div className="wp-row sub-row" key={m.id} {...openable(messageDetail(m))}>
            <div className="sub-row-main">
              <div className="t">{m.name || "—"} · <span className="s">{m.email}</span></div>
              <div className="s clip">{m.message}</div>
            </div>
            <div className="sp" />
            <span className="s">{fmt(m.created_at)}</span>
            <span className="adm-btn ghost sm">View</span>
          </div>
        ))}
      </div>

      <div className="wp-panel">
        <h2>Applications ({filteredApplications.length}{filteredApplications.length !== applications.length ? ` of ${applications.length}` : ""})</h2>
        <div className="sub-filters">
          <input
            className="ed-input"
            type="search"
            placeholder="Search name, email, phone…"
            value={appQuery}
            onChange={(e) => setAppQuery(e.target.value)}
          />
          <select className="ed-select" value={appRole} onChange={(e) => setAppRole(e.target.value)} aria-label="Filter by role">
            <option value="">All roles</option>
            {roles.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>
        {filteredApplications.length === 0 ? (
          <div className="wp-row"><span className="s">{applications.length === 0 ? "No applications yet." : "No applications match the filters."}</span></div>
        ) : filteredApplications.map((a) => (
          <div className="wp-row sub-row" key={a.id} {...openable(applicationDetail(a))}>
            <div className="sub-row-main">
              <div className="t">{a.first_name} {a.last_name} · <span className="s">{a.role}</span></div>
              <div className="s">{a.email} · {a.phone} · English {a.english}{a.source ? ` · ${a.source}` : ""}{a.resume_url ? " · CV" : ""}</div>
              {a.story && <div className="s clip">{a.story}</div>}
            </div>
            <div className="sp" />
            <span className="s">{fmt(a.created_at)}</span>
            <span className="adm-btn ghost sm">View</span>
          </div>
        ))}
      </div>

      {detail && <DetailModal detail={detail} onClose={() => setDetail(null)} />}
    </>
  );
}
