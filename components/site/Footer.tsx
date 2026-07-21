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
          <span style={{ fontFamily: "ui-monospace,monospace" }}>{f.contactLine}</span>
        </div>
      </div>
    </footer>
  );
}
