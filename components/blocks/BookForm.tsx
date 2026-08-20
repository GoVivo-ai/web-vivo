"use client";
import { useEffect, useRef, useState } from "react";
import { Reveal } from "../Reveal";
import { Icon } from "../Icon";
import { Rich } from "./ui";

/* Cal.com official embed loader — the inline embed reports its own height,
   so the calendar grows with its content instead of scrolling inside an iframe. */
function loadCalEmbed() {
  const w = window as any;
  if (w.Cal?.loaded !== undefined) return;
  (function (C: any, A: string, L: string) {
    const p = function (a: any, ar: any) { a.q.push(ar); };
    const d = C.document;
    C.Cal = C.Cal || function () {
      const cal = C.Cal; const ar = arguments;
      if (!cal.loaded) { cal.ns = {}; cal.q = cal.q || []; d.head.appendChild(d.createElement("script")).src = A; cal.loaded = true; }
      if (ar[0] === L) {
        const api: any = function () { p(api, arguments); };
        const namespace = ar[1]; api.q = api.q || [];
        if (typeof namespace === "string") { cal.ns[namespace] = cal.ns[namespace] || api; p(cal.ns[namespace], ar); p(cal, ["initNamespace", namespace]); } else p(cal, ar);
        return;
      }
      p(cal, ar);
    };
  })(window, "https://app.cal.com/embed/embed.js", "init");
}

function CalInline({ calLink }: { calLink: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    ref.current.innerHTML = "";
    loadCalEmbed();
    const Cal = (window as any).Cal;
    Cal("init", "vivo", { origin: "https://cal.com" });
    Cal.ns.vivo("inline", {
      elementOrSelector: ref.current,
      calLink,
      config: { theme: "light" },
    });
    Cal.ns.vivo("ui", {
      theme: "light",
      hideEventTypeDetails: true,
      styles: { branding: { brandColor: "#04D98B" } },
    });
  }, [calLink]);
  return <div ref={ref} className="cal-inline" />;
}

/** "felipe-jimenez/vivo" out of any cal.com URL; null for non-Cal providers. */
function calLinkFrom(url: string): string | null {
  const m = url.match(/^https?:\/\/(?:app\.)?cal\.com\/([^?#]+)/i);
  return m ? m[1].replace(/\/+$/, "") : null;
}

export function BookBlock({
  eyebrow = "Book a clarity call",
  title = "One conversation. A clear picture.",
  lead,
  expect = [],
  panelTitle = "Pick a time",
  panelSub,
  calendlyUrl,
}: {
  eyebrow?: string;
  title?: string;
  lead?: string;
  expect?: string[];
  panelTitle?: string;
  panelSub?: string;
  calendlyUrl?: string;
}) {
  const [tab, setTab] = useState<"calendar" | "message">("calendar");
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const calLink = calendlyUrl ? calLinkFrom(calendlyUrl) : null;

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("sending");
    const fd = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(fd.entries())),
      });
      setState(res.ok ? "done" : "error");
    } catch {
      setState("error");
    }
  }

  return (
    <section className="section section--navy on-dark">
      <div className="container">
        <div className="book-grid">
          <Reveal>
            <span className="eyebrow">{eyebrow}</span>
            <h1 style={{ fontSize: "var(--fs-h1)", margin: "22px 0 22px" }}>{title}</h1>
            {lead && <p className="lead"><Rich html={lead} /></p>}
            <ul className="expect-list">
              {expect.map((t, i) => (
                <li key={i}><span className="n">{i + 1}</span><p>{t}</p></li>
              ))}
            </ul>
          </Reveal>
          <Reveal className="panel">
            {calendlyUrl ? (
              <div className="panel-tabs" role="tablist" aria-label="How would you like to reach us?">
                <button type="button" role="tab" aria-selected={tab === "calendar"} className={tab === "calendar" ? "active" : ""} onClick={() => setTab("calendar")}>
                  <Icon name="calendar-clock" style={{ width: 17, height: 17 }} /> {panelTitle}
                </button>
                <button type="button" role="tab" aria-selected={tab === "message"} className={tab === "message" ? "active" : ""} onClick={() => setTab("message")}>
                  Send a message
                </button>
              </div>
            ) : (
              <>
                <h3>{panelTitle}</h3>
                {panelSub && <p className="sub">{panelSub}</p>}
              </>
            )}
            {calendlyUrl && tab === "calendar" ? (
              calLink ? (
                <CalInline calLink={calLink} />
              ) : (
                <div style={{ borderRadius: "var(--radius-lg)", overflow: "hidden" }}>
                  <iframe title="Book a call" src={calendlyUrl} style={{ width: "100%", height: 630, border: 0 }} />
                </div>
              )
            ) : null}
            {!calendlyUrl && (
              <>
                <div className="cal-ph">
                  <div className="cal-icon"><Icon name="calendar-clock" style={{ width: 46, height: 46 }} /></div>
                  <b>Calendar embed</b>
                  <p style={{ color: "var(--vivo-mid)", fontSize: "var(--fs-sm)", marginTop: 6 }}>Front and center on launch.</p>
                  <p className="note">[ Set Calendar URL in Admin → Settings ]</p>
                </div>
                <div className="divider-or">or send a message</div>
              </>
            )}
            {(!calendlyUrl || tab === "message") && (
              state === "done" ? (
                <p className="sub" style={{ marginBottom: 0, color: "var(--vivo-navy)" }}>Message sent — we&apos;ll get back to you shortly.</p>
              ) : (
                <form className="form" onSubmit={onSubmit}>
                  <div className="field"><label htmlFor="b-name">Name</label><input className="input" id="b-name" name="name" type="text" placeholder="Your name" required /></div>
                  <div className="field"><label htmlFor="b-email">Email</label><input className="input" id="b-email" name="email" type="email" placeholder="you@business.com" required /></div>
                  <div className="field"><label htmlFor="b-msg">What would you like help with?</label><textarea className="input" id="b-msg" name="message" placeholder="A sentence or two about your operation" /></div>
                  <button className="btn btn-primary btn-lg" type="submit" disabled={state === "sending"}>
                    <span>{state === "sending" ? "Sending…" : "Send message"}</span>
                  </button>
                  {state === "error" && <p className="sub" style={{ color: "var(--vivo-yellow-600)" }}>Something went wrong. Please try again.</p>}
                </form>
              )
            )}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
