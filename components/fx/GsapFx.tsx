"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * GSAP motion engine (progressive enhancement). When it mounts it takes over
 * from the CSS/IntersectionObserver reveals: the `fx-gsap` class on <html>
 * turns those off and GSAP drives every entrance + parallax instead.
 * Re-initializes on every route change. Entrances are triggered by an
 * IntersectionObserver (not ScrollTrigger positions) so late-loading images
 * can never leave content stuck invisible. Skipped under prefers-reduced-motion.
 */
export function GsapFx() {
  const pathname = usePathname();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.registerPlugin(ScrollTrigger);
    document.documentElement.classList.add("fx-gsap");

    let io: IntersectionObserver | undefined;
    const ctx = gsap.context(() => {
      /* ── Hero intro: staggered rise + photo settle ── */
      const heroInner = document.querySelector(".hero-inner");
      if (heroInner) {
        gsap.fromTo(
          heroInner.children,
          { y: 44, opacity: 0 },
          { y: 0, opacity: 1, duration: 1, ease: "power3.out", stagger: 0.09, delay: 0.1 }
        );
      }
      const heroImg = document.querySelector(".hero-media img");
      if (heroImg) {
        gsap.fromTo(heroImg, { scale: 1.12 }, { scale: 1, duration: 1.6, ease: "power2.out" });
        gsap.to(heroImg, {
          yPercent: 10,
          ease: "none",
          scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true },
        });
      }

      /* ── Contrast cards: 3D flip-up cascade (their own signature entrance) ── */
      const contrastCards = gsap.utils.toArray<HTMLElement>(".contrast-dark .contrast .c");
      if (contrastCards.length) {
        gsap.set(contrastCards, { y: 70, opacity: 0, rotationX: 22, transformOrigin: "center bottom" });
        const cio = new IntersectionObserver(
          (entries) => {
            if (!entries.some((e) => e.isIntersecting)) return;
            cio.disconnect();
            gsap.to(contrastCards, { y: 0, opacity: 1, rotationX: 0, duration: 1.05, ease: "back.out(1.3)", stagger: 0.14 });
          },
          { threshold: 0.2 }
        );
        cio.observe(contrastCards[0].parentElement || contrastCards[0]);
      }

      /* ── Home 60-days steps: connector line draws, cards cascade, numbers pop ── */
      const flowSteps = gsap.utils.toArray<HTMLElement>(".steps-flow .step");
      const flowGrid = document.querySelector(".steps-flow .steps");
      if (flowSteps.length && flowGrid) {
        const flowLine = flowGrid.querySelector(".steps-line-fill");
        const flowNums = flowSteps.map((s) => s.querySelector(".num")).filter(Boolean);
        gsap.set(flowSteps, { y: 54, opacity: 0 });
        gsap.set(flowNums, { scale: 0.3, opacity: 0, transformOrigin: "left bottom" });
        const fio = new IntersectionObserver(
          (entries) => {
            if (!entries.some((e) => e.isIntersecting)) return;
            fio.disconnect();
            const tl = gsap.timeline();
            if (flowLine) tl.fromTo(flowLine, { scaleX: 0 }, { scaleX: 1, duration: 1.4, ease: "power2.inOut" }, 0);
            tl.to(flowSteps, { y: 0, opacity: 1, duration: 0.8, ease: "power3.out", stagger: 0.18 }, 0.1);
            flowNums.forEach((num, i) => {
              tl.to(num, { scale: 1, opacity: 1, duration: 0.7, ease: "back.out(2.4)" }, 0.25 + i * 0.18);
              tl.fromTo(
                num,
                { textShadow: "0 0 26px rgba(4,217,139,0.95)" },
                { textShadow: "0 0 0px rgba(4,217,139,0)", duration: 0.9, ease: "power2.out" },
                0.4 + i * 0.18
              );
            });
          },
          { threshold: 0.25 }
        );
        fio.observe(flowGrid);
      }

      /* ── Scroll entrances: IO-triggered so they can never get stuck ── */
      const reveals = gsap.utils
        .toArray<HTMLElement>(".reveal")
        .filter((el) => !el.closest(".hero") && !contrastCards.includes(el) && !flowSteps.includes(el));
      const vh = window.innerHeight;
      const pending = new Set<HTMLElement>();
      reveals.forEach((el) => {
        // Anything already on screen at init animates immediately; the rest waits for IO.
        const r = el.getBoundingClientRect();
        if (r.top < vh * 0.92 && r.bottom > 0) {
          gsap.fromTo(el, { y: 36, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, ease: "power3.out", delay: 0.05 });
        } else {
          pending.add(el);
          gsap.set(el, { y: 36, opacity: 0 });
        }
      });
      io = new IntersectionObserver(
        (entries) => {
          const batch = entries.filter((e) => e.isIntersecting).map((e) => e.target as HTMLElement);
          if (!batch.length) return;
          batch.forEach((el) => { pending.delete(el); io!.unobserve(el); });
          gsap.to(batch, { y: 0, opacity: 1, duration: 0.9, ease: "power3.out", stagger: 0.09, overwrite: true });
        },
        { threshold: 0.05, rootMargin: "0px 0px -8% 0px" }
      );
      pending.forEach((el) => io!.observe(el));

      /* ── Imagery drift: step images + split photos get a soft parallax ── */
      gsap.utils.toArray<HTMLElement>(".step-img, .split .ph-slot, .split img").forEach((el) => {
        gsap.fromTo(
          el,
          { y: 24 },
          {
            y: -24,
            ease: "none",
            scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: 0.6 },
          }
        );
      });
    });

    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener("load", onLoad);
    // Late image loads shift layout; keep parallax positions fresh.
    const refreshTimer = window.setTimeout(() => ScrollTrigger.refresh(), 1200);

    return () => {
      window.removeEventListener("load", onLoad);
      window.clearTimeout(refreshTimer);
      io?.disconnect();
      ctx.revert();
      document.documentElement.classList.remove("fx-gsap");
    };
  }, [pathname]);
  return null;
}
