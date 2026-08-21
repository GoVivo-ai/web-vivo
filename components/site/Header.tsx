"use client";

import { useState } from "react";
import Link from "next/link";
import type { SiteSettings } from "@/lib/blocks/types";

export function Header({ settings, activeGroup }: { settings: SiteSettings; activeGroup: string | null }) {
  const [open, setOpen] = useState(false);

  return (
    <header className={`header${open ? " menu-open" : ""}`}>
      <div className="container">
        <Link className="logo" href="/" aria-label="Vivo home" onClick={() => setOpen(false)}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/logo-color.svg" alt="Vivo" />
        </Link>
        <nav className="nav">
          {settings.nav.map((item) => (
            <Link key={item.href} href={item.href} className={activeGroup === item.group ? "active" : undefined}>
              {item.label}
            </Link>
          ))}
        </nav>
        <Link className="btn btn-primary header-cta" href={settings.headerCta.href}>
          <span>{settings.headerCta.label}</span>
        </Link>
        <button
          type="button"
          className="nav-toggle"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((v) => !v)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>
      <nav id="mobile-nav" className="mobile-nav" aria-hidden={!open}>
        {settings.nav.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={activeGroup === item.group ? "active" : undefined}
            onClick={() => setOpen(false)}
          >
            {item.label}
          </Link>
        ))}
        <Link className="btn btn-primary" href={settings.headerCta.href} onClick={() => setOpen(false)}>
          <span>{settings.headerCta.label}</span>
        </Link>
      </nav>
    </header>
  );
}
