import Link from "next/link";
import type { SiteSettings } from "@/lib/blocks/types";

export function Footer({ settings }: { settings: SiteSettings }) {
  const f = settings.footer;
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-top">
          <div>
            <Link className="logo" href="/">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/brand/logo-white.svg" alt="Vivo" />
            </Link>
            <p className="blurb">{f.blurb}</p>
          </div>
          {f.columns.map((col) => (
            <div className="col" key={col.heading}>
              <h5>{col.heading}</h5>
              {col.links.map((l) => (
                <Link key={l.label + l.href} href={l.href}>{l.label}</Link>
              ))}
            </div>
          ))}
        </div>
        <div className="footer-bottom">
          <span>{f.copyright}</span>
          <span className="footer-contact">
            {f.phone && <a href={`tel:${f.phone.replace(/[^+\d]/g, "")}`}>{f.phone}</a>}
            {f.phone && f.email && <span aria-hidden="true"> · </span>}
            {f.email && <a href={`mailto:${f.email}`}>{f.email}</a>}
            {(f.phone || f.email) && f.contactLine && <span aria-hidden="true"> · </span>}
            {f.contactLine && <span>{f.contactLine}</span>}
          </span>
        </div>
      </div>
    </footer>
  );
}
