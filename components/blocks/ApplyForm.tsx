"use client";
import { useState } from "react";
import { Icon } from "../Icon";
import { Reveal } from "../Reveal";

export function ApplyForm({
  anchor,
  eyebrow = "Apply",
  title,
  role,
  experienceLabel,
  storyLabel,
  defaultEnglish = "C1",
}: {
  anchor?: string;
  eyebrow?: string;
  title?: string;
  role?: string;
  experienceLabel?: string;
  storyLabel?: string;
  defaultEnglish?: string;
}) {
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("sending");
    const fd = new FormData(e.currentTarget);
    const payload = Object.fromEntries(fd.entries());
    try {
      const res = await fetch("/api/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role, ...payload }),
      });
      setState(res.ok ? "done" : "error");
    } catch {
      setState("error");
    }
  }

  return (
    <section className="section section--navy on-dark" id={anchor}>
      <div className="container narrow" style={{ margin: "0 auto" }}>
        <div className="section-head reveal" style={{ textAlign: "center", marginBottom: "var(--space-7)" }}>
          <span className="eyebrow" style={{ justifyContent: "center" }}>{eyebrow}</span>
          <h2>{title}</h2>
        </div>
        {state === "done" ? (
          <Reveal className="panel" style={{ textAlign: "center" }}>
            <h3>Application received.</h3>
            <p className="sub" style={{ marginBottom: 0 }}>Thank you — our team will review it and reach out about next steps.</p>
          </Reveal>
        ) : (
          <Reveal as="form" className="form two" onSubmit={onSubmit as any}>
            <div className="field"><label>First name</label><input className="input" name="first_name" type="text" placeholder="First name" required /></div>
            <div className="field"><label>Last name</label><input className="input" name="last_name" type="text" placeholder="Last name" required /></div>
            <div className="field"><label>Email</label><input className="input" name="email" type="email" placeholder="you@email.com" required /></div>
            <div className="field"><label>Phone</label><input className="input" name="phone" type="tel" placeholder="+1 555 000 0000" /></div>
            <div className="field"><label>LinkedIn</label><input className="input" name="linkedin" type="url" placeholder="linkedin.com/in/you" /></div>
            <div className="field"><label>Self-rated English</label>
              <select className="input" name="english" defaultValue={defaultEnglish}>
                <option>B2</option><option>C1</option><option>C2</option><option>Native</option>
              </select>
            </div>
            <div className="field full"><label>{experienceLabel} <span className="hint">(optional)</span></label><input className="input" name="experience" type="text" placeholder="e.g. 3" /></div>
            <div className="field full"><label>{storyLabel} <span className="hint">(2–3 sentences)</span></label><textarea className="input" name="story" /></div>
            <div className="field full"><label>Resume</label><label className="file-drop" htmlFor="apply-file">Drop your resume here or click to upload · PDF, DOCX<input id="apply-file" name="resume" type="file" style={{ display: "none" }} /></label></div>
            <div className="field full" style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
              <input type="checkbox" id="apply-consent" required />
              <label htmlFor="apply-consent" style={{ color: "var(--text-on-dark-muted)", fontWeight: 400 }}>I agree to the privacy policy.</label>
            </div>
            <div className="field full">
              <button className="btn btn-primary btn-lg" type="submit" disabled={state === "sending"}>
                <span>{state === "sending" ? "Submitting…" : "Submit application"}</span><Icon name="arrow-right" />
              </button>
              {state === "error" && <p className="sub" style={{ color: "var(--vivo-yellow)", marginTop: 12 }}>Something went wrong. Please try again.</p>}
            </div>
          </Reveal>
        )}
      </div>
    </section>
  );
}
