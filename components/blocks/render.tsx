"use client";
import Link from "next/link";
import { Icon } from "../Icon";
import { Reveal } from "../Reveal";
import { CommandCenter } from "../CommandCenter";
import { Btn, Rich, PhotoSlot, SectionHead, type Cta } from "./ui";
import type { Block } from "@/lib/blocks/types";

type P = Record<string, any>;
const onDark = { color: "#fff" } as const;
const mutedDark = { color: "var(--text-on-dark-muted)" } as const;

/* ── HERO (photo or placeholder) ── */
function Hero({ p }: { p: P }) {
  const placeholder = p.variant === "placeholder";
  return (
    <section className={`hero on-dark${placeholder ? " hero--placeholder" : ""}`}>
      {!placeholder && p.image && (
        <div className="hero-media">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={p.image} alt={p.imageAlt || ""} />
        </div>
      )}
      {!placeholder && <div className="hero-scrim" />}
      <div className="container">
        <Reveal className="hero-inner">
          {p.crumb && (
            <Link className="role-crumb" href={p.crumbHref || "/careers"}>
              <Icon name="arrow-left" /> {p.crumb}
            </Link>
          )}
          <span className="eyebrow">{p.eyebrow}</span>
          {p.h1Small ? (
            <h1 style={{ fontSize: "var(--fs-h1)", margin: "22px 0 24px" }}>{p.title}</h1>
          ) : (
            <h1>{p.title}</h1>
          )}
          {p.lead && <p className="lead">{p.lead}</p>}
          {Array.isArray(p.roleMeta) && p.roleMeta.length > 0 && (
            <div className="role-meta">
              {p.roleMeta.map((m: P, i: number) => (
                <span className="m" key={i}><Icon name={m.icon} /> {m.text}</span>
              ))}
            </div>
          )}
          <div className="hero-cta" style={p.roleMeta ? { marginTop: "var(--space-6)" } : undefined}>
            <Btn cta={p.primaryCta} size="lg" showArrow />
            <Btn cta={p.secondaryCta} variant="secondary" size="lg" />
          </div>
          {p.photoNote && (
            <div className="photo-note"><b>Photo</b> <Rich html={p.photoNote} /></div>
          )}
        </Reveal>
      </div>
    </section>
  );
}

/* ── PROOF STRIP ── */
function Proof({ p }: { p: P }) {
  return (
    <section className="proof">
      <div className="container">
        <p className="p-main"><Rich html={p.main} /></p>
        {p.sub && <p className="p-sub">{p.sub}</p>}
      </div>
    </section>
  );
}

/* ── CAPABILITY GRID (+ optional tech teaser) ── */
function CapGrid({ p }: { p: P }) {
  return (
    <section className={`section${p.surface === "tint" ? " section--tint" : ""}`}>
      <div className="container">
        <Reveal as={SectionHead as any} eyebrow={p.eyebrow} title={p.title} lead={p.lead} />
        <div className={`grid-${p.cols || 3}`}>
          {(p.items || []).map((it: P, i: number) => (
            <Reveal className="cap" key={i}>
              <div className="ic"><Icon name={it.icon} /></div>
              <h4>{it.title}</h4>
              <p>{it.text}</p>
            </Reveal>
          ))}
        </div>
        {p.teaser?.title && (
          <Reveal as={Link as any} className="tech-teaser" href={p.teaser.href || "/how-it-works"}>
            <span className="tic"><Icon name={p.teaser.icon || "layout-dashboard"} /></span>
            <div className="tt"><h4>{p.teaser.title}</h4><p>{p.teaser.text}</p></div>
            <span className="go">{p.teaser.label} <Icon name="arrow-right" /></span>
          </Reveal>
        )}
      </div>
    </section>
  );
}

/* ── STEPS (navy, 4 tiles) ── */
function StepsNavy({ p }: { p: P }) {
  return (
    <section className="section section--navy on-dark">
      <div className="container">
        <Reveal as={SectionHead as any} eyebrow={p.eyebrow} title={p.title} lead={p.lead} />
        <div className="steps">
          {(p.steps || []).map((s: P, i: number) => (
            <Reveal className="step" key={i}>
              <div className="num">{s.num || i + 1}</div>
              <h4>{s.title}</h4>
              <p>{s.text}</p>
            </Reveal>
          ))}
        </div>
        {p.cta?.label && (
          <div style={{ marginTop: "var(--space-7)" }}>
            <Btn cta={p.cta} variant="secondary" showArrow />
          </div>
        )}
      </div>
    </section>
  );
}

/* ── STEPS VERTICAL (how it works) ── */
function StepsVertical({ p }: { p: P }) {
  return (
    <section className="section section--tint">
      <div className="container">
        <Reveal as={SectionHead as any} eyebrow={p.eyebrow} title={p.title} />
        <div className="steps-v">
          {(p.steps || []).map((s: P, i: number) => (
            <Reveal className="step-row" key={i}>
              <div className="num">{s.num || i + 1}<small>{s.label}</small></div>
              <div><h4>{s.title}</h4><p>{s.text}</p></div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── INDUSTRY / ROLE CARDS ── */
function IndCards({ p }: { p: P }) {
  return (
    <section className={`section${p.surface === "tint" ? " section--tint" : ""}`} id={p.anchor}>
      <div className="container">
        <Reveal as={SectionHead as any} eyebrow={p.eyebrow} title={p.title} lead={p.lead} />
        <div className={`grid-${p.cols || 3}`}>
          {(p.cards || []).map((c: P, i: number) => (
            <Reveal as={Link as any} className="ind-card" href={c.href || "#"} key={i}
              style={c.topColor ? { borderTopColor: c.topColor } : undefined}>
              <span className="tag"><Rich html={c.tag} /></span>
              <h4>{c.title}</h4>
              <p><Rich html={c.text} /></p>
              <span className="go"><Rich html={c.label} /> <Icon name="arrow-right" /></span>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── COST ITEMS ON NAVY (what changes / math) ── */
function CostGridNavy({ p }: { p: P }) {
  return (
    <section className="section section--navy on-dark">
      <div className="container">
        <div className="section-head reveal">
          {p.eyebrow && <span className="eyebrow">{p.eyebrow}</span>}
          {p.title && <h2>{p.title}</h2>}
          {(p.leads || []).map((l: string, i: number) => (
            <p className="lead" key={i} style={i ? { marginTop: 16 } : undefined}><Rich html={l} /></p>
          ))}
        </div>
        <div className={`grid-${p.cols || 2}`}>
          {(p.items || []).map((it: P, i: number) => (
            <Reveal className="cost-item" key={i} style={{ background: "rgba(255,255,255,0.04)", borderColor: "var(--border-on-dark)" }}>
              <span className="ck"><Icon name={it.icon} /></span>
              <div><b style={onDark}>{it.title}</b><p style={mutedDark}>{it.text}</p></div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── FAQ ── */
function Faq({ p }: { p: P }) {
  return (
    <section className={`section${p.surface === "tint" ? " section--tint" : ""}`}>
      <div className="container">
        <Reveal as={SectionHead as any} eyebrow={p.eyebrow} title={p.title} />
        <Reveal className="faq">
          {(p.items || []).map((f: P, i: number) => (
            <details key={i}>
              <summary>{f.q}</summary>
              <p><Rich html={f.a} /></p>
            </details>
          ))}
        </Reveal>
      </div>
    </section>
  );
}

/* ── CTA BAND ── */
function CtaBand({ p }: { p: P }) {
  return (
    <section className="section section--navy on-dark cta-band">
      <div className="container narrow" style={{ margin: "0 auto" }}>
        <Reveal>
          <span className="eyebrow">{p.eyebrow}</span>
          <h2>{p.title}</h2>
          {p.lead && <p className="lead"><Rich html={p.lead} /></p>}
          <div className="hero-cta" style={{ justifyContent: "center" }}>
            <Btn cta={p.primaryCta} size="lg" showArrow={!p.secondaryCta} />
            <Btn cta={p.secondaryCta} variant="secondary" size="lg" />
          </div>
          {p.talentNote && (
            <p className="talent-note"><Rich html={p.talentNote} /></p>
          )}
        </Reveal>
      </div>
    </section>
  );
}

/* ── CONTRAST CARDS ── */
function Contrast({ p }: { p: P }) {
  return (
    <section className="section">
      <div className="container">
        <Reveal as={SectionHead as any} eyebrow={p.eyebrow} title={p.title} lead={p.lead} />
        <div className="contrast">
          {(p.cards || []).map((c: P, i: number) => (
            <Reveal className="c" key={i}>
              <h4><Rich html={c.title} /></h4>
              <p>{c.text}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── COST & VALUE (how it works) ── */
function CostValue({ p }: { p: P }) {
  return (
    <section className="section">
      <div className="container">
        <div className="section-head reveal">
          {p.eyebrow && <span className="eyebrow">{p.eyebrow}</span>}
          {p.title && <h2>{p.title}</h2>}
          {(p.leads || []).map((l: string, i: number) => (
            <p className="lead" key={i} style={i ? { marginTop: 16 } : undefined}><Rich html={l} /></p>
          ))}
        </div>
        <div className="grid-2" style={{ alignItems: "stretch" }}>
          {(p.cards || []).map((c: P, i: number) => (
            <Reveal className="cap" key={i} style={c.highlight ? { borderColor: "var(--vivo-green)", boxShadow: "var(--shadow-md)" } : undefined}>
              <div className="ic"><Icon name={c.icon} /></div>
              <div style={{ fontFamily: "var(--font-heading)", fontWeight: "var(--fw-black)" as any, fontSize: "var(--fs-h2)", color: c.highlight ? "var(--vivo-green-700)" : "var(--vivo-navy)", lineHeight: 1 }}>
                <Rich html={c.fig} />
              </div>
              <h4 style={{ margin: "10px 0 8px" }}>{c.title}</h4>
              <p>{c.text}</p>
            </Reveal>
          ))}
        </div>
        {p.midLead && <p className="lead reveal" style={{ marginTop: "var(--space-6)" }}><Rich html={p.midLead} /></p>}
        <div className="cost-list reveal" style={{ marginTop: "var(--space-6)" }}>
          {(p.checklist || []).map((c: P, i: number) => (
            <div className="cost-item" key={i}>
              <span className="ck"><Icon name="check-circle" /></span>
              <div><b>{c.title}</b><p>{c.text}</p></div>
            </div>
          ))}
        </div>
        {p.cta?.label && (
          <div className="reveal" style={{ marginTop: "var(--space-7)" }}>
            <Btn cta={p.cta} size="lg" showArrow />
          </div>
        )}
      </div>
    </section>
  );
}

/* ── TECHNOLOGY LAYER (navy + command center) ── */
function TechLayer({ p }: { p: P }) {
  return (
    <section className="section section--navy on-dark">
      <div className="container">
        <Reveal as={SectionHead as any} eyebrow={p.eyebrow} title={p.title} lead={p.lead} />
        <Reveal style={{ marginBottom: "var(--space-8)" }}><CommandCenter /></Reveal>
        <div className="grid-3">
          {(p.caps || []).map((c: P, i: number) => (
            <Reveal className="cap" key={i} style={{ background: "rgba(255,255,255,0.04)", borderColor: "var(--border-on-dark)" }}>
              <div className="ic" style={{ background: "rgba(4,217,139,0.14)", color: "var(--vivo-green)" }}><Icon name={c.icon} /></div>
              <h4 style={onDark}>{c.title}</h4>
              <p style={mutedDark}>{c.text}</p>
            </Reveal>
          ))}
        </div>
        {p.footLead && (
          <p className="lead reveal" style={{ marginTop: "var(--space-7)", maxWidth: 820 }}><Rich html={p.footLead} /></p>
        )}
      </div>
    </section>
  );
}

/* ── COMPARE TABLE ── */
function Compare({ p }: { p: P }) {
  return (
    <section className="section section--tint">
      <div className="container">
        <Reveal as={SectionHead as any} eyebrow={p.eyebrow} title={p.title} />
        <Reveal className="compare-wrap">
          <table className="compare">
            <thead>
              <tr>
                <th />
                {(p.columns || []).map((c: string, i: number) => (
                  <th key={i} className={i === (p.columns || []).length - 1 ? "vivo" : undefined}>{c}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(p.rows || []).map((r: P, i: number) => (
                <tr key={i}>
                  <th>{r.label}</th>
                  {(r.cells || []).map((cell: string, j: number) => (
                    <td key={j} className={j === (r.cells || []).length - 1 ? "vivo" : undefined}>
                      <Rich html={cell} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </Reveal>
        {p.note && <p className="compare-note reveal"><Rich html={p.note} /></p>}
      </div>
    </section>
  );
}

/* ── SPLIT: what-we-do list + photo (industry pages) ── */
function SplitDo({ p }: { p: P }) {
  const media = (
    <PhotoSlot key="m" src={p.image} ratio={p.ratio || "120%"} tag={p.phTag || "Photo · supporting"} label={p.phLabel} spec={p.phSpec} />
  );
  const text = (
    <div key="t">
      <div className="section-head" style={{ marginBottom: "var(--space-6)" }}>
        {p.eyebrow && <span className="eyebrow">{p.eyebrow}</span>}
        {p.title && <h2>{p.title}</h2>}
      </div>
      <div className="dolist">
        {(p.items || []).map((it: P, i: number) => (
          <div className="doitem" key={i}>
            <div className="ic"><Icon name={it.icon} /></div>
            <div><h4>{it.title}</h4><p><Rich html={it.text} /></p></div>
          </div>
        ))}
      </div>
    </div>
  );
  return (
    <section className={`section${p.surface === "tint" ? " section--tint" : ""}`}>
      <div className="container">
        <div className="split">
          {p.imageSide === "left" ? [<Reveal key="a">{media}</Reveal>, <Reveal key="b">{text}</Reveal>] : [<Reveal key="a">{text}</Reveal>, <Reveal key="b">{media}</Reveal>]}
        </div>
      </div>
    </section>
  );
}

/* ── TEASER (how-it-works link) ── */
function Teaser({ p }: { p: P }) {
  return (
    <section className="section section--tint">
      <div className="container">
        <Reveal className="teaser">
          <div className="tl">
            <span className="eyebrow" style={{ marginBottom: 14 }}>{p.eyebrow}</span>
            <h3>{p.title}</h3>
            {p.text && <p>{p.text}</p>}
          </div>
          <Btn cta={p.cta} variant="secondary" showArrow />
        </Reveal>
      </div>
    </section>
  );
}

/* ── PROOF BLOCK (navy quote) ── */
function ProofBlockNavy({ p }: { p: P }) {
  return (
    <section className="section section--navy on-dark">
      <div className="container">
        <Reveal as={SectionHead as any} eyebrow={p.eyebrow} title={p.title} style={{ marginBottom: "var(--space-6)" }} />
        <Reveal className="proof-block">
          <p className="q">{p.quote}</p>
          <div className="cite">{p.cite}</div>
        </Reveal>
      </div>
    </section>
  );
}

/* ── SIMPLE RESULTS (transportation) ── */
function LeadSection({ p }: { p: P }) {
  return (
    <section className={`section${p.surface === "tint" ? " section--tint" : ""}${p.narrow ? "" : ""}`}>
      <div className={`container${p.narrow ? " narrow" : ""}`} style={p.narrow ? { margin: "0 auto" } : undefined}>
        <Reveal>
          {p.eyebrow && <span className="eyebrow">{p.eyebrow}</span>}
          {p.title && <h2 style={{ marginTop: 18 }}>{p.title}</h2>}
          {(p.leads || []).map((l: string, i: number) => (
            <p className="lead" key={i} style={{ marginTop: 18 }}><Rich html={l} /></p>
          ))}
        </Reveal>
      </div>
    </section>
  );
}

/* ── ABOUT ORIGIN (navy narrow) ── */
function OriginNavy({ p }: { p: P }) {
  return (
    <section className="section section--navy on-dark">
      <div className="container narrow">
        <Reveal>
          <span className="eyebrow">{p.eyebrow}</span>
          <h1 style={{ fontSize: "var(--fs-h1)", margin: "22px 0 24px" }}>{p.title}</h1>
          <p className="lead"><Rich html={p.lead} /></p>
        </Reveal>
      </div>
    </section>
  );
}

/* ── FOUNDERS ── */
function Founders({ p }: { p: P }) {
  return (
    <section className="section">
      <div className="container">
        <Reveal as={SectionHead as any} eyebrow={p.eyebrow} title={p.title} />
        <div className="grid-4">
          {(p.people || []).map((m: P, i: number) => (
            <Reveal className="founder" key={i}>
              <PhotoSlot src={m.image} variant="portrait" tag="Founder portrait" label={m.phLabel || "Editorial, chest-up, eye-level."} spec={m.phSpec || "1200×1500 · 4:5 · <180 KB"} />
              <h4>{m.name}</h4>
              <div className="role">{m.role}</div>
              <p>{m.text}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── SPLIT TEXT + PHOTO (about team/culture) ── */
function SplitText({ p }: { p: P }) {
  const media = <PhotoSlot key="m" src={p.image} ratio={p.ratio || "70%"} tag={p.phTag || "Photo"} label={p.phLabel} spec={p.phSpec} />;
  const text = (
    <div key="t">
      <div className="section-head" style={{ marginBottom: 0 }}>
        {p.eyebrow && <span className="eyebrow">{p.eyebrow}</span>}
        {p.title && <h2>{p.title}</h2>}
        {p.lead && <p className="lead" style={{ marginTop: 18 }}><Rich html={p.lead} /></p>}
        {Array.isArray(p.list) && p.list.length > 0 && (
          <ul className="jd-list" style={{ marginTop: "var(--space-6)" }}>
            {p.list.map((l: string, i: number) => <li key={i}><Rich html={l} /></li>)}
          </ul>
        )}
        {p.cta?.label && (
          <div className="hero-cta" style={{ marginTop: "var(--space-6)" }}>
            <Btn cta={p.cta} variant="secondary" showArrow />
          </div>
        )}
      </div>
    </div>
  );
  return (
    <section className={`section${p.surface === "tint" ? " section--tint" : ""}`}>
      <div className="container">
        <div className="split">
          {p.imageSide === "left" ? [<Reveal key="a">{media}</Reveal>, <Reveal key="b">{text}</Reveal>] : [<Reveal key="a">{text}</Reveal>, <Reveal key="b">{media}</Reveal>]}
        </div>
      </div>
    </section>
  );
}

/* ── INSIGHTS HERO (centered tint) ── */
function InsightsHero({ p }: { p: P }) {
  return (
    <section className="section section--tint">
      <div className="container narrow" style={{ margin: "0 auto" }}>
        <Reveal style={{ textAlign: "center" }}>
          <span className="eyebrow" style={{ justifyContent: "center" }}>{p.eyebrow}</span>
          <h1 style={{ fontSize: "var(--fs-h1)", margin: "22px 0 20px" }}>{p.title}</h1>
          <p className="lead" style={{ margin: "0 auto" }}>{p.lead}</p>
        </Reveal>
      </div>
    </section>
  );
}

/* ── INSIGHTS HUB ── */
function InsightsHub({ p }: { p: P }) {
  return (
    <section className="section">
      <div className="container">
        <Reveal className="chips-row">
          {(p.chips || []).map((c: string, i: number) => (
            <span className={`filter-chip${i === 0 ? " on" : ""}`} key={i}><Rich html={c} /></span>
          ))}
        </Reveal>
        <Reveal className="split wide-text" style={{ alignItems: "start", gap: "var(--space-7)", marginBottom: "var(--space-8)" }}>
          <div><CommandCenter compact /></div>
          <div>
            <span className="cat" style={{ color: "var(--vivo-green-700)", fontSize: "var(--fs-xs)", letterSpacing: "var(--tracking-wide)", textTransform: "uppercase", fontWeight: 700 }}>{p.featured?.cat}</span>
            <h2 style={{ fontSize: "var(--fs-h3)", margin: "14px 0 16px" }}>{p.featured?.title}</h2>
            <p className="lead" style={{ fontSize: "var(--fs-body)", marginBottom: 18 }}>{p.featured?.text}</p>
            <ul className="jd-list" style={{ marginBottom: 22 }}>
              {(p.featured?.bullets || []).map((b: string, i: number) => <li key={i}>{b}</li>)}
            </ul>
            <Btn cta={p.featured?.cta} showArrow />
          </div>
        </Reveal>
        <div className="grid-3">
          {(p.articles || []).map((a: P, i: number) => (
            <Reveal className="art-card" key={i}>
              <PhotoSlot variant="card" tag="Card image" label={a.phLabel} spec={a.phSpec} />
              <div className="body">
                <span className="cat">{a.cat}</span>
                <h4>{a.title}</h4>
                <p style={{ fontFamily: "ui-monospace,monospace", fontSize: 12 }}>{a.text}</p>
                <span className="read">Read <Icon name="arrow-right" /></span>
              </div>
            </Reveal>
          ))}
        </div>
        {p.launchNote && (
          <Reveal className="data-note" style={{ borderColor: "var(--vivo-border)", color: "var(--vivo-mid)", background: "var(--vivo-gray-050)", marginTop: "var(--space-7)" }}>
            <span className="badge" style={{ color: "var(--vivo-green-700)", borderColor: "var(--vivo-green)" }}>Launch note</span>
            <span>{p.launchNote}</span>
          </Reveal>
        )}
      </div>
    </section>
  );
}

/* ── ROLE INTRO (narrow lead) ── */
function RoleIntro({ p }: { p: P }) {
  return (
    <section className="section">
      <div className="container narrow" style={{ margin: "0 auto" }}>
        <Reveal>
          <span className="eyebrow">{p.eyebrow}</span>
          <p className="lead" style={{ marginTop: 18 }}><Rich html={p.lead} /></p>
        </Reveal>
      </div>
    </section>
  );
}

/* ── ROLE SPLIT LISTS (what you'll do / success) ── */
function RoleSplitLists({ p }: { p: P }) {
  return (
    <section className="section section--tint">
      <div className="container">
        <div className="split" style={{ alignItems: "start" }}>
          <Reveal>
            <div className="section-head" style={{ marginBottom: "var(--space-5)" }}><span className="eyebrow">{p.leftEyebrow}</span></div>
            <ul className="jd-list">{(p.left || []).map((l: string, i: number) => <li key={i}><Rich html={l} /></li>)}</ul>
          </Reveal>
          <Reveal>
            <div className="section-head" style={{ marginBottom: "var(--space-5)" }}><span className="eyebrow">{p.rightEyebrow}</span></div>
            <ul className="jd-list metric">{(p.right || []).map((l: string, i: number) => <li key={i}><Rich html={l} /></li>)}</ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ── REQUIREMENTS ── */
function Requirements({ p }: { p: P }) {
  return (
    <section className="section">
      <div className="container">
        <Reveal as={SectionHead as any} eyebrow={p.eyebrow} title={p.title} />
        <Reveal className="req-cols">
          <div><h4>Must have</h4><ul className="jd-list">{(p.must || []).map((l: string, i: number) => <li key={i}><Rich html={l} /></li>)}</ul></div>
          <div><h4>Nice to have</h4><ul className="jd-list">{(p.nice || []).map((l: string, i: number) => <li key={i}><Rich html={l} /></li>)}</ul></div>
        </Reveal>
        <div className="section-head reveal" style={{ margin: "var(--space-8) 0 var(--space-5)" }}><span className="eyebrow">This role is not for you if</span></div>
        <Reveal as="ul" className="jd-list x">{(p.notForYou || []).map((l: string, i: number) => <li key={i}><Rich html={l} /></li>)}</Reveal>
      </div>
    </section>
  );
}

/* ── OFFER (two jd-lists) ── */
function Offer({ p }: { p: P }) {
  return (
    <section className="section section--tint">
      <div className="container">
        <Reveal as={SectionHead as any} eyebrow={p.eyebrow} title={p.title} />
        <Reveal className="grid-2">
          <ul className="jd-list">{(p.colA || []).map((l: string, i: number) => <li key={i}>{l}</li>)}</ul>
          <ul className="jd-list">{(p.colB || []).map((l: string, i: number) => <li key={i}>{l}</li>)}</ul>
        </Reveal>
      </div>
    </section>
  );
}

/* ── HIRING STEPS ── */
function HiringSteps({ p }: { p: P }) {
  return (
    <section className="section">
      <div className="container">
        <Reveal as={SectionHead as any} eyebrow={p.eyebrow} title={p.title} />
        <Reveal className="hire-steps">
          {(p.steps || []).map((s: string, i: number) => (
            <div className="hire-step" key={i}><div className="hn">{i + 1}</div><p>{s}</p></div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}

/* ── APPLY FORM (role pages) ── */
import { ApplyForm } from "./ApplyForm";
function ApplyBlock({ p }: { p: P }) {
  return <ApplyForm {...(p as any)} />;
}

/* ── BOOK HERO ── */
import { BookBlock as BookForm } from "./BookForm";

const MAP: Record<string, (a: { p: P }) => JSX.Element | null> = {
  hero: Hero,
  proof: Proof,
  capGrid: CapGrid,
  stepsNavy: StepsNavy,
  stepsVertical: StepsVertical,
  indCards: IndCards,
  costGridNavy: CostGridNavy,
  faq: Faq,
  ctaBand: CtaBand,
  contrast: Contrast,
  costValue: CostValue,
  techLayer: TechLayer,
  compare: Compare,
  splitDo: SplitDo,
  teaser: Teaser,
  proofBlockNavy: ProofBlockNavy,
  leadSection: LeadSection,
  originNavy: OriginNavy,
  founders: Founders,
  splitText: SplitText,
  insightsHero: InsightsHero,
  insightsHub: InsightsHub,
  roleIntro: RoleIntro,
  roleSplitLists: RoleSplitLists,
  requirements: Requirements,
  offer: Offer,
  hiringSteps: HiringSteps,
  applyForm: ApplyBlock,
  bookHero: ({ p }) => <BookForm {...(p as any)} />,
};

export function BlockView({ block }: { block: Block }) {
  if (block.hidden) return null;
  const Cmp = MAP[block.type];
  if (!Cmp) return null;
  return <Cmp p={block.props as P} />;
}

export function BlocksView({ blocks }: { blocks: Block[] }) {
  return <>{blocks.map((b) => <BlockView key={b.id} block={b} />)}</>;
}
