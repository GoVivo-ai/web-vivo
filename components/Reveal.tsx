"use client";
import { useEffect, useRef, type ElementType, type ReactNode } from "react";

/** Scroll reveal — mirrors the prototype's IntersectionObserver (threshold 0.12). */
export function Reveal({
  as: Tag = "div",
  className = "",
  children,
  ...rest
}: { as?: ElementType; className?: string; children?: ReactNode } & Record<string, unknown>) {
  const ref = useRef<HTMLElement | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // stagger by index within parent (× 70ms), like the prototype
    let idx = 0;
    let s: Element | null = el;
    while ((s = s.previousElementSibling)) {
      if (s.classList?.contains("reveal")) idx++;
    }
    el.style.setProperty("--d", `${Math.min(idx, 6) * 70}ms`);
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
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <Tag ref={ref as never} className={`reveal ${className}`.trim()} {...rest}>
      {children}
    </Tag>
  );
}
