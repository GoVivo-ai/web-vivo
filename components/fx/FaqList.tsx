"use client";
import { useState } from "react";
import { Rich } from "../blocks/ui";

/**
 * Animated FAQ accordion: card items, one open at a time, smooth
 * grid-rows height transition, rotating icon, green accent on the
 * active item. First question starts open.
 */
export function FaqList({ items }: { items: { q?: string; a?: string }[] }) {
  const [open, setOpen] = useState(0);
  return (
    <div className="faq-fancy">
      {items.map((f, i) => {
        const isOpen = open === i;
        return (
          <div className={`fq${isOpen ? " open" : ""}`} key={i}>
            <button type="button" className="fq-q" aria-expanded={isOpen} onClick={() => setOpen(isOpen ? -1 : i)}>
              <Rich html={f.q} />
              <span className="fq-ico" aria-hidden="true">+</span>
            </button>
            <div className="fq-a">
              <div className="fq-a-in">
                <Rich as="p" html={f.a} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
