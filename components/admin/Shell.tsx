"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "../Icon";
import { supabaseBrowser } from "@/lib/supabase/browser";
import { useRouter } from "next/navigation";

const NAV = [
  { group: "Main" },
  { href: "/admin", label: "Dashboard", icon: "layout-dashboard" },
  { href: "/admin/pages", label: "Pages", icon: "file-text" },
  { href: "/admin/editor", label: "Visual editor", icon: "pencil" },
  { href: "/admin/media", label: "Media", icon: "image" },
  { group: "Manage" },
  { href: "/admin/submissions", label: "Submissions", icon: "inbox" },
  { href: "/admin/users", label: "Users", icon: "users" },
  { href: "/admin/settings", label: "Settings", icon: "settings" },
];

export function Shell({ email, title, actions, children }: { email?: string; title: string; actions?: React.ReactNode; children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const isActive = (href: string) => (href === "/admin" ? pathname === "/admin" : pathname.startsWith(href));
  async function logout() { await supabaseBrowser().auth.signOut(); router.replace("/admin/login"); router.refresh(); }

  return (
    <div className="wp">
      <aside className="wp-side">
        <div className="wp-brand">VI<span>V</span>O · Admin</div>
        <nav className="wp-nav">
          {NAV.map((item, i) =>
            "group" in item ? (
              <div className="grp" key={i}>{item.group}</div>
            ) : (
              <Link key={item.href} href={item.href} className={isActive(item.href) ? "on" : ""}>
                <Icon name={item.icon} /> {item.label}
              </Link>
            )
          )}
        </nav>
        <div className="wp-side-foot">
          <div className="who">{email}</div>
          <div className="row">
            <Link href="/" target="_blank">View site ↗</Link>
            <button onClick={logout}>Sign out</button>
          </div>
        </div>
      </aside>
      <div className="wp-main">
        <div className="wp-topbar">
          <h1>{title}</h1>
          <div className="sp" />
          {actions}
        </div>
        <div className="wp-content">{children}</div>
      </div>
    </div>
  );
}
