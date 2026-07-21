import { LoginForm } from "./LoginForm";
import { hasSupabase } from "@/lib/supabase/config";

export const dynamic = "force-dynamic";

export default function LoginPage() {
  return (
    <div className="adm-login">
      <div className="box">
        <div className="brand">VI<span>V</span>O · Admin</div>
        <p className="sub">Sign in to manage the website.</p>
        {hasSupabase ? (
          <LoginForm />
        ) : (
          <div className="adm-notice" style={{ marginTop: 0 }}>
            Supabase isn&apos;t configured yet. Add <code>NEXT_PUBLIC_SUPABASE_URL</code>,{" "}
            <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> and <code>SUPABASE_SERVICE_ROLE_KEY</code> to your
            environment, run the SQL migration, then create an admin user in Supabase Auth.
          </div>
        )}
      </div>
    </div>
  );
}
