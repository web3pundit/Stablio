import { createClient } from '@supabase/supabase-js';

// Assign the environment variables to constants
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Log the values for debugging (optional, remove in production)
('Supabase URL:', supabaseUrl);
('Supabase Anon Key:', supabaseAnonKey);

// Create and export the Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);