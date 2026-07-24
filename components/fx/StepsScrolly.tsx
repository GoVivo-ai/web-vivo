"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

type Step = {
  num?: string | number;
  label?: string;
  title?: string;
  text?: string;
  image?: string;
  imageAlt?: string;
};

/**
 * Pinned scroll-driven process showcase ("How a Vivo team gets built").
 * The stage pins to the viewport and scroll scrubs through the steps:
 * images wipe in with a clip-path, texts crossfade, the oversized step
 * number rolls like a counter, and a progress rail draws itself with
 * clickable nodes. Desktop-only — the caller renders a static fallback
 * that CSS shows on mobile / reduced motion / no-JS.
 */
export function StepsScrolly({ steps }: { steps: Step[] }) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || steps.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.matchMedia("(max-width: 900px)").matches) return;
    if (root.closest(".ed-blk")) return; // never pin inside the admin editor

    root.classList.add("ss-on"); // reveals the stage
    const section = root.closest("section");
    section?.classList.add("ss-live"); // hides the static fallback (survives GSAP's pin-spacer rewrap)
    gsap.registerPlugin(ScrollTrigger);
    const n = steps.length;
    const q = gsap.utils.selector(root);

    const ctx = gsap.context(() => {
      const texts = q<HTMLElement>(".ss-text");
      const imgs = q<HTMLElement>(".ss-media-item");
      const numsCol = q<HTMLElement>(".ss-nums-col")[0];
      const nodes = q<HTMLElement>(".ss-node");
      const line = q<HTMLElement>(".ss-line-fill")[0];

      gsap.set(texts.slice(1), { autoAlpha: 0, y: 34 });
      gsap.set(imgs.slice(1), { clipPath: "inset(100% 0% 0% 0%)", scale: 1.08 });
      nodes[0]?.classList.add("on");

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: root,
          start: "top top+=84",
          end: "+=" + n * 85 + "%",
          pin: true,
          scrub: 0.6,
          onUpdate: (st) => {
            const active = Math.min(n - 1, Math.round(st.progress * (n - 1)));
            nodes.forEach((el, i) => el.classList.toggle("on", i <= active));
          },
        },
      });

      for (let i = 1; i < n; i++) {
        const at = i - 1;
        tl.to(texts[i - 1], { autoAlpha: 0, y: -34, duration: 0.35, ease: "power2.in" }, at);
        tl.to(imgs[i], { clipPath: "inset(0% 0% 0% 0%)", scale: 1, duration: 0.7, ease: "power2.inOut" }, at + 0.15);
        tl.to(texts[i], { autoAlpha: 1, y: 0, duration: 0.45, ease: "power2.out" }, at + 0.4);
        if (numsCol) tl.to(numsCol, { yPercent: -(100 / n) * i, duration: 0.6, ease: "power2.inOut" }, at + 0.2);
      }
      if (line) gsap.set(line, { scaleY: 0 });
      if (line)
        gsap.to(line, {
          scaleY: 1,
          ease: "none",
          scrollTrigger: { trigger: root, start: "top top+=84", end: "+=" + n * 85 + "%", scrub: 0.6 },
        });

      // Rail nodes jump straight to their step
      const st = tl.scrollTrigger!;
      nodes.forEach((node, i) => {
        node.addEventListener("click", () => {
          const y = st.start + ((st.end - st.start) * i) / (n - 1);
          window.scrollTo({ top: y + 2, behavior: "smooth" });
        });
      });
    }, root);

    return () => {
      ctx.revert();
      root.classList.remove("ss-on");
      section?.classList.remove("ss-live");
    };
  }, [steps]);

  return (
    <div className="ss-stage" ref={rootRef}>
      <div className="ss-grid">
        <div className="ss-rail" aria-hidden="true">
          <div className="ss-line"><span className="ss-line-fill" /></div>
          {steps.map((_, i) => (
            <button className="ss-node" key={i} type="button" aria-label={`Step ${i + 1}`} style={{ top: `${(i / (steps.length - 1)) * 100}%` }}>
              <span>{i + 1}</span>
            </button>
          ))}
        </div>
        <div className="ss-copy">
          <div className="ss-nums" aria-hidden="true">
            <div className="ss-nums-col">
              {steps.map((s, i) => (
                <div className="ss-num" key={i}>
                  {s.num || i + 1}
                  <small>{s.label}</small>
                </div>
              ))}
            </div>
          </div>
          <div className="ss-texts">
            {steps.map((s, i) => (
              <div className="ss-text" key={i}>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="ss-media">
          {steps.map((s, i) => (
            <div className="ss-media-item" key={i}>
              {s.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={s.image} alt={s.imageAlt || s.title || ""} loading={i === 0 ? "eager" : "lazy"} />
              ) : (
                <div className="ss-media-ph">{s.label || s.title}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
