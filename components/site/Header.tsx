import Link from "next/link";
import type { SiteSettings } from "@/lib/blocks/types";

export function Header({ settings, activeGroup }: { settings: SiteSettings; activeGroup: string | null }) {
  return (
    <header className="header">
      <div className="container">
        <Link className="logo" href="/" aria-label="Vivo home">
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
        <Link className="btn btn-primary" href={settings.headerCta.href}>
          <span>{settings.headerCta.label}</span>
        </Link>
      </div>
    </header>
  );
}
