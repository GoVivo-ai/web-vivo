"use client";
import { useEffect, useState } from "react";
import { Icon } from "@/components/Icon";

type U = { id: string; email: string; created_at: string; last_sign_in_at: string | null; isAdmin: boolean };

export function UsersManager({ selfId }: { selfId: string }) {
  const [users, setUsers] = useState<U[]>([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [makeAdmin, setMakeAdmin] = useState(true);
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function load() {
    setLoading(true);
    const r = await fetch("/api/admin/users");
    const j = await r.json();
    if (j.ok) setUsers(j.users);
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  const flash = (m: string) => { setMsg(m); setTimeout(() => setMsg(null), 2500); };

  async function create(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    const r = await fetch("/api/admin/users", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, password, makeAdmin }) });
    const j = await r.json();
    setBusy(false);
    if (j.ok) { setEmail(""); setPassword(""); flash("User created ✓"); load(); }
    else flash(j.error || "Failed");
  }
  async function toggleAdmin(u: U) {
    await fetch("/api/admin/users", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: u.id, admin: !u.isAdmin, email: u.email }) });
    load();
  }
  async function resetPw(u: U) {
    const pw = prompt(`New password for ${u.email} (min 8 chars):`);
    if (!pw) return;
    const r = await fetch("/api/admin/users", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: u.id, password: pw }) });
    const j = await r.json();
    flash(j.ok ? "Password updated ✓" : j.error || "Failed");
  }
  async function del(u: U) {
    if (!confirm(`Delete ${u.email}? This cannot be undone.`)) return;
    const r = await fetch("/api/admin/users", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: u.id }) });
    const j = await r.json();
    if (j.ok) { flash("Deleted"); load(); } else flash(j.error || "Failed");
  }

  return (
    <>
      <div className="wp-panel">
        <h2>Add a user</h2>
        <form className="wp-form" onSubmit={create} style={{ padding: 18 }}>
          <div><label>Email</label><input className="ed-input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="person@govivo.ai" required /></div>
          <div><label>Password</label><input className="ed-input" type="text" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="min 8 characters" required /></div>
          <label style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 400 }}>
            <input type="checkbox" checked={makeAdmin} onChange={(e) => setMakeAdmin(e.target.checked)} /> Grant admin access
          </label>
          <button className="adm-btn" disabled={busy} style={{ alignSelf: "flex-start" }}>{busy ? "Creating…" : "Create user"}</button>
        </form>
      </div>

      <div className="wp-panel">
        <h2>Users ({users.length})</h2>
        {loading ? <div className="wp-row"><span className="s">Loading…</span></div> : users.map((u) => (
          <div className="wp-row" key={u.id}>
            <div>
              <div className="t">{u.email} {u.id === selfId && <span className="s">(you)</span>}</div>
              <div className="s">{u.last_sign_in_at ? "Last sign-in " + new Date(u.last_sign_in_at).toLocaleDateString() : "Never signed in"}</div>
            </div>
            <div className="sp" />
            <span className={`badge${u.isAdmin ? "" : " gray"}`}>{u.isAdmin ? "Admin" : "No access"}</span>
            <button className="ed-icobtn" title={u.isAdmin ? "Revoke admin" : "Grant admin"} onClick={() => toggleAdmin(u)} disabled={u.id === selfId}><Icon name={u.isAdmin ? "shield-off" : "shield-check"} size={16} /></button>
            <button className="ed-icobtn" title="Reset password" onClick={() => resetPw(u)}><Icon name="key-round" size={16} /></button>
            <button className="ed-icobtn" title="Delete" onClick={() => del(u)} disabled={u.id === selfId}><Icon name="trash-2" size={16} /></button>
          </div>
        ))}
      </div>
      {msg && <div className="ed-toast">{msg}</div>}
    </>
  );
}
