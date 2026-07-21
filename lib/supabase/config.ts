export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
export const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

/** Whether a Supabase backend is configured. When false, the site runs on seed content. */
export const hasSupabase = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
