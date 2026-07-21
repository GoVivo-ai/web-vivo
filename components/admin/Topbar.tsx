import Link from "next/link";
import { LogoutButton } from "./LogoutButton";

export function Topbar({ email, active }: { email?: string; active?: "dash" | "editor" | "subs" }) {
  return (
    <div className="adm-topbar">
      <Link href="/admin" className="brand" style={{ color: "#fff" }}>VI<span>V</span>O · Admin</Link>
      <Link href="/admin" style={{ opacity: active === "dash" ? 1 : undefined }}>Pages</Link>
      <Link href="/admin/editor" style={{ opacity: active === "editor" ? 1 : undefined }}>Editor</Link>
      <Link href="/admin/submissions" style={{ opacity: active === "subs" ? 1 : undefined }}>Submissions</Link>
      <div className="sp" />
      <Link href="/" target="_blank">View site ↗</Link>
      {email && <span className="who">{email}</span>}
      <LogoutButton />
    </div>
  );
}
