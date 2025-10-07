import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

// Create a singleton Supabase client. If envs are missing, we still export a client
// with empty strings so the app does not crash in non-auth scenarios; operations
// will fail until envs are configured.
export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '');


