import { createClient } from "@supabase/supabase-js";

/**
 * SERVER-ONLY CLIENT. Uses the Supabase service role key, which bypasses
 * Row Level Security entirely. NEVER import this file into a "use client"
 * component — only into files marked "use server". SUPABASE_SERVICE_ROLE_KEY
 * must never be prefixed with NEXT_PUBLIC_ or it will be exposed to the browser.
 */
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const isSupabaseAdminConfigured = Boolean(supabaseUrl && serviceRoleKey);

export const supabaseAdmin = isSupabaseAdminConfigured
  ? createClient(supabaseUrl as string, serviceRoleKey as string, {
      auth: { autoRefreshToken: false, persistSession: false },
    })
  : null;
