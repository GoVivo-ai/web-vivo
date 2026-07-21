"use client";
import { useEffect } from "react";

/** Global header elevation + scroll-progress bar (from the prototype's motion engine). */
export function ScrollFx() {
  useEffect(() => {
    const header = document.querySelector(".header");
    let bar = document.querySelector<HTMLDivElement>(".progress");
    if (!bar) {
      bar = document.createElement("div");
      bar.className = "progress";
      document.body.appendChild(bar);
    }
    const onScroll = () => {
      const y = window.scrollY || document.documentElement.scrollTop;
      header?.classList.toggle("scrolled", y > 8);
      const h = document.documentElement.scrollHeight - window.innerHeight;
      if (bar) bar.style.width = (h > 0 ? (y / h) * 100 : 0) + "%";
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return null;
}
