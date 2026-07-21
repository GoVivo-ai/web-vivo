"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabase/browser";

export function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setErr(null);
    const sb = supabaseBrowser();
    const { error } = await sb.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) {
      setErr(error.message);
      return;
    }
    router.replace(params.get("next") || "/admin");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit}>
      <label>Email</label>
      <input className="ed-input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@govivo.ai" required />
      <label>Password</label>
      <input className="ed-input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required />
      {err && <p className="err">{err}</p>}
      <button className="adm-btn" style={{ width: "100%", justifyContent: "center", marginTop: 22 }} disabled={busy}>
        {busy ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
