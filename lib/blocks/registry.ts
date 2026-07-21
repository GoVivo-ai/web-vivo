import type { BlockDef, FieldDef } from "./types";

const cta = (key: string, label: string): FieldDef => ({ key, label, type: "cta" });
const txt = (key: string, label: string): FieldDef => ({ key, label, type: "text" });
const area = (key: string, label: string): FieldDef => ({ key, label, type: "textarea" });
const rich = (key: string, label: string, help?: string): FieldDef => ({ key, label, type: "richtext", help });

const ICON_HELP = "Lucide icon name, e.g. phone-incoming, trending-up, layout-dashboard.";
const RICH_HELP = "Supports simple HTML: <b>, <span class=\"hl\">, <span class=\"em\">, <a>.";

/** Item sub-schemas reused across blocks */
const iconItem: FieldDef[] = [
  { key: "icon", label: "Icon", type: "text", help: ICON_HELP },
  txt("title", "Title"),
  area("text", "Text"),
];

export const BLOCKS: BlockDef[] = [
  {
    type: "hero", label: "Hero", icon: "panel-top", group: "Headers",
    fields: [
      { key: "variant", label: "Background", type: "select", options: ["photo", "placeholder"] },
      { key: "image", label: "Background photo", type: "image", help: "Used when Background = photo." },
      txt("imageAlt", "Photo alt text"),
      txt("crumb", "Back link label (role pages)"),
      txt("crumbHref", "Back link href"),
      txt("eyebrow", "Eyebrow"),
      area("title", "Title"),
      area("lead", "Lead"),
      { key: "roleMeta", label: "Meta chips (role pages)", type: "items", itemLabel: "chip", fields: [{ key: "icon", label: "Icon", type: "text", help: ICON_HELP }, txt("text", "Text")] },
      cta("primaryCta", "Primary button"),
      cta("secondaryCta", "Secondary button"),
      rich("photoNote", "Photo note (placeholder heroes)", RICH_HELP),
    ],
    defaults: { variant: "placeholder", eyebrow: "Eyebrow", title: "Headline", primaryCta: { label: "Book a clarity call", href: "/book" } },
  },
  {
    type: "proof", label: "Proof strip", icon: "quote", group: "Content",
    fields: [rich("main", "Main text", RICH_HELP), txt("sub", "Sub text")],
    defaults: { main: "Trusted by <span class=\"hl\">operators</span>." },
  },
  {
    type: "capGrid", label: "Capability grid", icon: "grid-3x3", group: "Content",
    fields: [
      { key: "surface", label: "Surface", type: "select", options: ["white", "tint"] },
      txt("eyebrow", "Eyebrow"), area("title", "Title"), area("lead", "Lead"),
      { key: "cols", label: "Columns", type: "select", options: ["2", "3", "4"] },
      { key: "items", label: "Cards", type: "items", itemLabel: "card", fields: iconItem },
      { key: "teaser", label: "Tech teaser (optional)", type: "items", itemLabel: "teaser", fields: [{ key: "icon", label: "Icon", type: "text", help: ICON_HELP }, txt("title", "Title"), area("text", "Text"), txt("label", "Link label"), txt("href", "Link href")] },
    ],
    defaults: { cols: "3", eyebrow: "How we operate", title: "Title", items: [] },
  },
  {
    type: "stepsNavy", label: "Steps (navy)", icon: "list-ordered", group: "Content",
    fields: [
      txt("eyebrow", "Eyebrow"), area("title", "Title"), area("lead", "Lead"),
      { key: "steps", label: "Steps", type: "items", itemLabel: "step", fields: [txt("num", "Number"), txt("title", "Title"), area("text", "Text")] },
      cta("cta", "Button"),
    ],
    defaults: { eyebrow: "How we build your team", title: "Title", steps: [] },
  },
  {
    type: "stepsVertical", label: "Steps (vertical)", icon: "list-tree", group: "Content",
    fields: [
      txt("eyebrow", "Eyebrow"), area("title", "Title"),
      { key: "steps", label: "Steps", type: "items", itemLabel: "step", fields: [txt("num", "Number"), txt("label", "Small label"), txt("title", "Title"), area("text", "Text")] },
    ],
    defaults: { eyebrow: "The process", title: "Title", steps: [] },
  },
  {
    type: "indCards", label: "Industry / role cards", icon: "layout-grid", group: "Content",
    fields: [
      { key: "surface", label: "Surface", type: "select", options: ["white", "tint"] },
      txt("anchor", "Anchor id (optional)"),
      txt("eyebrow", "Eyebrow"), area("title", "Title"), area("lead", "Lead"),
      { key: "cols", label: "Columns", type: "select", options: ["2", "3"] },
      { key: "cards", label: "Cards", type: "items", itemLabel: "card", fields: [rich("tag", "Tag"), txt("title", "Title"), area("text", "Text"), rich("label", "Link label"), txt("href", "Link href"), txt("topColor", "Top border color (optional)")] },
    ],
    defaults: { cols: "3", eyebrow: "Industries", title: "Title", cards: [] },
  },
  {
    type: "costGridNavy", label: "Cost items (navy)", icon: "badge-check", group: "Content",
    fields: [
      txt("eyebrow", "Eyebrow"), area("title", "Title"),
      { key: "leads", label: "Lead paragraphs", type: "list", itemLabel: "paragraph", richItems: true },
      { key: "cols", label: "Columns", type: "select", options: ["2", "3", "4"] },
      { key: "items", label: "Items", type: "items", itemLabel: "item", fields: iconItem },
    ],
    defaults: { cols: "2", eyebrow: "What to expect", title: "Title", items: [] },
  },
  {
    type: "faq", label: "FAQ", icon: "circle-help", group: "Content",
    fields: [
      { key: "surface", label: "Surface", type: "select", options: ["white", "tint"] },
      txt("eyebrow", "Eyebrow"), area("title", "Title"),
      { key: "items", label: "Questions", type: "items", itemLabel: "Q&A", fields: [txt("q", "Question"), rich("a", "Answer", RICH_HELP)] },
    ],
    defaults: { eyebrow: "FAQ", title: "Title", items: [] },
  },
  {
    type: "ctaBand", label: "CTA band", icon: "megaphone", group: "Footers",
    fields: [
      txt("eyebrow", "Eyebrow"), area("title", "Title"), rich("lead", "Lead", RICH_HELP),
      cta("primaryCta", "Primary button"), cta("secondaryCta", "Secondary button"),
      rich("talentNote", "Talent note (optional)", RICH_HELP),
    ],
    defaults: { eyebrow: "Book a clarity call", title: "Title", primaryCta: { label: "Book a clarity call", href: "/book" } },
  },
  {
    type: "contrast", label: "Contrast cards", icon: "columns-3", group: "Content",
    fields: [
      txt("eyebrow", "Eyebrow"), area("title", "Title"), area("lead", "Lead"),
      { key: "cards", label: "Cards", type: "items", itemLabel: "card", fields: [rich("title", "Title (html)", RICH_HELP), area("text", "Text")] },
    ],
    defaults: { eyebrow: "Why owners hesitate", title: "Title", cards: [] },
  },
  {
    type: "costValue", label: "Cost & value", icon: "scale", group: "Content",
    fields: [
      txt("eyebrow", "Eyebrow"), area("title", "Title"),
      { key: "leads", label: "Lead paragraphs", type: "list", itemLabel: "paragraph", richItems: true },
      { key: "cards", label: "Value cards", type: "items", itemLabel: "card", fields: [{ key: "icon", label: "Icon", type: "text", help: ICON_HELP }, rich("fig", "Big figure"), { key: "highlight", label: "Highlighted", type: "boolean" }, txt("title", "Title"), area("text", "Text")] },
      area("midLead", "Middle paragraph"),
      { key: "checklist", label: "Checklist", type: "items", itemLabel: "item", fields: [txt("title", "Title"), area("text", "Text")] },
      cta("cta", "Button"),
    ],
    defaults: { eyebrow: "Cost & value", title: "Less cost. More operation.", cards: [], checklist: [] },
  },
  {
    type: "techLayer", label: "Technology layer", icon: "cpu", group: "Content",
    fields: [
      txt("eyebrow", "Eyebrow"), area("title", "Title"), area("lead", "Lead"),
      { key: "caps", label: "Capabilities", type: "items", itemLabel: "capability", fields: iconItem },
      rich("footLead", "Closing paragraph", RICH_HELP),
    ],
    defaults: { eyebrow: "Talent + technology", title: "Title", caps: [] },
  },
  {
    type: "compare", label: "Comparison table", icon: "table", group: "Content",
    fields: [
      txt("eyebrow", "Eyebrow"), area("title", "Title"),
      { key: "columns", label: "Column headers", type: "list", itemLabel: "column" },
      { key: "rows", label: "Rows", type: "items", itemLabel: "row", fields: [txt("label", "Row label"), { key: "cells", label: "Cells (html)", type: "list", itemLabel: "cell", richItems: true }] },
      rich("note", "Note", RICH_HELP),
    ],
    defaults: { eyebrow: "Vivo vs the alternatives", title: "Title", columns: [], rows: [] },
  },
  {
    type: "splitDo", label: "Split: what we do", icon: "panels-left-bottom", group: "Content",
    fields: [
      { key: "surface", label: "Surface", type: "select", options: ["white", "tint"] },
      { key: "imageSide", label: "Image side", type: "select", options: ["left", "right"] },
      txt("ratio", "Image ratio (e.g. 120%)"),
      { key: "image", label: "Photo", type: "image" }, txt("phLabel", "Placeholder label"), txt("phSpec", "Placeholder spec"),
      txt("eyebrow", "Eyebrow"), area("title", "Title"),
      { key: "items", label: "Items", type: "items", itemLabel: "item", fields: [{ key: "icon", label: "Icon", type: "text", help: ICON_HELP }, txt("title", "Title"), rich("text", "Text", RICH_HELP)] },
    ],
    defaults: { imageSide: "right", eyebrow: "What we do", title: "Title", items: [] },
  },
  {
    type: "teaser", label: "Teaser (link out)", icon: "arrow-right-circle", group: "Content",
    fields: [txt("eyebrow", "Eyebrow"), area("title", "Title"), area("text", "Text"), cta("cta", "Button")],
    defaults: { eyebrow: "How it works", title: "Title", cta: { label: "See the full process", href: "/how-it-works" } },
  },
  {
    type: "proofBlockNavy", label: "Proof quote (navy)", icon: "quote", group: "Content",
    fields: [txt("eyebrow", "Eyebrow"), area("title", "Title"), area("quote", "Quote"), txt("cite", "Citation")],
    defaults: { eyebrow: "Real proof", title: "Title", quote: "" },
  },
  {
    type: "leadSection", label: "Lead section", icon: "text", group: "Content",
    fields: [
      { key: "surface", label: "Surface", type: "select", options: ["white", "tint"] },
      { key: "narrow", label: "Narrow width", type: "boolean" },
      txt("eyebrow", "Eyebrow"), area("title", "Title"),
      { key: "leads", label: "Paragraphs", type: "list", itemLabel: "paragraph", richItems: true },
    ],
    defaults: { eyebrow: "Results", title: "Title", leads: [] },
  },
  {
    type: "originNavy", label: "Origin story (navy)", icon: "book-open", group: "Headers",
    fields: [txt("eyebrow", "Eyebrow"), area("title", "Title"), area("lead", "Lead")],
    defaults: { eyebrow: "About us", title: "Title", lead: "" },
  },
  {
    type: "founders", label: "Founders grid", icon: "users", group: "Content",
    fields: [
      txt("eyebrow", "Eyebrow"), area("title", "Title"),
      { key: "people", label: "People", type: "items", itemLabel: "person", fields: [{ key: "image", label: "Portrait", type: "image" }, txt("name", "Name"), txt("role", "Role"), area("text", "Bio")] },
    ],
    defaults: { eyebrow: "Founders", title: "Title", people: [] },
  },
  {
    type: "splitText", label: "Split: text + photo", icon: "panels-top-left", group: "Content",
    fields: [
      { key: "surface", label: "Surface", type: "select", options: ["white", "tint"] },
      { key: "imageSide", label: "Image side", type: "select", options: ["left", "right"] },
      txt("ratio", "Image ratio (e.g. 70%)"),
      { key: "image", label: "Photo", type: "image" }, txt("phTag", "Placeholder tag"), txt("phLabel", "Placeholder label"), txt("phSpec", "Placeholder spec"),
      txt("eyebrow", "Eyebrow"), area("title", "Title"), rich("lead", "Lead", RICH_HELP),
      { key: "list", label: "Bullet list (optional)", type: "list", itemLabel: "bullet", richItems: true },
      cta("cta", "Button (optional)"),
    ],
    defaults: { imageSide: "right", eyebrow: "Our team", title: "Title" },
  },
  {
    type: "insightsHero", label: "Insights hero", icon: "newspaper", group: "Headers",
    fields: [txt("eyebrow", "Eyebrow"), area("title", "Title"), area("lead", "Lead")],
    defaults: { eyebrow: "Insights", title: "Title" },
  },
  {
    type: "insightsHub", label: "Insights hub", icon: "layout-dashboard", group: "Content",
    fields: [
      { key: "chips", label: "Filter chips", type: "list", itemLabel: "chip", richItems: true },
      { key: "featured", label: "Featured case study", type: "items", itemLabel: "featured", fields: [txt("cat", "Category"), area("title", "Title"), area("text", "Text"), { key: "bullets", label: "Bullets", type: "list", itemLabel: "bullet" }, cta("cta", "Button")] },
      { key: "articles", label: "Article cards", type: "items", itemLabel: "article", fields: [txt("cat", "Category"), txt("title", "Title"), area("text", "Text"), txt("phLabel", "Image label"), txt("phSpec", "Image spec")] },
      area("launchNote", "Launch note"),
    ],
    defaults: { chips: [], articles: [] },
  },
  {
    type: "roleIntro", label: "Role intro", icon: "user-round", group: "Content",
    fields: [txt("eyebrow", "Eyebrow"), rich("lead", "Lead", RICH_HELP)],
    defaults: { eyebrow: "The role at Vivo", lead: "" },
  },
  {
    type: "roleSplitLists", label: "Role: do / success", icon: "list-checks", group: "Content",
    fields: [
      txt("leftEyebrow", "Left eyebrow"), { key: "left", label: "Left list", type: "list", itemLabel: "item", richItems: true },
      txt("rightEyebrow", "Right eyebrow"), { key: "right", label: "Right list (metric)", type: "list", itemLabel: "item", richItems: true },
    ],
    defaults: { leftEyebrow: "What you'll do", rightEyebrow: "What success looks like", left: [], right: [] },
  },
  {
    type: "requirements", label: "Requirements", icon: "clipboard-list", group: "Content",
    fields: [
      txt("eyebrow", "Eyebrow"), area("title", "Title"),
      { key: "must", label: "Must have", type: "list", itemLabel: "item", richItems: true },
      { key: "nice", label: "Nice to have", type: "list", itemLabel: "item", richItems: true },
      { key: "notForYou", label: "Not for you if", type: "list", itemLabel: "item", richItems: true },
    ],
    defaults: { eyebrow: "Requirements", title: "What we're looking for.", must: [], nice: [], notForYou: [] },
  },
  {
    type: "offer", label: "What we offer", icon: "gift", group: "Content",
    fields: [
      txt("eyebrow", "Eyebrow"), area("title", "Title"),
      { key: "colA", label: "Column A", type: "list", itemLabel: "item" },
      { key: "colB", label: "Column B", type: "list", itemLabel: "item" },
    ],
    defaults: { eyebrow: "What we offer", title: "Title", colA: [], colB: [] },
  },
  {
    type: "hiringSteps", label: "Hiring steps", icon: "footprints", group: "Content",
    fields: [txt("eyebrow", "Eyebrow"), area("title", "Title"), { key: "steps", label: "Steps", type: "list", itemLabel: "step" }],
    defaults: { eyebrow: "How hiring works", title: "Five steps. Clear the whole way.", steps: [] },
  },
  {
    type: "applyForm", label: "Application form", icon: "send", group: "Forms",
    fields: [
      txt("anchor", "Anchor id"), area("title", "Title"), txt("role", "Role name"),
      txt("experienceLabel", "Experience question"), txt("storyLabel", "Story question"),
      { key: "defaultEnglish", label: "Default English", type: "select", options: ["B2", "C1", "C2", "Native"] },
    ],
    defaults: { anchor: "apply", title: "Apply.", role: "Role" },
  },
  {
    type: "bookHero", label: "Book a call", icon: "calendar-clock", group: "Forms",
    fields: [
      txt("eyebrow", "Eyebrow"), area("title", "Title"), area("lead", "Lead"),
      { key: "expect", label: "What to expect", type: "list", itemLabel: "point" },
      txt("panelTitle", "Panel title"), txt("panelSub", "Panel subtitle"),
      txt("calendlyUrl", "Calendly embed URL", ),
    ],
    defaults: { eyebrow: "Book a clarity call", title: "One conversation. A clear picture.", expect: [] },
  },
];

export const BLOCK_BY_TYPE: Record<string, BlockDef> = Object.fromEntries(BLOCKS.map((b) => [b.type, b]));

export function blockLabel(type: string): string {
  return BLOCK_BY_TYPE[type]?.label || type;
}
export function blockIcon(type: string): string {
  return BLOCK_BY_TYPE[type]?.icon || "square";
}
