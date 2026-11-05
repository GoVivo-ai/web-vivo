/**
 * The one lead shape handed to CRM connectors (Zapier, n8n, Make…), whichever
 * form it came from, so a single mapping in the connector covers both.
 */
export type Lead = {
  id: string;
  type: "contact" | "application";
  source: string;
  name: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  message: string | null;
  role: string | null;
  linkedin: string | null;
  english: string | null;
  experience: string | null;
  resume_url: string | null;
  created_at: string;
};

type Row = Record<string, any>;

export function contactLead(m: Row): Lead {
  const name = (m.name || "").trim();
  const space = name.indexOf(" ");
  return {
    id: m.id,
    type: "contact",
    source: "website",
    name,
    first_name: space < 0 ? name : name.slice(0, space),
    last_name: space < 0 ? "" : name.slice(space + 1).trim(),
    email: m.email,
    phone: null,
    message: m.message ?? null,
    role: null,
    linkedin: null,
    english: null,
    experience: null,
    resume_url: null,
    created_at: m.created_at,
  };
}

export function applicationLead(a: Row, resume_url: string | null): Lead {
  return {
    id: a.id,
    type: "application",
    source: a.source || "website",
    name: `${a.first_name} ${a.last_name}`.trim(),
    first_name: a.first_name,
    last_name: a.last_name,
    email: a.email,
    phone: a.phone ?? null,
    message: a.story ?? null,
    role: a.role ?? null,
    linkedin: a.linkedin ?? null,
    english: a.english ?? null,
    experience: a.experience ?? null,
    resume_url,
    created_at: a.created_at,
  };
}

/** What "Send test lead" delivers, so the connector has fields to map. */
export function sampleLead(): Lead {
  return {
    id: "00000000-0000-0000-0000-000000000000",
    type: "application",
    source: "website",
    name: "Test Lead",
    first_name: "Test",
    last_name: "Lead",
    email: "test.lead@example.com",
    phone: "+1 555 010 0000",
    message: "This is a test lead sent from the Vivo backoffice.",
    role: "Test role",
    linkedin: "https://www.linkedin.com/in/test-lead",
    english: "Advanced",
    experience: "Test experience",
    resume_url: "https://example.com/test-resume.pdf",
    created_at: new Date().toISOString(),
  };
}

const PHONE_LIKE = /^\+?[\d\s().-]+$/;

/**
 * One CSV cell. Form answers are written by strangers and these files open in
 * spreadsheets, so anything that would run as a formula is neutralised;
 * phone numbers keep their leading "+".
 */
function csvCell(value: unknown) {
  let s = value == null ? "" : String(value);
  if (/^[=+\-@\t\r]/.test(s) && !PHONE_LIKE.test(s)) s = `'${s}`;
  return /[",\r\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

/** CSV with a BOM so Excel reads accents correctly. */
export function toCsv(columns: string[], rows: Row[]) {
  const lines = [columns.map(csvCell).join(",")];
  for (const r of rows) lines.push(columns.map((c) => csvCell(r[c])).join(","));
  return `﻿${lines.join("\r\n")}\r\n`;
}
