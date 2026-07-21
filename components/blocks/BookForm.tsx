"use client";
import { useState } from "react";
import { Reveal } from "../Reveal";
import { Icon } from "../Icon";
import { Rich } from "./ui";

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
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");

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
            <h3>{panelTitle}</h3>
            {panelSub && <p className="sub">{panelSub}</p>}
            {calendlyUrl ? (
              <div style={{ borderRadius: "var(--radius-lg)", overflow: "hidden", marginBottom: 22 }}>
                <iframe title="Book a call" src={calendlyUrl} style={{ width: "100%", height: 630, border: 0 }} />
              </div>
            ) : (
              <div className="cal-ph">
                <div className="cal-icon"><Icon name="calendar-clock" style={{ width: 46, height: 46 }} /></div>
                <b>Calendar embed</b>
                <p style={{ color: "var(--vivo-mid)", fontSize: "var(--fs-sm)", marginTop: 6 }}>Front and center on launch.</p>
                <p className="note">[ Set Calendly URL in Admin → Settings ]</p>
              </div>
            )}
            <div className="divider-or">or send a message</div>
            {state === "done" ? (
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
            )}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
