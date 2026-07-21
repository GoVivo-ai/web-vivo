"use client";
import { useEffect, useRef } from "react";
import { Icon } from "./Icon";

/**
 * Fully synthetic, anonymized command-center mockup.
 * Illustrative sample data only — never wired to a real client account.
 */
export function CommandCenter({ compact = false }: { compact?: boolean }) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const win = ref.current;
    if (!win) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    win.querySelectorAll<SVGPathElement>(".chart-path").forEach((p) => {
      try {
        const len = Math.ceil(p.getTotalLength());
        p.style.setProperty("--len", String(len));
      } catch {
        /* noop */
      }
    });
    const countUp = (el: Element) => {
      const m = (el.textContent || "").match(/^(\D*)([\d,]+)(.*)$/);
      if (!m) return;
      const pre = m[1];
      const suf = m[3];
      const target = parseInt(m[2].replace(/,/g, ""), 10);
      if (reduced || !target) return;
      const dur = 1100;
      const t0 = performance.now();
      const fmt = (n: number) => n.toLocaleString("en-US");
      const tick = (now: number) => {
        const p = Math.min((now - t0) / dur, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = pre + fmt(Math.round(target * eased)) + suf;
        if (p < 1) requestAnimationFrame(tick);
        else el.textContent = pre + fmt(target) + suf;
      };
      el.textContent = pre + "0" + suf;
      requestAnimationFrame(tick);
    };
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            (e.target as HTMLElement).classList.add("live");
            e.target.querySelectorAll(".dc .v").forEach(countUp);
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.35 }
    );
    io.observe(win);
    return () => io.disconnect();
  }, []);

  const gid = compact ? "ccg2" : "ccg";
  return (
    <div className="win" ref={ref}>
      <div className="win-bar">
        <div className="win-dots">
          <i /><i /><i />
        </div>
        <div className="win-url">command center · Vivo</div>
      </div>
      <div className="dash">
        <div className="dash-side">
          <div className="brandmark">VIVO</div>
          <div className="ws"><span className="dot" />Sample Client</div>
          <div className="nav-i on"><Icon name="layout-dashboard" /> Overview</div>
          <div className="nav-i"><Icon name="megaphone" /> Campaigns</div>
          <div className="nav-i"><Icon name="users" /> Leads</div>
          <div className="nav-i"><Icon name="phone-call" /> Contact queue</div>
          <div className="nav-i"><Icon name="kanban" /> Pipeline</div>
          <div className="nav-i"><Icon name="sparkles" /> AI Insights</div>
          <div className="nav-i"><Icon name="bar-chart-3" /> Reports</div>
        </div>
        <div className="dash-main">
          <div className="dash-h">Sample Client — Overview</div>
          <div className="dash-sub">All channels · unified · illustrative sample data</div>
          <div className="dash-cards">
            <div className="dc"><div className="k">Ad spend</div><div className="v">$5,700</div><div className="d">Meta · Google · TikTok</div></div>
            <div className="dc"><div className="k">Leads</div><div className="v">470</div><div className="d"><Icon name="arrow-up-right" style={{ width: 11, height: 11 }} /> unified</div></div>
            <div className="dc"><div className="k">Cost per lead</div><div className="v">$12</div><div className="d">blended</div></div>
            <div className="dc"><div className="k">Cities</div><div className="v">40+</div><div className="d">U.S. markets</div></div>
          </div>
          <div className="dash-row">
            <div className="dash-panel">
              <div className="pt">Spend &amp; leads</div>
              <div className="ps">Daily performance across all connected channels</div>
              <svg viewBox="0 0 480 150" preserveAspectRatio="none" style={{ width: "100%", height: 150 }}>
                <defs>
                  <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor="rgba(1,22,64,0.16)" />
                    <stop offset="1" stopColor="rgba(1,22,64,0)" />
                  </linearGradient>
                </defs>
                <path d="M0,96 L48,70 L96,84 L144,52 L192,64 L240,40 L288,58 L336,34 L384,50 L432,28 L480,44 L480,150 L0,150 Z" className="chart-fill" fill={`url(#${gid})`} />
                <path d="M0,96 L48,70 L96,84 L144,52 L192,64 L240,40 L288,58 L336,34 L384,50 L432,28 L480,44" className="chart-path" fill="none" stroke="#011640" strokeWidth="2.5" />
                <path d="M0,132 L48,128 L96,130 L144,124 L192,126 L240,120 L288,123 L336,118 L384,121 L432,115 L480,119" className="chart-path lag" fill="none" stroke="#04D98B" strokeWidth="2.5" />
              </svg>
            </div>
            <div className="dash-panel">
              <div className="pt" style={{ display: "flex", alignItems: "center", gap: 7 }}>
                <Icon name="sparkles" style={{ width: 15, height: 15, color: "var(--vivo-green-700)" }} /> AI Insights
              </div>
              <div className="ps">Generated by the analyst engine</div>
              <div className="ai-i warn"><Icon name="alert-triangle" /><p>City A cost per lead is running far above City B. Recommend shifting budget.</p></div>
              <div className="ai-i"><Icon name="target" /><p>Top-scoring leads are concentrated in 3 markets — prioritize outreach there.</p></div>
              {!compact && (
                <div className="ai-i"><Icon name="clock" /><p>28 follow-ups due today. Queue ordered by score and time waiting.</p></div>
              )}
            </div>
          </div>
          <div className="dash-cap"><span className="badge">Illustrative</span> Synthetic sample data — not a client&apos;s real account or figures.</div>
        </div>
      </div>
    </div>
  );
}
