import { createClient } from '@supabase/supabase-js';

// Support multiple env variable names so you don't have to rename them in Vercel.
// Safe, browser-exposed keys ONLY (anon/public). We intentionally do not read
// service role or database credentials here.
const supabaseUrl = (
  import.meta.env.VITE_SUPABASE_URL ||
  import.meta.env.VITE_SUPABASE_NEXT_PUBLIC_SUPABASE_URL ||
  import.meta.env.VITE_SUPABASE_SUPABASE_URL
) as string | undefined;

const supabaseAnonKey = (
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  import.meta.env.VITE_SUPABASE_NEXT_PUBLIC_SUPABASE_ANON_KEY
) as string | undefined;

// Create a singleton Supabase client. If envs are missing, we still export a client
// with empty strings so the app does not crash in non-auth scenarios; operations
// will fail until envs are configured.
export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '');


