import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { createClient } from "@supabase/supabase-js";
import { SUPABASE_URL, SUPABASE_ANON_KEY, SERVICE_ROLE_KEY } from "./config";

/** Request-scoped client that reads/writes the auth cookie (for admin session). */
export async function supabaseServer() {
  const cookieStore = await cookies();
  return createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(list: { name: string; value: string; options?: Record<string, unknown> }[]) {
        try {
          list.forEach(({ name, value, options }) => cookieStore.set(name, value, options as never));
        } catch {
          /* called from a Server Component — ignore, middleware refreshes */
        }
      },
    },
  });
}

/** Elevated client for trusted server writes (seeding, form inserts). Bypasses RLS. */
export function supabaseAdmin() {
  return createClient(SUPABASE_URL, SERVICE_ROLE_KEY || SUPABASE_ANON_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
