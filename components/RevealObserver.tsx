"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Global reveal engine (mirrors the prototype): a single IntersectionObserver
 * reveals every `.reveal` element on the page — both <Reveal> components and
 * raw `.reveal` class nodes — and sets the sibling stagger (--d). A Mutation
 * observer picks up nodes added after navigation or live edits.
 */
export function RevealObserver() {
  const pathname = usePathname();
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    const scan = () => {
      document.querySelectorAll<HTMLElement>(".reveal:not(.in)").forEach((el) => {
        if (el.dataset.revObserved) return;
        el.dataset.revObserved = "1";
        let idx = 0;
        let s: Element | null = el;
        while ((s = s.previousElementSibling)) {
          if (s.classList?.contains("reveal")) idx++;
        }
        el.style.setProperty("--d", `${Math.min(idx, 6) * 70}ms`);
        if (reduced) {
          el.classList.add("in");
        } else {
          io.observe(el);
        }
      });
    };
    scan();
    const mo = new MutationObserver(() => scan());
    mo.observe(document.body, { childList: true, subtree: true });
    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, [pathname]);
  return null;
}
