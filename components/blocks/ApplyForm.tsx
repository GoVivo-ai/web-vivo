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
  const [error, setError] = useState("");
  const [resumeName, setResumeName] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("sending");
    setError("");
    // Sent as multipart so the resume file travels with the rest of the answers.
    const fd = new FormData(e.currentTarget);
    if (role) fd.set("role", role);
    try {
      const res = await fetch("/api/apply", { method: "POST", body: fd });
      if (res.ok) return setState("done");
      const body = await res.json().catch(() => null);
      setError(body?.error ? String(body.error) : "");
      setState("error");
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
            <div className="field"><label>Phone</label><input className="input" name="phone" type="tel" placeholder="+1 555 000 0000" required /></div>
            <div className="field"><label>LinkedIn</label><input className="input" name="linkedin" type="url" placeholder="https://linkedin.com/in/you" required /></div>
            <div className="field"><label>Self-rated English</label>
              <select className="input" name="english" defaultValue={defaultEnglish} required>
                <option>B2</option><option>C1</option><option>C2</option><option>Native</option>
              </select>
            </div>
            <div className="field full"><label>{experienceLabel} <span className="hint">(optional)</span></label><input className="input" name="experience" type="text" placeholder="e.g. 3" /></div>
            <div className="field full"><label>{storyLabel} <span className="hint">(optional · 2–3 sentences)</span></label><textarea className="input" name="story" /></div>
            <div className="field full">
              <label>Resume</label>
              <label className="file-drop" htmlFor="apply-file" data-filled={resumeName ? "" : undefined}>
                {resumeName || "Drop your resume here or click to upload · PDF, DOC, DOCX · max 8 MB"}
                <input
                  id="apply-file"
                  name="resume"
                  type="file"
                  accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  required
                  /* Not display:none — a hidden required input is unfocusable and blocks submit. */
                  style={{ position: "absolute", width: 1, height: 1, opacity: 0, pointerEvents: "none" }}
                  onChange={(e) => setResumeName(e.target.files?.[0]?.name || "")}
                />
              </label>
            </div>
            <div className="field full" style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
              <input type="checkbox" id="apply-consent" required />
              <label htmlFor="apply-consent" style={{ color: "var(--text-on-dark-muted)", fontWeight: 400 }}>I agree to the privacy policy.</label>
            </div>
            <div className="field full">
              <button className="btn btn-primary btn-lg" type="submit" disabled={state === "sending"}>
                <span>{state === "sending" ? "Submitting…" : "Submit application"}</span><Icon name="arrow-right" />
              </button>
              {state === "error" && (
                <p className="sub" style={{ color: "var(--vivo-yellow)", marginTop: 12 }}>
                  {error || "Something went wrong. Please try again."}
                </p>
              )}
            </div>
          </Reveal>
        )}
      </div>
    </section>
  );
}
