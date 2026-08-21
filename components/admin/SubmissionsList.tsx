"use client";

import { useMemo, useState } from "react";

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
  created_at: string;
};

const fmt = (d: string) => new Date(d).toLocaleString();

function inDateRange(created: string, from: string, to: string) {
  const t = new Date(created).getTime();
  if (from && t < new Date(from).getTime()) return false;
  // "to" is inclusive: anything before the end of that day.
  if (to && t >= new Date(to).getTime() + 24 * 60 * 60 * 1000) return false;
  return true;
}

export function SubmissionsList({ messages, applications }: { messages: Message[]; applications: Application[] }) {
  const [msgQuery, setMsgQuery] = useState("");
  const [appQuery, setAppQuery] = useState("");
  const [appRole, setAppRole] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

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
          <div className="wp-row" key={m.id}>
            <div>
              <div className="t">{m.name || "—"} · <span className="s">{m.email}</span></div>
              <div className="s">{m.message}</div>
            </div>
            <div className="sp" />
            <span className="s">{fmt(m.created_at)}</span>
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
          <div className="wp-row" key={a.id}>
            <div>
              <div className="t">{a.first_name} {a.last_name} · <span className="s">{a.role}</span></div>
              <div className="s">{a.email} · {a.phone} · English {a.english}</div>
              {a.story && <div className="s">{a.story}</div>}
            </div>
            <div className="sp" />
            <span className="s">{fmt(a.created_at)}</span>
          </div>
        ))}
      </div>
    </>
  );
}
