/** Field schema — drives both rendering props and the admin editor forms. */
export type FieldType =
  | "text"
  | "textarea"
  | "richtext" // small inline HTML (bold / span.hl / span.em allowed)
  | "image"
  | "select"
  | "boolean"
  | "cta" // { label, href }
  | "list" // array of strings (or {text} objects rendered as html)
  | "items"; // array of objects described by `fields`

export interface FieldDef {
  key: string;
  label: string;
  type: FieldType;
  help?: string;
  options?: string[]; // for select
  fields?: FieldDef[]; // for items
  itemLabel?: string; // for items/list add button
  richItems?: boolean; // for list: treat entries as html
}

export interface BlockDef {
  type: string;
  label: string;
  icon: string; // lucide name for the admin palette
  group: string; // palette grouping
  fields: FieldDef[];
  defaults: Record<string, unknown>;
}

/** A block instance stored in a page. */
export interface Block {
  id: string;
  type: string;
  hidden?: boolean;
  props: Record<string, unknown>;
}

export interface PageDoc {
  slug: string; // route path without leading slash; "" = home
  path: string; // real route, e.g. "/how-it-works"
  title: string; // browser + admin title
  navGroup: string | null; // which nav item lights up
  description?: string;
  blocks: Block[];
}

export type SiteContent = {
  pages: PageDoc[];
  settings: SiteSettings;
};

export interface SiteSettings {
  nav: { label: string; href: string; group: string }[];
  headerCta: { label: string; href: string };
  footer: {
    blurb: string;
    columns: { heading: string; links: { label: string; href: string }[] }[];
    copyright: string;
    contactLine: string;
  };
}
